from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Conversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    started_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")


class ConversationMessage(Base):
    __tablename__ = "ai_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("ai_conversations.id"), nullable=False)

    role = Column(String(20), nullable=False)   # "user" or "assistant"
    content = Column(Text, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("Conversation")


class Memory(Base):
    __tablename__ = "ai_memories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    source_conversation_id = Column(Integer, ForeignKey("ai_conversations.id"), nullable=True)

    category = Column(String(50), nullable=False)   # goal, preference, instruction, project...
    content = Column(Text, nullable=False)
    importance_score = Column(Integer, default=5)   # 1-10

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")