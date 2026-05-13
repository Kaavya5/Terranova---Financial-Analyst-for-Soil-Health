"""
HTTP client for communicating with the ML microservice.
"""
import httpx
from fastapi import HTTPException

from app.core.config import settings
from app.schemas.schemas import MLPredictionResponse, SoilInput


async def call_ml_predict(soil: SoilInput) -> MLPredictionResponse:
    """Send soil data to ML service and return structured prediction."""
    payload = {
        "N": soil.N,
        "P": soil.P,
        "K": soil.K,
        "pH": soil.pH,
        "temperature": soil.temperature,
        "humidity": soil.humidity,
        "rainfall": soil.rainfall,
        "area_ha": soil.area_ha,
    }
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(f"{settings.ML_SERVICE_URL}/predict", json=payload)
            response.raise_for_status()
            return MLPredictionResponse(**response.json())
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="ML service unavailable. Please try again later.")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"ML service error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
