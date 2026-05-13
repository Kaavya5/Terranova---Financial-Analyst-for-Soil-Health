"""
POST /chat — LLM chatbot for agronomic advice.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.base import get_db
from app.models.models import User
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.chat_service import get_chat_response

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    req: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reply, session_id, tokens_used = await get_chat_response(
        user_message=req.message,
        session_id=req.session_id,
        prediction_id=req.prediction_id,
        user_id=current_user.id,
        db=db,
    )
    return ChatResponse(reply=reply, session_id=session_id, tokens_used=tokens_used)
