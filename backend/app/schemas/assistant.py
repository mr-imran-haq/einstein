from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


class InternalChatRequest(BaseModel):
    user_id: int
    message: str