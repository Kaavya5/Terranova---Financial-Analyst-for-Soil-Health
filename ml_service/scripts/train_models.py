"""
Training script for Crop Recommendation and Yield Prediction models.
Uses synthetic data based on real agronomic ranges from Kaggle Crop Recommendation Dataset.
"""
import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score, mean_absolute_error
import joblib

# ─── Paths ────────────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

# ─── Realistic crop parameter ranges ──────────────────────────
CROP_PARAMS = {
    "rice":        {"N": (80,120), "P": (40,60),  "K": (40,60),  "pH": (5.5,7.0), "temp": (20,35), "humidity": (75,95), "rainfall": (150,300), "yield": (3500,5500)},
    "wheat":       {"N": (100,140),"P": (50,70),  "K": (35,55),  "pH": (6.0,7.5), "temp": (10,25), "humidity": (40,65), "rainfall": (50,150),  "yield": (2500,4500)},
    "maize":       {"N": (80,120), "P": (40,65),  "K": (20,40),  "pH": (5.5,7.5), "temp": (18,35), "humidity": (50,75), "rainfall": (60,200),  "yield": (4000,7000)},
    "chickpea":    {"N": (30,50),  "P": (55,80),  "K": (70,90),  "pH": (6.0,8.0), "temp": (15,30), "humidity": (20,45), "rainfall": (30,100),  "yield": (800,1500)},
    "kidneybeans": {"N": (15,30),  "P": (55,75),  "K": (18,35),  "pH": (5.5,7.0), "temp": (15,27), "humidity": (50,70), "rainfall": (100,200), "yield": (1000,2000)},
    "pigeonpeas":  {"N": (15,30),  "P": (60,80),  "K": (18,35),  "pH": (5.5,7.5), "temp": (25,40), "humidity": (45,70), "rainfall": (65,200),  "yield": (700,1500)},
    "mothbeans":   {"N": (15,30),  "P": (45,65),  "K": (18,35),  "pH": (3.5,7.0), "temp": (24,35), "humidity": (25,45), "rainfall": (30,80),   "yield": (600,1000)},
    "mungbean":    {"N": (15,30),  "P": (55,75),  "K": (18,35),  "pH": (6.2,7.2), "temp": (25,35), "humidity": (40,60), "rainfall": (60,150),  "yield": (800,1200)},
    "blackgram":   {"N": (30,50),  "P": (55,75),  "K": (18,35),  "pH": (6.0,7.5), "temp": (22,35), "humidity": (50,70), "rainfall": (70,200),  "yield": (700,1200)},
    "lentil":      {"N": (15,30),  "P": (50,70),  "K": (18,35),  "pH": (6.0,8.0), "temp": (12,25), "humidity": (35,55), "rainfall": (20,80),   "yield": (1000,1800)},
    "pomegranate": {"N": (90,120), "P": (40,70),  "K": (40,70),  "pH": (5.5,7.5), "temp": (25,40), "humidity": (35,60), "rainfall": (50,135),  "yield": (8000,20000)},
    "banana":      {"N": (80,120), "P": (60,80),  "K": (50,250), "pH": (5.5,7.0), "temp": (25,35), "humidity": (75,95), "rainfall": (100,300), "yield": (20000,40000)},
    "mango":       {"N": (20,40),  "P": (20,40),  "K": (30,50),  "pH": (5.5,7.5), "temp": (24,37), "humidity": (45,75), "rainfall": (70,200),  "yield": (5000,14000)},
    "grapes":      {"N": (15,35),  "P": (35,55),  "K": (30,50),  "pH": (5.5,7.0), "temp": (8,30),  "humidity": (50,80), "rainfall": (60,200),  "yield": (8000,20000)},
    "watermelon":  {"N": (90,120), "P": (10,30),  "K": (45,65),  "pH": (5.5,7.5), "temp": (24,40), "humidity": (55,80), "rainfall": (30,100),  "yield": (20000,35000)},
    "muskmelon":   {"N": (90,120), "P": (10,25),  "K": (45,65),  "pH": (6.0,7.5), "temp": (28,40), "humidity": (60,80), "rainfall": (20,90),   "yield": (10000,20000)},
    "apple":       {"N": (0,20),   "P": (120,150),"K": (195,210),"pH": (5.5,7.0), "temp": (0,25),  "humidity": (50,80), "rainfall": (100,200), "yield": (8000,20000)},
    "orange":      {"N": (0,20),   "P": (5,20),   "K": (5,20),   "pH": (6.0,7.5), "temp": (10,27), "humidity": (65,90), "rainfall": (80,200),  "yield": (10000,25000)},
    "papaya":      {"N": (40,60),  "P": (50,70),  "K": (45,65),  "pH": (6.0,7.0), "temp": (25,35), "humidity": (70,95), "rainfall": (150,300), "yield": (30000,50000)},
    "coconut":     {"N": (0,20),   "P": (0,10),   "K": (30,50),  "pH": (5.5,7.5), "temp": (27,37), "humidity": (60,95), "rainfall": (100,300), "yield": (6000,14000)},
    "cotton":      {"N": (100,140),"P": (35,55),  "K": (15,30),  "pH": (6.0,8.0), "temp": (22,40), "humidity": (40,75), "rainfall": (60,200),  "yield": (1500,3000)},
    "jute":        {"N": (60,90),  "P": (45,65),  "K": (40,60),  "pH": (6.0,8.0), "temp": (24,37), "humidity": (70,95), "rainfall": (150,350), "yield": (2000,3500)},
    "coffee":      {"N": (80,120), "P": (20,40),  "K": (25,45),  "pH": (6.0,7.5), "temp": (15,28), "humidity": (65,90), "rainfall": (150,300), "yield": (500,1500)},
}

