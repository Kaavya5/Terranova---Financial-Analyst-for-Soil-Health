"""
Pydantic v2 request/response schemas.
"""
from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# ── Auth ─────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
    region: Optional[str] = None


class UserOut(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str]
    role: str
    region: Optional[str]
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Soil Input ─────────────────────────────────────────────────────────────────

class SoilInput(BaseModel):
    N: float = Field(..., ge=0, le=200, description="Nitrogen (kg/ha)")
    P: float = Field(..., ge=0, le=200, description="Phosphorus (kg/ha)")
    K: float = Field(..., ge=0, le=200, description="Potassium (kg/ha)")
    pH: float = Field(..., ge=0, le=14)
    temperature: float = Field(..., description="Temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Humidity (%)")
    rainfall: float = Field(..., ge=0, description="Rainfall (mm)")
    area_ha: float = Field(1.0, ge=0.1, description="Field area (hectares)")
    market_price_per_kg: Optional[float] = Field(None, description="Optional market price override (INR/kg)")
    region: Optional[str] = None


# ── ML Service Response ────────────────────────────────────────────────────────

class MLPredictionResponse(BaseModel):
    recommended_crop: str
    crop_confidence: float
    alternative_crops: List[Dict[str, Any]]
    yield_kg_per_ha: float
    total_yield_kg: float
    rule_based_cost: float
    ml_predicted_cost: float
    blended_cost: float
    cost_confidence: float
    cost_breakdown: Dict[str, float]
    fertilizer_recommendations: Dict[str, Any]


# ── Full Prediction Out ────────────────────────────────────────────────────────

class FinancialSummary(BaseModel):
    total_cost: float
    expected_revenue: float
    expected_profit: float
    roi_percentage: float
    cost_breakdown: Dict[str, float]
    fertilizer_recommendations: Dict[str, Any]
    rule_based_cost: float
    ml_predicted_cost: float
    cost_confidence: float


class PredictionOut(BaseModel):
    id: UUID
    recommended_crop: str
    crop_confidence: float
    alternative_crops: List[Dict[str, Any]]
    yield_kg_per_ha: float
    total_yield_kg: float
    area_ha: float
    financial: FinancialSummary
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Reports ───────────────────────────────────────────────────────────────────

class ReportListItem(BaseModel):
    id: UUID
    recommended_crop: str
    crop_confidence: float
    total_cost: float
    expected_profit: float
    roi_percentage: float
    field_area_hectares: float
    created_at: datetime

    model_config = {"from_attributes": True}


class ReportDetail(ReportListItem):
    fertilizer_cost: float
    seed_cost: float
    labor_cost: float
    irrigation_cost: float
    pesticide_cost: float
    machinery_cost: float
    other_costs: float
    expected_revenue: float
    market_price_per_kg: float
    expected_yield_kg: float
    rule_based_cost: float
    ml_predicted_cost: float
    cost_confidence: float
    fertilizer_recommendations: Dict[str, Any]
    alternative_crops: List[Dict[str, Any]]
    yield_kg_per_ha: float


# ── Chat ──────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    session_id: Optional[UUID] = None
    prediction_id: Optional[UUID] = None


class ChatResponse(BaseModel):
    reply: str
    session_id: UUID
    tokens_used: Optional[int] = None
