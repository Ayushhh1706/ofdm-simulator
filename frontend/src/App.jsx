import { useState } from "react";

import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Cpu,
  Gauge,
  Info,
  Radio,
  Signal,
  Waves,
  Zap,
  Home as HomeIcon,
} from "lucide-react";

import {
  Link,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";

import { runSimulation } from "./api";


/* =========================================================
   LOGO
========================================================= */

function Logo() {
  return (
    <Link to="/" className="brand">
      <div className="brand-icon">OF</div>

      <div>
        <div className="brand-title">
          OFDM Simulator
        </div>

        <div className="brand-subtitle">
          Signal Processing Lab
        </div>
      </div>
    </Link>
  );
}


/* =========================================================
   HEADER
========================================================= */

function Header() {
  return (
    <header className="header">

      <div className="header-inner">

        <Logo />

        <nav className="nav">

          <NavLink to="/" end>
            <HomeIcon size={17} />
            Home
          </NavLink>

          <NavLink to="/learn">
            <BookOpen size={17} />
            Learn OFDM
          </NavLink>

          <Link
            className="header-sim-button"
            to="/simulator"
          >
            Open Simulator
            <ArrowRight size={17} />
          </Link>

        </nav>

      </div>

    </header>
  );
}


/* =========================================================
   HOME PAGE
========================================================= */

function HomePage() {
  return (
    <main>

      <section className="hero page-width">

        <div className="hero-badge">
          <Signal size={16} />
          Digital Communication Simulation
        </div>

        <h1>
          Explore <span>OFDM Signalling</span>
          <br />
          through an interactive simulator.
        </h1>

        <p className="hero-text">
          Understand Orthogonal Frequency Division Multiplexing
          by changing practical communication parameters and
          observing BER, waveform and QPSK constellation results.
        </p>

        <div className="hero-actions">

          <Link
            className="button primary"
            to="/simulator"
          >
            Start Simulation
            <ArrowRight size={18} />
          </Link>

          <Link
            className="button secondary"
            to="/learn"
          >
            Learn OFDM
            <BookOpen size={18} />
          </Link>

        </div>


        <div className="hero-flow">

          <div>Random Bits</div>
          <ArrowRight />

          <div>QPSK</div>
          <ArrowRight />

          <div>IFFT</div>
          <ArrowRight />

          <div>CP</div>
          <ArrowRight />

          <div>AWGN</div>
          <ArrowRight />

          <div>FFT</div>
          <ArrowRight />

          <div>BER</div>

        </div>

      </section>


      {/* WHAT IS OFDM */}

      <section className="page-width section">

        <div className="section-heading">

          <span>CORE CONCEPT</span>

          <h2>
            What is OFDM?
          </h2>

        </div>


        <div className="info-panel">

          <div className="info-icon">
            <Radio size={28} />
          </div>

          <div>

            <h3>
              Orthogonal Frequency Division Multiplexing
            </h3>

            <p>
              OFDM divides a high-speed data stream across
              many closely spaced orthogonal subcarriers.
              Each subcarrier carries a portion of the
              information, allowing efficient and robust
              digital communication.
            </p>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="page-width section">

        <div className="section-heading">

          <span>PROJECT FEATURES</span>

          <h2>
            Inside this simulator
          </h2>

        </div>


        <div className="feature-grid">

          <Feature
            icon={<Zap />}
            title="QPSK Modulation"
            text="Maps binary data onto four phase states."
          />

          <Feature
            icon={<Cpu />}
            title="64-Point OFDM"
            text="Uses a 64-point FFT and IFFT architecture."
          />

          <Feature
            icon={<Waves />}
            title="Cyclic Prefix"
            text="Adds a guard interval before transmission."
          />

          <Feature
            icon={<Activity />}
            title="AWGN Channel"
            text="Adds controlled Gaussian noise to the signal."
          />

          <Feature
            icon={<Gauge />}
            title="Channel Estimation"
            text="Uses pilot subcarriers for estimation and equalization."
          />

          <Feature
            icon={<BarChart3 />}
            title="BER Analysis"
            text="Measures bit errors and displays BER versus SNR."
          />

        </div>

      </section>


      {/* NOTE */}

      <section className="page-width section">

        <div className="project-note">

          <Info size={21} />

          <div>

            <strong>
              Designed for demonstration
            </strong>

            <p>
              The interface keeps the communication chain
              visible so that an examiner can easily
              understand what each parameter changes.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}


/* =========================================================
   FEATURE COMPONENT
========================================================= */

function Feature({
  icon,
  title,
  text,
}) {
  return (

    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>

  );
}


/* =========================================================
   LEARN PAGE
========================================================= */

function LearnPage() {

  const concepts = [

    {
      title: "QPSK",
      text:
        "Quadrature Phase Shift Keying represents two bits per symbol using four phase states.",
    },

    {
      title: "IFFT",
      text:
        "The inverse FFT converts the mapped frequency-domain subcarriers into the time-domain OFDM waveform.",
    },

    {
      title: "Cyclic Prefix",
      text:
        "A copy of the end of an OFDM symbol is placed at its beginning to act as a guard interval.",
    },

    {
      title: "AWGN",
      text:
        "Additive White Gaussian Noise models random channel noise and lets us study performance at different SNR values.",
    },

    {
      title: "FFT",
      text:
        "The receiver uses FFT to transform the received time-domain signal back into frequency-domain subcarriers.",
    },

    {
      title: "BER",
      text:
        "Bit Error Rate is the ratio of incorrectly received bits to the total compared bits.",
    },

  ];


  return (

    <main className="page-width learn-page">

      <section className="page-title">

        <div className="hero-badge">
          <BookOpen size={16} />
          Learning Module
        </div>

        <h1>
          Understanding OFDM
        </h1>

        <p>
          A simple explanation of the processing chain used by this project.
        </p>

      </section>


      <section className="learn-flow">

        {[
          "Random Binary Data",
          "QPSK Modulation",
          "Subcarrier Mapping",
          "64-Point IFFT",
          "Cyclic Prefix",
          "AWGN Channel",
          "Remove CP",
          "FFT",
          "Channel Estimation",
          "Equalization",
          "QPSK Demodulation",
          "BER",
        ].map((item, index) => (

          <div
            className="flow-item"
            key={item}
          >

            <span>
              {String(index + 1).padStart(2, "0")}
            </span>

            {item}

          </div>

        ))}

      </section>


      <section className="section">

        <div className="section-heading">

          <span>
            KEY CONCEPTS
          </span>

          <h2>
            How the simulator works
          </h2>

        </div>


        <div className="concept-grid">

          {concepts.map((concept) => (

            <article
              className="concept-card"
              key={concept.title}
            >

              <h3>
                {concept.title}
              </h3>

              <p>
                {concept.text}
              </p>

            </article>

          ))}

        </div>

      </section>


      <section className="learn-callout">

        <div>

          <h2>
            Ready to test the system?
          </h2>

          <p>
            Change the number of bits, cyclic prefix and SNR,
            then compare the resulting BER and signal plots.
          </p>

        </div>

        <Link
          className="button primary"
          to="/simulator"
        >
          Open Simulator
          <ArrowRight size={18} />
        </Link>

      </section>

    </main>

  );
}


/* =========================================================
   SIMULATOR PAGE
========================================================= */

function SimulatorPage() {

  const [bits, setBits] = useState(1000);
  const [cp, setCp] = useState(16);
  const [snr, setSnr] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [simulation, setSimulation] = useState(null);


  async function handleSubmit(event) {

    event.preventDefault();

    setLoading(true);
    setError("");
    setSimulation(null);


    try {

      const result = await runSimulation({

        bits: Number(bits),

        cp: Number(cp),

        snr: Number(snr),

      });


      setSimulation(result);

    }

    catch (err) {

      setError(
        err.message || "Simulation failed."
      );

    }

    finally {

      setLoading(false);

    }

  }


  return (

    <main className="page-width simulator-page">

      <section className="page-title simulator-title">

        <div>

          <div className="hero-badge">

            <Radio size={16} />

            Live OFDM Simulation

          </div>

          <h1>
            OFDM Simulator
          </h1>

          <p>
            Configure the system parameters and observe
            the communication performance.
          </p>

        </div>


        <div className="system-status">

          <span className="status-dot"></span>

          System Ready

        </div>

      </section>


      <section className="simulator-layout">


        {/* CONTROL PANEL */}

        <form
          className="control-panel"
          onSubmit={handleSubmit}
        >

          <div className="panel-title">

            <div>

              <span>
                SIMULATION PARAMETERS
              </span>

              <h2>
                Configure System
              </h2>

            </div>

            <div className="settings-symbol">
              ⚙
            </div>

          </div>


          <div className="parameter-list">

            <Parameter
              label="Number of Bits"
              value={bits}
              onChange={setBits}
              min="1"
              max="100000"
            />


            <ReadOnlyParameter
              label="Modulation"
              value="QPSK"
            />


            <ReadOnlyParameter
              label="Subcarriers"
              value="64"
            />


            <Parameter
              label="Cyclic Prefix"
              suffix="samples"
              value={cp}
              onChange={setCp}
              min="1"
              max="63"
            />


            <Parameter
              label="SNR"
              suffix="dB"
              value={snr}
              onChange={setSnr}
              min="-20"
              max="50"
              step="0.5"
            />


            <ReadOnlyParameter
              label="Channel"
              value="AWGN"
            />

          </div>


          <div className="parameter-help">

            <Info size={17} />

            <span>
              Subcarriers, modulation and channel are fixed
              for this project. Bits, CP and SNR are adjustable.
            </span>

          </div>


          <button
            type="submit"
            className="button primary run-button"
            disabled={loading}
          >

            {loading ? (

              <>
                <span className="spinner"></span>
                Running Simulation...
              </>

            ) : (

              <>
                <Zap size={18} />
                Run OFDM Simulation
              </>

            )}

          </button>

        </form>


        {/* RESULTS */}

        <div className="results-area">

          {!simulation &&
            !loading &&
            !error && (

              <div className="empty-state">

                <div className="empty-icon">

                  <Activity size={40} />

                </div>

                <h2>
                  Ready for Simulation
                </h2>

                <p>
                  Set your parameters and click
                  <strong> Run OFDM Simulation </strong>
                  to generate the signal analysis.
                </p>

              </div>

            )}


          {loading && (

            <div className="empty-state">

              <div className="loading-orbit"></div>

              <h2>
                Processing OFDM Signal
              </h2>

              <p>
                Generating QPSK symbols, performing IFFT/FFT,
                adding AWGN and calculating BER.
              </p>

            </div>

          )}


          {error && (

            <div className="error-box">

              <strong>
                Simulation Error
              </strong>

              <p>
                {error}
              </p>

            </div>

          )}


          {simulation && (

            <SimulationResults
              data={simulation}
            />

          )}

        </div>

      </section>

    </main>

  );
}


/* =========================================================
   PARAMETER
========================================================= */

function Parameter({
  label,
  value,
  onChange,
  min,
  max,
  step = "1",
  suffix = "",
}) {

  return (

    <label className="parameter">

      <span>
        {label}
      </span>

      <div className="input-wrap">

        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) =>
            onChange(event.target.value)
          }
          required
        />

        {suffix && (
          <small>
            {suffix}
          </small>
        )}

      </div>

    </label>

  );
}


