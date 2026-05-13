"""
Anthropic Claude-powered chatbot service for agronomic advice.
"""
import uuid
from typing import Optional
from uuid import UUID

import anthropic
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.models.models import ChatHistory, Prediction

SYSTEM_PROMPT = """You are SoilAI, an expert agricultural advisor built into the Terra Nova precision farming platform. You have deep knowledge of:
- Soil science and fertility management (NPK, pH, micronutrients)
- Crop agronomy and cultivation techniques for Indian conditions
- Financial planning for farmers (cost estimation, ROI, market prices in INR)
- Fertilizer recommendations and nutrient management
- Pest and disease management
- Water and irrigation management
- Indian agricultural markets, MSP (Minimum Support Price), and government schemes

Your role is to help farmers make data-driven decisions. Be concise, practical, and empathetic. Use simple language — many users may not be highly technical. When discussing costs, always use Indian Rupees (₹). Always suggest sustainable farming practices and organic alternatives where possible."""


async def get_chat_response(
    user_message: str,
    session_id: Optional[UUID],
    prediction_id: Optional[UUID],
    user_id: UUID,
    db: AsyncSession,
) -> tuple[str, UUID, int]:
    """
    Get Claude AI response. Returns (reply_text, session_id, tokens_used).
    """
    if not session_id:
        session_id = uuid.uuid4()

    # Build context from prediction if provided
    context_block = ""
    if prediction_id:
        result = await db.execute(select(Prediction).where(Prediction.id == prediction_id))
        pred = result.scalar_one_or_none()
        if pred:
            context_block = f"""
The farmer is asking about their recent soil analysis and prediction:
- Recommended crop: {pred.recommended_crop} (AI confidence: {pred.crop_confidence:.1%})
- Estimated yield: {pred.predicted_yield_kg_per_ha:.0f} kg/ha
- Alternative crops considered: {pred.alternative_crops}
Use this context to give specific, relevant advice.
"""

    # Fetch last 10 messages in session for conversation history
    history_result = await db.execute(
        select(ChatHistory)
        .where(ChatHistory.session_id == session_id)
        .order_by(ChatHistory.created_at.asc())
        .limit(10)
    )
    history = history_result.scalars().all()

    # Build messages list for Anthropic API
    messages = []
    for msg in history:
        role = "user" if msg.role == "user" else "assistant"
        messages.append({"role": role, "content": msg.content})
    messages.append({"role": "user", "content": user_message})

    full_system = SYSTEM_PROMPT + context_block

    if not settings.ANTHROPIC_API_KEY:
        reply = (
            "Hello! I'm SoilAI, your digital agronomist powered by Anthropic Claude. "
            "The ANTHROPIC_API_KEY is not configured on the server yet. "
            "Once set, I can answer questions about your crops, soil health, costs, and farming strategies."
        )
        tokens_used = 0
    else:
        client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        completion = await client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=800,
            system=full_system,
            messages=messages,
        )
        reply = completion.content[0].text
        tokens_used = completion.usage.input_tokens + completion.usage.output_tokens

    # Persist conversation turns
    user_turn = ChatHistory(
        user_id=user_id,
        session_id=session_id,
        role="user",
        content=user_message,
        context_prediction_id=prediction_id,
    )
    assistant_turn = ChatHistory(
        user_id=user_id,
        session_id=session_id,
        role="assistant",
        content=reply,
        context_prediction_id=prediction_id,
        tokens_used=tokens_used,
    )
    db.add(user_turn)
    db.add(assistant_turn)
    await db.flush()

    return reply, session_id, tokens_used
