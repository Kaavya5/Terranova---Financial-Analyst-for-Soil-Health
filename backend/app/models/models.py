"""
SQLAlchemy ORM models mirroring database/schema.sql
"""
import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text, JSON, Uuid
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(String(50), default="farmer")
    region = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    soil_data = relationship("SoilData", back_populates="user", cascade="all, delete")
    predictions = relationship("Prediction", back_populates="user", cascade="all, delete")
    financial_reports = relationship("FinancialReport", back_populates="user", cascade="all, delete")
    chat_history = relationship("ChatHistory", back_populates="user", cascade="all, delete")


class SoilData(Base):
    __tablename__ = "soil_data"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    nitrogen = Column(Float, nullable=False)
    phosphorus = Column(Float, nullable=False)
    potassium = Column(Float, nullable=False)
    ph = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    rainfall = Column(Float, nullable=False)
    region = Column(String(100))
    field_area_hectares = Column(Float, default=1.0)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="soil_data")
    predictions = relationship("Prediction", back_populates="soil_data", cascade="all, delete")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    soil_data_id = Column(Uuid(as_uuid=True), ForeignKey("soil_data.id", ondelete="CASCADE"))
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    recommended_crop = Column(String(100), nullable=False)
    crop_confidence = Column(Float)
    predicted_yield_kg_per_ha = Column(Float)
    alternative_crops = Column(JSON, default=[])
    model_version = Column(String(50), default="1.0")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="predictions")
    soil_data = relationship("SoilData", back_populates="predictions")
    financial_report = relationship("FinancialReport", back_populates="prediction", uselist=False, cascade="all, delete")
    chat_history = relationship("ChatHistory", back_populates="prediction")


class FinancialReport(Base):
    __tablename__ = "financial_reports"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prediction_id = Column(Uuid(as_uuid=True), ForeignKey("predictions.id", ondelete="CASCADE"))
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    fertilizer_cost = Column(Float)
    seed_cost = Column(Float)
    labor_cost = Column(Float)
    irrigation_cost = Column(Float)
    pesticide_cost = Column(Float)
    machinery_cost = Column(Float)
    other_costs = Column(Float)
    total_cost = Column(Float)
    expected_yield_kg = Column(Float)
    market_price_per_kg = Column(Float)
    expected_revenue = Column(Float)
    expected_profit = Column(Float)
    roi_percentage = Column(Float)
    rule_based_cost = Column(Float)
    ml_predicted_cost = Column(Float)
    cost_confidence = Column(Float)
    fertilizer_recommendations = Column(JSON, default={})
    field_area_hectares = Column(Float, default=1.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="financial_reports")
    prediction = relationship("Prediction", back_populates="financial_report")


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    session_id = Column(Uuid(as_uuid=True), default=uuid.uuid4)
    role = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    context_prediction_id = Column(Uuid(as_uuid=True), ForeignKey("predictions.id", ondelete="SET NULL"), nullable=True)
    tokens_used = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="chat_history")
    prediction = relationship("Prediction", back_populates="chat_history")
