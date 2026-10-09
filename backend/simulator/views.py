import base64
from io import BytesIO

import numpy as np

import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .ofdm_engine import simulate_ofdm


# =========================================================
# CONFIGURATION
# =========================================================

FFT_SIZE = 64


# =========================================================
# GRAPH -> BASE64
# =========================================================

def b64(fig):
    """
    Convert a Matplotlib figure into a Base64 PNG string.
    """

    buffer = BytesIO()

    fig.savefig(
        buffer,
        format="png",
        dpi=180,
        bbox_inches="tight",
        facecolor="white"
    )

    plt.close(fig)

    buffer.seek(0)

    return base64.b64encode(
        buffer.getvalue()
    ).decode("utf-8")


# =========================================================
# CORS RESPONSE
# =========================================================

def api_response(data, status=200):
    """
    Return JSON response and allow the React frontend
    running on localhost:5173 to access the API.
    """

    response = JsonResponse(
        data,
        status=status
    )

    response["Access-Control-Allow-Origin"] = "*"

    return response


# =========================================================
# OFDM WAVEFORM
# =========================================================

def waveform(signal):
    """
    Generate the OFDM time-domain waveform graph.
    """

    figure, axis = plt.subplots(
        figsize=(12, 4.8),
        dpi=140
    )

    samples = signal.real[:160]

    axis.plot(
        samples,
        linewidth=1.5
    )

    axis.set_title(
        "OFDM Time-Domain Waveform",
        fontweight="bold"
    )

    axis.set_xlabel(
        "Sample Index"
    )

    axis.set_ylabel(
        "Amplitude"
    )

    axis.grid(
        alpha=0.25
    )

    figure.tight_layout()

    return b64(figure)


# =========================================================
# QPSK CONSTELLATION
# =========================================================

def constellation(symbols):
    """
    Generate the received QPSK constellation.
    """

    figure, axis = plt.subplots(
        figsize=(7, 6),
        dpi=140
    )

    points = symbols[:1500]

    axis.scatter(
        points.real,
        points.imag,
        s=18,
        alpha=0.65
    )

    # Ideal QPSK points
    ideal = np.array([
        (1 + 1j) / np.sqrt(2),
        (-1 + 1j) / np.sqrt(2),
        (-1 - 1j) / np.sqrt(2),
        (1 - 1j) / np.sqrt(2)
    ])

    axis.scatter(
        ideal.real,
        ideal.imag,
        marker="x",
        s=100,
        linewidths=2
    )

    axis.axhline(
        0,
        linewidth=0.8,
        alpha=0.3
    )

    axis.axvline(
        0,
        linewidth=0.8,
        alpha=0.3
    )

    axis.set_title(
        "QPSK Constellation After Equalization",
        fontweight="bold"
    )

    axis.set_xlabel(
        "In-Phase (I)"
    )

    axis.set_ylabel(
        "Quadrature (Q)"
    )

    axis.grid(
        alpha=0.22
    )

    axis.set_aspect(
        "equal",
        adjustable="box"
    )

    figure.tight_layout()

    return b64(figure)


# =========================================================
# BER VS SNR
# =========================================================

def berplot(number_of_bits, cp_length):
    """
    Generate BER versus SNR graph.

    The graph uses the same QPSK OFDM + AWGN system
    used by the main simulation.
    """

    snr_values = [
        -5,
        0,
        5,
        10,
        15,
        20,
        25,
        30
    ]

    ber_values = []

    # Use at least 2000 bits for a more useful BER curve.
    test_bits = max(
        int(number_of_bits),
        2000
    )

    for snr in snr_values:

        result = simulate_ofdm(
            number_of_bits=test_bits,
            subcarriers=FFT_SIZE,
            cp_length=cp_length,
            snr_db=snr
        )

        ber = result["ber"]

        # Avoid zero on logarithmic graph.
        ber_values.append(
            max(float(ber), 1e-6)
        )


    figure, axis = plt.subplots(
        figsize=(10, 5),
        dpi=140
    )

    axis.semilogy(
        snr_values,
        ber_values,
        "o-",
        linewidth=2,
        markersize=5
    )

    axis.set_title(
        "BER vs SNR — QPSK OFDM with AWGN",
        fontweight="bold"
    )

    axis.set_xlabel(
        "SNR (dB)"
    )

    axis.set_ylabel(
        "Bit Error Rate (BER)"
    )

    axis.set_xticks(
        snr_values
    )

    axis.grid(
        which="both",
        alpha=0.25
    )

    figure.tight_layout()

    return b64(figure)


