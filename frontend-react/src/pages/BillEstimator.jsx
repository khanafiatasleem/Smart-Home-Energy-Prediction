import { useState } from "react";

function BillEstimator() {
  const [units, setUnits] = useState("250");
  const [fixedCharge, setFixedCharge] = useState("50");
  const [result, setResult] = useState(null);

  const calculateBill = () => {
    const totalUnits = Number(units) || 0;
    const fixed = Number(fixedCharge) || 0;

    let remaining = totalUnits;
    let energyCharge = 0;

    /*
      Example slab structure for the demo.

      These are configurable example rates,
      NOT an official electricity tariff.
    */

    // First 100 units
    const firstSlab = Math.min(remaining, 100);
    energyCharge += firstSlab * 2.5;
    remaining -= firstSlab;

    // Next 100 units
    if (remaining > 0) {
      const secondSlab = Math.min(remaining, 100);
      energyCharge += secondSlab * 4;
      remaining -= secondSlab;
    }

    // Next 200 units
    if (remaining > 0) {
      const thirdSlab = Math.min(remaining, 200);
      energyCharge += thirdSlab * 6;
      remaining -= thirdSlab;
    }

    // Above 400 units
    if (remaining > 0) {
      energyCharge += remaining * 8;
    }

    const totalBill = energyCharge + fixed;

    const dailyAverage = totalUnits / 30;

    setResult({
      energyCharge,
      fixedCharge: fixed,
      totalBill,
      dailyAverage,
    });
  };

  const reset = () => {
    setUnits("");
    setFixedCharge("50");
    setResult(null);
  };

  return (
    <div className="page bill-page">

      <div className="page-heading">

        <span className="section-label">
          BILL ESTIMATOR
        </span>

        <h1>
          Estimate your electricity bill
        </h1>

        <p>
          Enter your monthly electricity consumption
          and get an estimated electricity bill using
          slab-based pricing.
        </p>

      </div>


      <div className="bill-layout">

        {/* INPUT */}

        <div className="bill-form">

          <h2>
            Electricity Usage
          </h2>

          <div className="bill-input">

            <label>
              Monthly Consumption
            </label>

            <div className="bill-input-wrapper">

              <input
                type="number"
                min="0"
                step="0.01"
                value={units}
                onChange={(e) =>
                  setUnits(e.target.value)
                }
                placeholder="Enter units"
              />

              <span>
                units
              </span>

            </div>

          </div>


          <div className="bill-input">

            <label>
              Fixed Charge
            </label>

            <div className="bill-input-wrapper">

              <input
                type="number"
                min="0"
                step="1"
                value={fixedCharge}
                onChange={(e) =>
                  setFixedCharge(e.target.value)
                }
                placeholder="Enter fixed charge"
              />

              <span>
                ₹
              </span>

            </div>

          </div>


          <button
            className="primary-btn bill-button"
            onClick={calculateBill}
          >
            Calculate Bill
          </button>


          <button
            className="secondary-btn bill-reset"
            onClick={reset}
          >
            Reset
          </button>


          <div className="tariff-note">

            <strong>
              Example tariff
            </strong>

            <p>
              0–100 units: ₹2.50/unit
              <br />
              101–200 units: ₹4/unit
              <br />
              201–400 units: ₹6/unit
              <br />
              Above 400 units: ₹8/unit
            </p>

            <small>
              These are example rates for this
              project and are not an official tariff.
            </small>

          </div>

        </div>


        {/* RESULT */}

        <div className="bill-result">

          {!result ? (

            <div className="empty-result">

              <div className="empty-icon">
                💰
              </div>

              <h2>
                Your estimated bill
              </h2>

              <p>
                Enter your monthly units and
                calculate your estimated electricity
                cost.
              </p>

            </div>

          ) : (

            <>

              <div className="total-bill">

                <span>
                  ESTIMATED MONTHLY BILL
                </span>

                <div>
                  ₹{result.totalBill.toFixed(2)}
                </div>

                <p>
                  For {Number(units).toFixed(2)} units
                </p>

              </div>


              <div className="bill-breakdown">

                <div className="breakdown-row">

                  <span>
                    Energy Charges
                  </span>

                  <strong>
                    ₹{result.energyCharge.toFixed(2)}
                  </strong>

                </div>


                <div className="breakdown-row">

                  <span>
                    Fixed Charges
                  </span>

                  <strong>
                    ₹{result.fixedCharge.toFixed(2)}
                  </strong>

                </div>


                <div className="breakdown-row total">

                  <span>
                    Estimated Total
                  </span>

                  <strong>
                    ₹{result.totalBill.toFixed(2)}
                  </strong>

                </div>

              </div>


              <div className="bill-stats">

                <div>

                  <span>
                    Daily Average
                  </span>

                  <strong>
                    {result.dailyAverage.toFixed(2)}
                  </strong>

                  <small>
                    units/day
                  </small>

                </div>


                <div>

                  <span>
                    Monthly Usage
                  </span>

                  <strong>
                    {Number(units).toFixed(2)}
                  </strong>

                  <small>
                    units
                  </small>

                </div>

              </div>


              <BillAdvice units={Number(units)} />

            </>

          )}

        </div>

      </div>

    </div>
  );
}


function BillAdvice({ units }) {

  if (units > 400) {

    return (
      <div className="bill-advice high">

        <strong>
          ⚠ High Consumption
        </strong>

        <p>
          Your monthly electricity consumption is
          quite high. Reducing unnecessary usage of
          high-power appliances could significantly
          lower your electricity cost.
        </p>

      </div>
    );

  }


  if (units > 200) {

    return (
      <div className="bill-advice moderate">

        <strong>
          ⚡ Moderate Consumption
        </strong>

        <p>
          Your consumption is moderate. Try switching
          off appliances when they are not required
          to keep your electricity usage under control.
        </p>

      </div>
    );

  }


  return (
    <div className="bill-advice good">

      <strong>
        ✓ Good Energy Management
      </strong>

      <p>
        Your monthly consumption is within a
        relatively efficient range. Keep managing
        your electricity usage this way.
      </p>

    </div>
  );
}


export default BillEstimator;