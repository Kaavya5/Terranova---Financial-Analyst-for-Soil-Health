"""
GET /reports — list and detail financial reports.
"""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user
from app.db.base import get_db
from app.models.models import FinancialReport, Prediction, User
from app.schemas.schemas import ReportDetail, ReportListItem

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("", response_model=list[ReportListItem])
async def list_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(FinancialReport, Prediction.recommended_crop, Prediction.crop_confidence)
        .join(Prediction, FinancialReport.prediction_id == Prediction.id)
        .where(FinancialReport.user_id == current_user.id)
        .order_by(FinancialReport.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = result.all()
    items = []
    for fr, crop, confidence in rows:
        items.append(ReportListItem(
            id=fr.id,
            recommended_crop=crop,
            crop_confidence=confidence or 0.0,
            total_cost=fr.total_cost or 0.0,
            expected_profit=fr.expected_profit or 0.0,
            roi_percentage=fr.roi_percentage or 0.0,
            field_area_hectares=fr.field_area_hectares or 1.0,
            created_at=fr.created_at,
        ))
    return items


@router.get("/{report_id}", response_model=ReportDetail)
async def get_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(FinancialReport, Prediction)
        .join(Prediction, FinancialReport.prediction_id == Prediction.id)
        .where(FinancialReport.id == report_id, FinancialReport.user_id == current_user.id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Report not found")
    fr, pred = row
    return ReportDetail(
        id=fr.id,
        recommended_crop=pred.recommended_crop,
        crop_confidence=pred.crop_confidence or 0.0,
        total_cost=fr.total_cost or 0.0,
        expected_profit=fr.expected_profit or 0.0,
        roi_percentage=fr.roi_percentage or 0.0,
        field_area_hectares=fr.field_area_hectares or 1.0,
        created_at=fr.created_at,
        fertilizer_cost=fr.fertilizer_cost or 0.0,
        seed_cost=fr.seed_cost or 0.0,
        labor_cost=fr.labor_cost or 0.0,
        irrigation_cost=fr.irrigation_cost or 0.0,
        pesticide_cost=fr.pesticide_cost or 0.0,
        machinery_cost=fr.machinery_cost or 0.0,
        other_costs=fr.other_costs or 0.0,
        expected_revenue=fr.expected_revenue or 0.0,
        market_price_per_kg=fr.market_price_per_kg or 0.0,
        expected_yield_kg=fr.expected_yield_kg or 0.0,
        rule_based_cost=fr.rule_based_cost or 0.0,
        ml_predicted_cost=fr.ml_predicted_cost or 0.0,
        cost_confidence=fr.cost_confidence or 0.0,
        fertilizer_recommendations=fr.fertilizer_recommendations or {},
        alternative_crops=pred.alternative_crops or [],
        yield_kg_per_ha=pred.predicted_yield_kg_per_ha or 0.0,
    )