/* =========================================================
   READ ONLY PARAMETER
========================================================= */

function ReadOnlyParameter({
  label,
  value,
}) {

  return (

    <div className="parameter">

      <span>
        {label}
      </span>

      <div className="readonly-field">

        {value}

        <span className="lock-dot"></span>

      </div>

    </div>

  );
}


/* =========================================================
   SIMULATION RESULTS
========================================================= */

function SimulationResults({
  data,
}) {

  const {
    parameters,
    results,
    graphs,
  } = data;


  return (

    <div className="results">


      <div className="result-header">

        <div>

          <span>
            SIMULATION COMPLETE
          </span>

          <h2>
            Analysis Results
          </h2>

        </div>


        <div className="success-pill">

          <span></span>

          Completed

        </div>

      </div>


      <div className="metric-grid">

        <Metric
          label="Bits"
          value={parameters.bits.toLocaleString()}
        />

        <Metric
          label="Modulation"
          value="QPSK"
        />

        <Metric
          label="Subcarriers"
          value="64"
        />

        <Metric
          label="CP"
          value={`${parameters.cp} samples`}
        />

        <Metric
          label="SNR"
          value={`${parameters.snr} dB`}
        />

        <Metric
          label="Channel"
          value="AWGN"
        />

      </div>


      <div className="ber-highlight">

        <div>

          <span>
            BIT ERROR RATE
          </span>

          <strong>
            {results.ber.toExponential(4)}
          </strong>

        </div>


        <div className="ber-percent">

          {results.ber_percent.toFixed(4)}%

        </div>

      </div>


      <div className="graphs">

        <GraphCard
          title="OFDM Time-Domain Waveform"
          description="Real part of the generated OFDM signal."
          src={`data:image/png;base64,${graphs.waveform}`}
        />


        <GraphCard
          title="QPSK Constellation"
          description="Received QPSK symbols after equalization."
          src={`data:image/png;base64,${graphs.constellation}`}
        />


        <GraphCard
          title="BER vs SNR"
          description="System bit-error performance across different SNR levels."
          src={`data:image/png;base64,${graphs.ber_vs_snr}`}
          wide
        />

      </div>

    </div>

  );
}


/* =========================================================
   METRIC
========================================================= */

function Metric({
  label,
  value,
}) {

  return (

    <div className="metric">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );
}


/* =========================================================
   GRAPH CARD
========================================================= */

function GraphCard({
  title,
  description,
  src,
  wide = false,
}) {

  return (

    <article
      className={`graph-card ${wide ? "wide" : ""}`}
    >

      <div className="graph-heading">

        <div>

          <h3>
            {title}
          </h3>

          <p>
            {description}
          </p>

        </div>

        <BarChart3 size={20} />

      </div>


      <div className="graph-image">

        <img
          src={src}
          alt={title}
        />

      </div>

    </article>

  );
}


/* =========================================================
   MAIN APP
========================================================= */

function App() {

  return (

    <>

      <Header />

      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/learn"
          element={<LearnPage />}
        />

        <Route
          path="/simulator"
          element={<SimulatorPage />}
        />

      </Routes>


      <footer className="footer">

        <div className="page-width footer-inner">

          <div>

            <strong>
              OFDM Simulator
            </strong>

            <span>
              Simulation of OFDM Signalling
            </span>

          </div>


          <span>
            React + Django + Python
          </span>

        </div>

      </footer>

    </>

  );

}


export default App;