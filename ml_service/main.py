"""
ML Service: FastAPI app exposing ML inference endpoints.
"""
import os
import logging
from contextlib import asynccontextmanager
from typing import Optional
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import sys

sys.path.insert(0, os.path.dirname(__file__))
from cost_engine import rule_based_cost_estimate

logger = logging.getLogger("ml_service")

# ─── Model store ────────────────────────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

models = {}

def load_models():
    """Load all trained models into memory."""
    try:
        models["crop"] = joblib.load(os.path.join(MODEL_DIR, "crop_model.pkl"))
        models["label_encoder"] = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
        models["yield"] = joblib.load(os.path.join(MODEL_DIR, "yield_model.pkl"))
        models["yield_scaler"] = joblib.load(os.path.join(MODEL_DIR, "yield_scaler.pkl"))
        models["cost"] = joblib.load(os.path.join(MODEL_DIR, "cost_model.pkl"))
        models["cost_scaler"] = joblib.load(os.path.join(MODEL_DIR, "cost_scaler.pkl"))
        logger.info("All ML models loaded successfully.")
    except FileNotFoundError as e:
        logger.warning(f"Model file not found: {e}. Run train_models.py first.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_models()
    yield


app = FastAPI(
    title="Soil ML Service",
    description="ML inference for crop recommendation, yield and cost prediction",
    version="1.0.0",
    lifespan=lifespan,
)


# ─── Schemas ────────────────────────────────────────────────────────────────────
class SoilInput(BaseModel):
    N: float = Field(..., ge=0, le=200, description="Nitrogen (kg/ha)")
    P: float = Field(..., ge=0, le=200, description="Phosphorus (kg/ha)")
    K: float = Field(..., ge=0, le=200, description="Potassium (kg/ha)")
    pH: float = Field(..., ge=0, le=14)
    temperature: float = Field(..., description="Temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Humidity (%)")
    rainfall: float = Field(..., ge=0, description="Rainfall (mm)")
    area_ha: float = Field(1.0, ge=0.1, description="Field area (hectares)")


class PredictionResponse(BaseModel):
    recommended_crop: str
    crop_confidence: float
    alternative_crops: list
    yield_kg_per_ha: float
    total_yield_kg: float
    rule_based_cost: float
    ml_predicted_cost: float
    blended_cost: float
    cost_confidence: float
    cost_breakdown: dict
    fertilizer_recommendations: dict


# ─── Endpoints ──────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": len(models) > 0}


@app.post("/predict", response_model=PredictionResponse)
def predict(soil: SoilInput):
    if not models:
        raise HTTPException(status_code=503, detail="Models not loaded. Run train_models.py first.")

    features = np.array([[soil.N, soil.P, soil.K, soil.pH, soil.temperature, soil.humidity, soil.rainfall]])

    # ── Crop Recommendation ──────────────────────────────────────────────────
    crop_model = models["crop"]
    le = models["label_encoder"]
    proba = crop_model.predict_proba(features)[0]
    top_indices = np.argsort(proba)[::-1][:3]
    recommended_crop = le.classes_[top_indices[0]]
    crop_confidence = float(proba[top_indices[0]])
    alt_crops = [
        {"crop": le.classes_[i], "confidence": round(float(proba[i]), 4)}
        for i in top_indices[1:]
    ]

    # ── Yield Prediction ─────────────────────────────────────────────────────
    yield_scaler = models["yield_scaler"]
    yield_model = models["yield"]
    x_scaled = yield_scaler.transform(features)
    yield_kg_per_ha = float(yield_model.predict(x_scaled)[0])
    total_yield_kg = round(yield_kg_per_ha * soil.area_ha, 2)

    # ── Rule-Based Cost ──────────────────────────────────────────────────────
    rb = rule_based_cost_estimate(
        crop=recommended_crop,
        soil_n=soil.N, soil_p=soil.P, soil_k=soil.K,
        rainfall=soil.rainfall, area_ha=soil.area_ha
    )

    # ── ML Cost Prediction ───────────────────────────────────────────────────
    label_enc = le.transform([recommended_crop])[0]
    cost_features = np.array([[soil.N, soil.P, soil.K, soil.pH, soil.temperature, soil.humidity, soil.rainfall, label_enc]])
    cost_scaler = models["cost_scaler"]
    cost_model = models["cost"]
    x_cost_scaled = cost_scaler.transform(cost_features)
    ml_cost_per_ha = float(cost_model.predict(x_cost_scaled)[0])
    ml_total_cost = round(ml_cost_per_ha * soil.area_ha, 2)

    # ── Blended Cost (70% rule-based + 30% ML) ──────────────────────────────
    blended = round(0.70 * rb.total_cost + 0.30 * ml_total_cost, 2)
    cost_confidence = round(min(0.95, 0.65 + crop_confidence * 0.3), 4)

    cost_breakdown = {
        "fertilizer_cost": rb.fertilizer_cost,
        "seed_cost": rb.seed_cost,
        "labor_cost": rb.labor_cost,
        "irrigation_cost": rb.irrigation_cost,
        "pesticide_cost": rb.pesticide_cost,
        "machinery_cost": rb.machinery_cost,
        "other_costs": rb.other_costs,
    }

    return PredictionResponse(
        recommended_crop=recommended_crop,
        crop_confidence=round(crop_confidence, 4),
        alternative_crops=alt_crops,
        yield_kg_per_ha=round(yield_kg_per_ha, 2),
        total_yield_kg=total_yield_kg,
        rule_based_cost=rb.total_cost,
        ml_predicted_cost=ml_total_cost,
        blended_cost=blended,
        cost_confidence=cost_confidence,
        cost_breakdown=cost_breakdown,
        fertilizer_recommendations=rb.fertilizer_recommendations,
    )
