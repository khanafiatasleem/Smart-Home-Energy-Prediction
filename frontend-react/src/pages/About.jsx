function About() {

  return (

    <div className="page about-page">

      <div className="page-heading">

        <span className="section-label">
          ABOUT THE PROJECT
        </span>

        <h1>
          Making energy management smarter
        </h1>

        <p>
          SmartHome Energy is a machine learning
          based system designed to predict household
          electricity consumption and provide
          practical energy-saving recommendations.
        </p>

      </div>


      <div className="about-grid">


        <div className="about-card">

          <div className="about-icon">
            🤖
          </div>

          <h2>
            Machine Learning
          </h2>

          <p>
            The system uses historical household
            electricity consumption data to learn
            usage patterns and predict future
            energy consumption.
          </p>

        </div>


        <div className="about-card">

          <div className="about-icon">
            💡
          </div>

          <h2>
            Smart Recommendations
          </h2>

          <p>
            Predictions are converted into simple
            recommendations so users can understand
            when their energy usage needs attention.
          </p>

        </div>


        <div className="about-card">

          <div className="about-icon">
            🌱
          </div>

          <h2>
            Energy Efficiency
          </h2>

          <p>
            The goal is to encourage responsible
            energy consumption, reduce unnecessary
            usage and help households control
            electricity costs.
          </p>

        </div>

      </div>


      <section className="technology-section">

        <span className="section-label">
          TECHNOLOGY
        </span>

        <h2>
          Built with modern technologies
        </h2>


        <div className="technology-list">

          <span>Python</span>

          <span>Scikit-learn</span>

          <span>FastAPI</span>

          <span>React</span>

          <span>JavaScript</span>

          <span>Machine Learning</span>

        </div>

      </section>

    </div>

  );

}

export default About;