# =========================================================
# SIMULATION API
# =========================================================

@csrf_exempt
def simulate_api(request):

    # -----------------------------------------------------
    # Only POST is allowed
    # -----------------------------------------------------

    if request.method != "POST":

        return api_response(
            {
                "success": False,
                "error": "POST required"
            },
            status=405
        )


    try:

        # -------------------------------------------------
        # Read parameters sent by React
        # -------------------------------------------------

        number_of_bits = int(
            request.POST.get(
                "bits",
                1000
            )
        )

        cp_length = int(
            request.POST.get(
                "cp",
                16
            )
        )

        snr_db = float(
            request.POST.get(
                "snr",
                10
            )
        )


        # -------------------------------------------------
        # Validation
        # -------------------------------------------------

        if number_of_bits < 1:

            return api_response(
                {
                    "success": False,
                    "error": "Number of bits must be greater than 0."
                },
                status=400
            )


        if number_of_bits > 100000:

            return api_response(
                {
                    "success": False,
                    "error": "Number of bits cannot exceed 100000."
                },
                status=400
            )


        if cp_length < 1:

            return api_response(
                {
                    "success": False,
                    "error": "Cyclic Prefix must be at least 1."
                },
                status=400
            )


        if cp_length >= FFT_SIZE:

            return api_response(
                {
                    "success": False,
                    "error": "Cyclic Prefix must be smaller than 64."
                },
                status=400
            )


        if snr_db < -20 or snr_db > 50:

            return api_response(
                {
                    "success": False,
                    "error": "SNR must be between -20 dB and 50 dB."
                },
                status=400
            )


        # -------------------------------------------------
        # MAIN OFDM SIMULATION
        # -------------------------------------------------

        result = simulate_ofdm(
            number_of_bits=number_of_bits,
            subcarriers=FFT_SIZE,
            cp_length=cp_length,
            snr_db=snr_db
        )


        # -------------------------------------------------
        # Generate graphs
        # -------------------------------------------------

        waveform_image = waveform(
            result["time_signal"]
        )


        constellation_image = constellation(
            result["equalized_symbols"]
        )


        ber_graph_image = berplot(
            number_of_bits,
            cp_length
        )


        # -------------------------------------------------
        # BER
        # -------------------------------------------------

        ber = float(
            result["ber"]
        )


        # -------------------------------------------------
        # Number of OFDM symbols
        # -------------------------------------------------

        ofdm_symbols = result.get(
            "ofdm_symbols",
            result.get(
                "num_symbols",
                0
            )
        )


        # -------------------------------------------------
        # Final JSON response
        # -------------------------------------------------

        return api_response(
            {
                "success": True,

                "parameters": {
                    "bits": number_of_bits,
                    "modulation": "QPSK",
                    "subcarriers": FFT_SIZE,
                    "cp": cp_length,
                    "snr": snr_db,
                    "channel": "AWGN"
                },

                "results": {
                    "ber": ber,
                    "ber_percent": ber * 100,
                    "ofdm_symbols": ofdm_symbols
                },

                "graphs": {
                    "waveform": waveform_image,
                    "constellation": constellation_image,
                    "ber_vs_snr": ber_graph_image
                }
            }
        )


    except ValueError as error:

        return api_response(
            {
                "success": False,
                "error": str(error)
            },
            status=400
        )


    except Exception as error:

        return api_response(
            {
                "success": False,
                "error": str(error)
            },
            status=500
        )