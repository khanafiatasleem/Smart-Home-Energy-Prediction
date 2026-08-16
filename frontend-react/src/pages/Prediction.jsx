import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Prediction() {
  const [form, setForm] = useState({
    global_active_power: "1.5",
    global_reactive_power: "0.2",
    voltage: "240",
    global_intensity: "6.5",
    sub_metering_1: "10",
    sub_metering_2: "20",
    sub_metering_3: "15",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Keep the value as a string while typing.
    // This allows the user to completely clear the input.
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const predictEnergy = async () => {
    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const now = new Date();

      const dayOfWeek = (now.getDay() + 6) % 7;

      // Convert values to numbers only when submitting.
      const activePower = Number(form.global_active_power) || 0;
      const reactivePower = Number(form.global_reactive_power) || 0;
      const voltage = Number(form.voltage) || 0;
      const intensity = Number(form.global_intensity) || 0;
      const subMetering1 = Number(form.sub_metering_1) || 0;
      const subMetering2 = Number(form.sub_metering_2) || 0;
      const subMetering3 = Number(form.sub_metering_3) || 0;

      const requestData = {
        global_active_power: activePower,
        global_reactive_power: reactivePower,
        voltage: voltage,
        global_intensity: intensity,

        sub_metering_1: subMetering1,
        sub_metering_2: subMetering2,
        sub_metering_3: subMetering3,

        hour: now.getHours(),
        day: now.getDate(),
        month: now.getMonth() + 1,

        day_of_week: dayOfWeek,
        is_weekend: dayOfWeek >= 5 ? 1 : 0,

        power_lag_1: activePower,
        power_lag_24: activePower,
        power_lag_168: activePower,

        power_rolling_3: activePower,
        power_rolling_24: activePower,
      };

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();

      setPrediction(
        Number(data.predicted_energy_consumption)
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the prediction server. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRecommendation = () => {
    if (prediction === null) {
      return null;
    }

    if (prediction >= 4) {
      return {
        type: "high",
        title: "High Energy Consumption",
        icon: "⚠️",

        message:
          "Your predicted electricity usage is higher than the efficient range.",

        advice:
          "Try reducing the usage of high-power appliances such as AC, water heaters and washing machines. Reducing unnecessary consumption can help avoid extra electricity charges and save energy.",
      };
    }

    if (prediction >= 2.5) {
      return {
        type: "moderate",
        title: "Moderate Energy Usage",
        icon: "⚡",

        message:
          "Your predicted electricity usage is slightly above the efficient range.",

        advice:
          "Consider switching off appliances that are not currently needed and reduce the usage of high-power devices where possible.",
      };
    }

    return {
      type: "good",
      title: "Good Energy Management",
      icon: "✓",

      message:
        "Your predicted electricity usage is within a good range.",

      advice:
        "Great job! You're managing your household power efficiently. Keep it up to save energy and reduce electricity costs.",
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="page prediction-page">

      <div className="page-heading">

        <span className="section-label">
          ENERGY PREDICTION
        </span>

        <h1>
          Predict your household consumption
        </h1>

        <p>
          Enter your current energy information and
          get an estimate of how many electricity units
          your home may consume in the upcoming hour.
        </p>

      </div>


      <div className="prediction-layout">

        {/* INPUT FORM */}

        <div className="prediction-form">

          <h2>
            Energy Information
          </h2>


          <div className="prediction-inputs">

            <EnergyInput
              label="Current Power"
              name="global_active_power"
              unit="kW"
              value={form.global_active_power}
              onChange={handleChange}
            />

            <EnergyInput
              label="Reactive Power"
              name="global_reactive_power"
              unit="kW"
              value={form.global_reactive_power}
              onChange={handleChange}
            />

            <EnergyInput
              label="Voltage"
              name="voltage"
              unit="V"
              value={form.voltage}
              onChange={handleChange}
            />

            <EnergyInput
              label="Current"
              name="global_intensity"
              unit="A"
              value={form.global_intensity}
              onChange={handleChange}
            />

          </div>


          <h3 className="appliance-heading">
            Appliance Usage
          </h3>


          <div className="appliance-inputs">

            <ApplianceInput
              label="🍳 Kitchen"
              name="sub_metering_1"
              value={form.sub_metering_1}
              onChange={handleChange}
            />

            <ApplianceInput
              label="🧺 Laundry"
              name="sub_metering_2"
              value={form.sub_metering_2}
              onChange={handleChange}
            />

            <ApplianceInput
              label="❄️ AC / Heater"
              name="sub_metering_3"
              value={form.sub_metering_3}
              onChange={handleChange}
            />

          </div>


          <button
            className="primary-btn predict-action"
            onClick={predictEnergy}
            disabled={loading}
          >

            {loading
              ? "Analyzing energy usage..."
              : "⚡ Predict Energy"}

          </button>


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

        </div>


        {/* RESULTS */}

        <div className="result-area">

          <div className="result-card">

            <span>
              NEXT-HOUR ELECTRICITY FORECAST
            </span>


            <div className="result-number">

              {prediction !== null
                ? prediction.toFixed(2)
                : "--"}

              <small>
                units
              </small>

            </div>


            <p>
              1 unit = 1 kWh of electricity.
              This is the estimated electricity
              consumption for the upcoming hour.
            </p>

          </div>


          {recommendation && (

            <div
              className={`recommendation ${recommendation.type}`}
            >

              <div className="recommendation-icon">
                {recommendation.icon}
              </div>


              <div>

                <span>
                  ENERGY ADVISORY
                </span>

                <h2>
                  {recommendation.title}
                </h2>

                <p>
                  {recommendation.message}
                </p>


                <div className="advice">

                  <strong>
                    💡 Recommendation
                  </strong>

                  <p>
                    {recommendation.advice}
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


/* Energy input component */

function EnergyInput({
  label,
  name,
  unit,
  value,
  onChange,
}) {
  return (
    <div className="form-input">

      <label>
        {label}
      </label>

      <div>

        <input
          type="number"
          step="0.01"
          min="0"
          name={name}
          value={value}
          onChange={onChange}
          placeholder="Enter value"
        />

        <span>
          {unit}
        </span>

      </div>

    </div>
  );
}


/* Appliance input component */

function ApplianceInput({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div className="appliance-input">

      <label>
        {label}
      </label>

      <input
        type="number"
        step="0.1"
        min="0"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="0"
      />

    </div>
  );
}


export default Prediction;