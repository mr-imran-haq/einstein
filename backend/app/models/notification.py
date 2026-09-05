from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class NotificationLog(Base):
    __tablename__ = "notifications_log"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    type = Column(String(50), nullable=False)   # reminder, daily_summary, deadline
    message = Column(String(500), nullable=False)
    sent_via = Column(String(20), default="telegram")

    sent_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")