def generate_dataset(samples_per_crop: int = 200) -> pd.DataFrame:
    """Generate synthetic but realistic training data."""
    rows = []
    rng = np.random.default_rng(42)
    for crop, params in CROP_PARAMS.items():
        for _ in range(samples_per_crop):
            n = rng.uniform(*params["N"])
            p = rng.uniform(*params["P"])
            k = rng.uniform(*params["K"])
            ph = rng.uniform(*params["pH"])
            temp = rng.uniform(*params["temp"])
            humidity = rng.uniform(*params["humidity"])
            rainfall = rng.uniform(*params["rainfall"])
            y_min, y_max = params["yield"]
            # yield varies with optimal nutrient levels
            nutrient_score = (
                (1 - abs((n - np.mean(params["N"])) / (params["N"][1] - params["N"][0] + 1))) * 0.4 +
                (1 - abs((p - np.mean(params["P"])) / (params["P"][1] - params["P"][0] + 1))) * 0.3 +
                (1 - abs((k - np.mean(params["K"])) / (params["K"][1] - params["K"][0] + 1))) * 0.3
            )
            yield_val = y_min + (y_max - y_min) * nutrient_score + rng.normal(0, (y_max - y_min) * 0.05)
            yield_val = max(y_min * 0.7, min(y_max * 1.1, yield_val))
            rows.append({
                "N": round(n, 2), "P": round(p, 2), "K": round(k, 2),
                "pH": round(ph, 2), "temperature": round(temp, 2),
                "humidity": round(humidity, 2), "rainfall": round(rainfall, 2),
                "label": crop, "yield_kg_per_ha": round(yield_val, 2)
            })
    df = pd.DataFrame(rows)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    return df


def train_crop_model(df: pd.DataFrame):
    """Train Random Forest crop recommendation model."""
    features = ["N", "P", "K", "pH", "temperature", "humidity", "rainfall"]
    X = df[features]
    y = df["label"]

    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(X, y_enc, test_size=0.2, random_state=42, stratify=y_enc)

    model = RandomForestClassifier(
        n_estimators=200, max_depth=20, min_samples_split=4,
        min_samples_leaf=2, random_state=42, n_jobs=-1
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"[Crop Model] Accuracy: {acc:.4f}")

    joblib.dump(model, os.path.join(MODEL_DIR, "crop_model.pkl"))
    joblib.dump(le, os.path.join(MODEL_DIR, "label_encoder.pkl"))
    print("[Crop Model] Saved.")
    return model, le, acc


def train_yield_model(df: pd.DataFrame):
    """Train Gradient Boosting yield prediction regression model."""
    features = ["N", "P", "K", "pH", "temperature", "humidity", "rainfall"]
    X = df[features]
    y = df["yield_kg_per_ha"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    model = GradientBoostingRegressor(
        n_estimators=300, learning_rate=0.05, max_depth=6,
        min_samples_split=4, random_state=42
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"[Yield Model] R2: {r2:.4f}, MAE: {mae:.2f} kg/ha")

    joblib.dump(model, os.path.join(MODEL_DIR, "yield_model.pkl"))
    joblib.dump(scaler, os.path.join(MODEL_DIR, "yield_scaler.pkl"))
    print("[Yield Model] Saved.")
    return model, scaler, r2


def train_cost_model(df: pd.DataFrame):
    """Train regression model to predict total cost per hectare (INR)."""
    # Base costs per crop (INR/ha) — approximated from India agri cost data
    CROP_BASE_COSTS = {
        "rice": 35000, "wheat": 28000, "maize": 22000, "chickpea": 20000,
        "kidneybeans": 25000, "pigeonpeas": 18000, "mothbeans": 14000,
        "mungbean": 18000, "blackgram": 17000, "lentil": 20000,
        "pomegranate": 80000, "banana": 120000, "mango": 60000,
        "grapes": 90000, "watermelon": 35000, "muskmelon": 28000,
        "apple": 110000, "orange": 55000, "papaya": 45000, "coconut": 30000,
        "cotton": 40000, "jute": 25000, "coffee": 70000
    }

    le = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
    df = df.copy()
    df["label_enc"] = le.transform(df["label"])
    # Generate realistic cost with noise
    rng = np.random.default_rng(123)
    df["total_cost"] = df["label"].map(CROP_BASE_COSTS) * rng.uniform(0.85, 1.15, len(df))

    features = ["N", "P", "K", "pH", "temperature", "humidity", "rainfall", "label_enc"]
    X = df[features]
    y = df["total_cost"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    model = GradientBoostingRegressor(
        n_estimators=200, learning_rate=0.05, max_depth=5, random_state=42
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"[Cost Model] R2: {r2:.4f}, MAE: ₹{mae:.2f}")

    joblib.dump(model, os.path.join(MODEL_DIR, "cost_model.pkl"))
    joblib.dump(scaler, os.path.join(MODEL_DIR, "cost_scaler.pkl"))
    print("[Cost Model] Saved.")
    return model, scaler, r2


if __name__ == "__main__":
    print("Generating dataset...")
    df = generate_dataset(samples_per_crop=250)
    df.to_csv(os.path.join(MODEL_DIR, "training_data.csv"), index=False)
    print(f"Dataset: {len(df)} rows, {df['label'].nunique()} crops")

    print("\nTraining Crop Recommendation Model...")
    train_crop_model(df)

    print("\nTraining Yield Prediction Model...")
    train_yield_model(df)

    print("\nTraining Cost Prediction Model...")
    train_cost_model(df)

    print("\n✅ All models trained and saved successfully!")
