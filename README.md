# Smart Home Energy Prediction & Bill Estimator

An AI-powered web application that predicts household electricity consumption and estimates electricity bills based on energy usage.

The system combines a Machine Learning model with a FastAPI backend and an interactive React frontend to help users understand their electricity consumption and make better energy-saving decisions.

---

## 🚀 Features

### ⚡ Energy Consumption Prediction

Predicts household electricity consumption using historical household power consumption data and electrical measurements.

### 📊 Energy Usage Analysis

The application considers parameters such as:

- Global Active Power
- Global Reactive Power
- Voltage
- Global Intensity
- Kitchen appliance usage
- Laundry appliance usage
- AC / heating appliance usage
- Time-related features

### 💰 Electricity Bill Estimator

Users can enter their monthly electricity consumption and calculate an estimated electricity bill using slab-based pricing.

The estimator provides:

- Energy charges
- Fixed charges
- Total estimated bill
- Average daily consumption
- Monthly consumption analysis

### 💡 Smart Energy Recommendations

After prediction, the system provides simple recommendations based on the estimated consumption.

For example:

- High consumption → reduce unnecessary appliance usage
- Moderate consumption → improve energy management
- Low consumption → continue current energy-saving habits

### 🖥️ Interactive Web Interface

The application includes:

- Home page
- Energy Prediction page
- Bill Estimator page
- About page

---

## 🧠 Machine Learning

The project uses historical household electricity consumption data to train a machine learning model.

### Dataset

The project uses the Individual Household Electric Power Consumption dataset.

The dataset contains household electricity measurements collected over time.

### Input Features

Some of the important features include:

```text
Global Active Power
Global Reactive Power
Voltage
Global Intensity
Sub Metering 1
Sub Metering 2
Sub Metering 3
Hour
Day
Month
Day of Week
Weekend Indicator
Lag Features
Rolling Features
