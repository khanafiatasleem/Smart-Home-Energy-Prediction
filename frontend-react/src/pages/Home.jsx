import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page">

      <section className="home-hero">

        <div className="hero-badge">
          ⚡ AI-POWERED ENERGY MANAGEMENT
        </div>

        <h1>
          Make your home
          <span> smarter with energy.</span>
        </h1>

        <p>
          Predict household energy consumption using
          machine learning and get simple recommendations
          to reduce unnecessary electricity usage.
        </p>

        <div className="hero-buttons">

          <Link to="/prediction" className="primary-btn">
            Start Prediction →
          </Link>

          <Link to="/about" className="secondary-btn">
            Learn More
          </Link>

        </div>

      </section>


      <section className="features">

        <div className="feature-card">
          <div className="feature-icon">🤖</div>

          <h3>ML Prediction</h3>

          <p>
            Predict upcoming household energy
            consumption using machine learning.
          </p>
        </div>


        <div className="feature-card">
          <div className="feature-icon">💡</div>

          <h3>Smart Advice</h3>

          <p>
            Receive personalized recommendations
            based on your predicted consumption.
          </p>
        </div>


        <div className="feature-card">
          <div className="feature-icon">💰</div>

          <h3>Save Energy</h3>

          <p>
            Identify high consumption and reduce
            unnecessary electricity usage.
          </p>
        </div>

      </section>


      <section className="how-section">

        <span className="section-label">
          HOW IT WORKS
        </span>

        <h2>
          From energy data to smart decisions
        </h2>


        <div className="steps">

          <div className="step">
            <span>01</span>
            <h3>Enter Usage</h3>
            <p>
              Provide your current household
              energy information.
            </p>
          </div>

          <div className="step">
            <span>02</span>
            <h3>ML Prediction</h3>
            <p>
              Our trained model analyzes your
              energy consumption patterns.
            </p>
          </div>

          <div className="step">
            <span>03</span>
            <h3>Get Advice</h3>
            <p>
              Receive a simple recommendation
              to manage your energy better.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;