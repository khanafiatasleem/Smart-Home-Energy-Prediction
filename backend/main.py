from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="Smart Home Energy Prediction API",
    description="API for predicting household energy consumption",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "energy_model.pkl"
)

FEATURE_PATH = os.path.join(
    BASE_DIR,
    "models",
    "feature_columns.pkl"
)


# ============================================================
# LOAD MODEL
# ============================================================

model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURE_PATH)


# ============================================================
# INPUT DATA
# ============================================================

class EnergyInput(BaseModel):

    global_active_power: float
    global_reactive_power: float
    voltage: float
    global_intensity: float

    sub_metering_1: float
    sub_metering_2: float
    sub_metering_3: float

    hour: int
    day_of_week: int
    day: int
    month: int
    is_weekend: int

    power_lag_1: float
    power_lag_24: float
    power_lag_168: float

    power_rolling_3: float
    power_rolling_24: float


# ============================================================
# HOME ROUTE
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Smart Home Energy Prediction API",
        "status": "running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": True
    }


# ============================================================
# PREDICTION
# ============================================================

@app.post("/predict")
def predict(data: EnergyInput):

    input_data = pd.DataFrame([{

        "Global_active_power":
            data.global_active_power,

        "Global_reactive_power":
            data.global_reactive_power,

        "Voltage":
            data.voltage,

        "Global_intensity":
            data.global_intensity,

        "Sub_metering_1":
            data.sub_metering_1,

        "Sub_metering_2":
            data.sub_metering_2,

        "Sub_metering_3":
            data.sub_metering_3,

        "hour":
            data.hour,

        "day_of_week":
            data.day_of_week,

        "day":
            data.day,

        "month":
            data.month,

        "is_weekend":
            data.is_weekend,

        "power_lag_1":
            data.power_lag_1,

        "power_lag_24":
            data.power_lag_24,

        "power_lag_168":
            data.power_lag_168,

        "power_rolling_3":
            data.power_rolling_3,

        "power_rolling_24":
            data.power_rolling_24
    }])

    # Ensure correct feature order
    input_data = input_data[feature_columns]

    prediction = model.predict(input_data)[0]

    return {
        "predicted_energy_consumption": round(
            float(prediction),
            3
        ),
        "unit": "kWh"
    }