import os
import pandas as pd
import numpy as np
import joblib

from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# ============================================================
# 1. PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "household_power_consumption.txt"
)

MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)


# ============================================================
# 2. LOAD DATASET
# ============================================================

print("\nLoading dataset...")

df = pd.read_csv(
    DATA_PATH,
    sep=";",
    na_values="?",
    low_memory=False
)

print("Original shape:", df.shape)


# ============================================================
# 3. CREATE DATETIME
# ============================================================

print("\nCreating datetime column...")

df["datetime"] = pd.to_datetime(
    df["Date"] + " " + df["Time"],
    dayfirst=True,
    errors="coerce"
)

df.drop(columns=["Date", "Time"], inplace=True)

df.set_index("datetime", inplace=True)

# Convert numerical columns
numeric_columns = [
    "Global_active_power",
    "Global_reactive_power",
    "Voltage",
    "Global_intensity",
    "Sub_metering_1",
    "Sub_metering_2",
    "Sub_metering_3"
]

for column in numeric_columns:
    df[column] = pd.to_numeric(df[column], errors="coerce")


# ============================================================
# 4. HANDLE MISSING VALUES
# ============================================================

print("\nHandling missing values...")

df = df[~df.index.isna()]

df[numeric_columns] = df[numeric_columns].interpolate(
    method="time"
)

df[numeric_columns] = df[numeric_columns].ffill().bfill()


# ============================================================
# 5. RESAMPLE TO HOURLY DATA
# ============================================================

print("\nConverting minute data to hourly data...")

hourly = df.resample("1h").agg({
    "Global_active_power": "mean",
    "Global_reactive_power": "mean",
    "Voltage": "mean",
    "Global_intensity": "mean",
    "Sub_metering_1": "sum",
    "Sub_metering_2": "sum",
    "Sub_metering_3": "sum"
})

hourly.dropna(inplace=True)

print("Hourly shape:", hourly.shape)


# ============================================================
# 6. CREATE TARGET
# ============================================================

# Predict the next hour's average active power

hourly["target"] = hourly["Global_active_power"].shift(-1)


# ============================================================
# 7. CREATE TIME FEATURES
# ============================================================

hourly["hour"] = hourly.index.hour
hourly["day_of_week"] = hourly.index.dayofweek
hourly["day"] = hourly.index.day
hourly["month"] = hourly.index.month

hourly["is_weekend"] = (
    hourly["day_of_week"] >= 5
).astype(int)


# ============================================================
# 8. CREATE LAG FEATURES
# ============================================================

# Previous hour
hourly["power_lag_1"] = hourly["Global_active_power"].shift(1)

# Same hour yesterday
hourly["power_lag_24"] = hourly["Global_active_power"].shift(24)

# Same hour last week
hourly["power_lag_168"] = hourly["Global_active_power"].shift(168)


# ============================================================
# 9. ROLLING FEATURES
# ============================================================

hourly["power_rolling_3"] = (
    hourly["Global_active_power"]
    .shift(1)
    .rolling(3)
    .mean()
)

hourly["power_rolling_24"] = (
    hourly["Global_active_power"]
    .shift(1)
    .rolling(24)
    .mean()
)


# ============================================================
# 10. REMOVE MISSING VALUES CREATED BY LAGS
# ============================================================

hourly.dropna(inplace=True)


# ============================================================
# 11. FEATURES
# ============================================================

features = [
    "Global_active_power",
    "Global_reactive_power",
    "Voltage",
    "Global_intensity",
    "Sub_metering_1",
    "Sub_metering_2",
    "Sub_metering_3",
    "hour",
    "day_of_week",
    "day",
    "month",
    "is_weekend",
    "power_lag_1",
    "power_lag_24",
    "power_lag_168",
    "power_rolling_3",
    "power_rolling_24"
]

X = hourly[features]
y = hourly["target"]


# ============================================================
# 12. CHRONOLOGICAL TRAIN / TEST SPLIT
# ============================================================

print("\nSplitting data...")

split_index = int(len(X) * 0.8)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# ============================================================
# 13. TRAIN MODELS
# ============================================================

models = {

    "Random Forest": RandomForestRegressor(
        n_estimators=100,
        max_depth=20,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    ),

    "Gradient Boosting": GradientBoostingRegressor(
        n_estimators=150,
        learning_rate=0.05,
        max_depth=5,
        random_state=42
    )
}


results = {}

best_model = None
best_model_name = None
best_rmse = float("inf")


# ============================================================
# 14. MODEL TRAINING + EVALUATION
# ============================================================

print("\nTraining models...\n")

for name, model in models.items():

    print("Training:", name)

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    rmse = np.sqrt(
        mean_squared_error(
            y_test,
            predictions
        )
    )

    r2 = r2_score(
        y_test,
        predictions
    )

    results[name] = {
        "MAE": mae,
        "RMSE": rmse,
        "R2": r2
    }

    print("MAE :", round(mae, 4))
    print("RMSE:", round(rmse, 4))
    print("R²  :", round(r2, 4))
    print()

    if rmse < best_rmse:
        best_rmse = rmse
        best_model = model
        best_model_name = name


# ============================================================
# 15. SAVE BEST MODEL
# ============================================================

model_path = os.path.join(
    MODEL_DIR,
    "energy_model.pkl"
)

joblib.dump(
    best_model,
    model_path
)


# Save feature names
feature_path = os.path.join(
    MODEL_DIR,
    "feature_columns.pkl"
)

joblib.dump(
    features,
    feature_path
)


# ============================================================
# 16. FINAL RESULTS
# ============================================================

print("=" * 60)

print("BEST MODEL:", best_model_name)

print(
    "MAE:",
    round(results[best_model_name]["MAE"], 4)
)

print(
    "RMSE:",
    round(results[best_model_name]["RMSE"], 4)
)

print(
    "R²:",
    round(results[best_model_name]["R2"], 4)
)

print("=" * 60)

print("\nModel saved at:")
print(model_path)

print("\nFeature list saved at:")
print(feature_path)

print("\nTraining completed successfully!")