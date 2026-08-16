const API_URL = "http://127.0.0.1:8000";


async function predictEnergy() {

    const button = document.getElementById("predictButton");
    const loading = document.getElementById("loading");
    const result = document.getElementById("result");
    const error = document.getElementById("error");

    result.classList.add("hidden");
    error.classList.add("hidden");

    button.disabled = true;
    loading.classList.remove("hidden");


    try {

        const now = new Date();

        const hour = now.getHours();
        const day = now.getDate();
        const month = now.getMonth() + 1;

        // JavaScript:
        // Sunday = 0
        // Our ML model:
        // Monday = 0
        const dayOfWeek = (now.getDay() + 6) % 7;

        const isWeekend = dayOfWeek >= 5 ? 1 : 0;


        const data = {

            global_active_power:
                Number(
                    document.getElementById(
                        "global_active_power"
                    ).value
                ),

            global_reactive_power:
                Number(
                    document.getElementById(
                        "global_reactive_power"
                    ).value
                ),

            voltage:
                Number(
                    document.getElementById(
                        "voltage"
                    ).value
                ),

            global_intensity:
                Number(
                    document.getElementById(
                        "global_intensity"
                    ).value
                ),

            sub_metering_1:
                Number(
                    document.getElementById(
                        "sub_metering_1"
                    ).value
                ),

            sub_metering_2:
                Number(
                    document.getElementById(
                        "sub_metering_2"
                    ).value
                ),

            sub_metering_3:
                Number(
                    document.getElementById(
                        "sub_metering_3"
                    ).value
                ),

            hour: hour,

            day_of_week: dayOfWeek,

            day: day,

            month: month,

            is_weekend: isWeekend,

            power_lag_1:
                Number(
                    document.getElementById(
                        "power_lag_1"
                    ).value
                ),

            power_lag_24:
                Number(
                    document.getElementById(
                        "power_lag_24"
                    ).value
                ),

            power_lag_168:
                Number(
                    document.getElementById(
                        "power_lag_168"
                    ).value
                ),

            power_rolling_3:
                Number(
                    document.getElementById(
                        "power_rolling_3"
                    ).value
                ),

            power_rolling_24:
                Number(
                    document.getElementById(
                        "power_rolling_24"
                    ).value
                )
        };


        const response = await fetch(
            `${API_URL}/predict`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        if (!response.ok) {

            throw new Error(
                "Prediction request failed."
            );

        }


        const predictionData =
            await response.json();


        document.getElementById(
            "prediction"
        ).textContent =
            predictionData
                .predicted_energy_consumption
                .toFixed(3);


        result.classList.remove("hidden");


    } catch (err) {

        error.textContent =
            "Unable to connect to the prediction server. Make sure FastAPI is running.";

        error.classList.remove("hidden");

        console.error(err);

    } finally {

        button.disabled = false;
        loading.classList.add("hidden");

    }
}