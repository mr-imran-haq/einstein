from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String(200), nullable=False)
    category = Column(String(50), nullable=True)
    priority = Column(String(20), default="medium")
    deadline = Column(Date, nullable=True)
    is_completed = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")