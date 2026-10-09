# OFDM Simulator — React + Django

Complete college-project website for **Simulation of OFDM Signalling**.

## Stack
React + Vite frontend, Django/Python backend, NumPy, Matplotlib.

## Features
QPSK only, fixed 64 subcarriers, adjustable bits/CP/SNR, AWGN only, pilot-based channel estimation, equalization, BER, OFDM waveform, QPSK constellation and BER-vs-SNR graph.

## Run backend
```bash
cd backend
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
python manage.py runserver
```

## Run frontend (second terminal)
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL, normally http://localhost:5173.

## Examiner tests
Try 1000 bits / CP 16 / SNR 10 dB, then 1000 / 16 / 20 dB. Higher SNR should generally give lower BER. Also try different bit counts, CP values and SNR values.

Subcarriers remain fixed at 64 because the engine is designed as a 64-point OFDM system.
