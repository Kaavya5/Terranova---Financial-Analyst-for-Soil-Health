"""
POST /predict — runs ML prediction, saves to DB, returns full report.
"""
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.base import get_db
from app.models.models import FinancialReport, Prediction, SoilData, User
from app.schemas.schemas import PredictionOut, SoilInput, FinancialSummary
from app.services.ml_client import call_ml_predict

# Default market prices (INR/kg) used when user doesn't provide one
MARKET_PRICES = {
    "rice": 21.0, "wheat": 20.0, "maize": 18.0, "chickpea": 55.0,
    "kidneybeans": 90.0, "pigeonpeas": 65.0, "mothbeans": 60.0,
    "mungbean": 70.0, "blackgram": 55.0, "lentil": 60.0, "pomegranate": 80.0,
    "banana": 25.0, "mango": 50.0, "grapes": 60.0, "watermelon": 15.0,
    "muskmelon": 25.0, "apple": 80.0, "orange": 40.0, "papaya": 20.0,
    "coconut": 30.0, "cotton": 65.0, "jute": 40.0, "coffee": 320.0,
}

router = APIRouter(prefix="/predict", tags=["predict"])


@router.post("", response_model=PredictionOut)
async def predict(
    soil: SoilInput,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ── Call ML Service ─────────────────────────────────────────────────────
    ml = await call_ml_predict(soil)

    # ── Persist SoilData ────────────────────────────────────────────────────
    soil_record = SoilData(
        user_id=current_user.id,
        nitrogen=soil.N,
        phosphorus=soil.P,
        potassium=soil.K,
        ph=soil.pH,
        temperature=soil.temperature,
        humidity=soil.humidity,
        rainfall=soil.rainfall,
        region=soil.region,
        field_area_hectares=soil.area_ha,
    )
    db.add(soil_record)
    await db.flush()

    # ── Persist Prediction ──────────────────────────────────────────────────
    prediction = Prediction(
        soil_data_id=soil_record.id,
        user_id=current_user.id,
        recommended_crop=ml.recommended_crop,
        crop_confidence=ml.crop_confidence,
        predicted_yield_kg_per_ha=ml.yield_kg_per_ha,
        alternative_crops=ml.alternative_crops,
    )
    db.add(prediction)
    await db.flush()

    # ── Compute financial metrics ───────────────────────────────────────────
    market_price = soil.market_price_per_kg or MARKET_PRICES.get(ml.recommended_crop.lower(), 30.0)
    expected_revenue = round(ml.total_yield_kg * market_price, 2)
    expected_profit = round(expected_revenue - ml.blended_cost, 2)
    roi = round((expected_profit / ml.blended_cost) * 100, 2) if ml.blended_cost > 0 else 0.0

    # ── Persist FinancialReport ─────────────────────────────────────────────
    report = FinancialReport(
        prediction_id=prediction.id,
        user_id=current_user.id,
        fertilizer_cost=ml.cost_breakdown.get("fertilizer_cost", 0),
        seed_cost=ml.cost_breakdown.get("seed_cost", 0),
        labor_cost=ml.cost_breakdown.get("labor_cost", 0),
        irrigation_cost=ml.cost_breakdown.get("irrigation_cost", 0),
        pesticide_cost=ml.cost_breakdown.get("pesticide_cost", 0),
        machinery_cost=ml.cost_breakdown.get("machinery_cost", 0),
        other_costs=ml.cost_breakdown.get("other_costs", 0),
        total_cost=ml.blended_cost,
        expected_yield_kg=ml.total_yield_kg,
        market_price_per_kg=market_price,
        expected_revenue=expected_revenue,
        expected_profit=expected_profit,
        roi_percentage=roi,
        rule_based_cost=ml.rule_based_cost,
        ml_predicted_cost=ml.ml_predicted_cost,
        cost_confidence=ml.cost_confidence,
        fertilizer_recommendations=ml.fertilizer_recommendations,
        field_area_hectares=soil.area_ha,
    )
    db.add(report)
    await db.flush()

    return PredictionOut(
        id=prediction.id,
        recommended_crop=ml.recommended_crop,
        crop_confidence=ml.crop_confidence,
        alternative_crops=ml.alternative_crops,
        yield_kg_per_ha=ml.yield_kg_per_ha,
        total_yield_kg=ml.total_yield_kg,
        area_ha=soil.area_ha,
        financial=FinancialSummary(
            total_cost=ml.blended_cost,
            expected_revenue=expected_revenue,
            expected_profit=expected_profit,
            roi_percentage=roi,
            cost_breakdown=ml.cost_breakdown,
            fertilizer_recommendations=ml.fertilizer_recommendations,
            rule_based_cost=ml.rule_based_cost,
            ml_predicted_cost=ml.ml_predicted_cost,
            cost_confidence=ml.cost_confidence,
        ),
        created_at=prediction.created_at,
    )
