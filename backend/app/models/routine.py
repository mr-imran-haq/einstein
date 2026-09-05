from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Routine(Base):
    __tablename__ = "routines"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=True)
    activity = Column(String(200), nullable=False)
    category = Column(String(50), nullable=True)
    priority = Column(String(20), default="medium")
    status = Column(String(20), default="pending")  # pending, in_progress, done

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")