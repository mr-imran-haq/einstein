from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Target(Base):
    __tablename__ = "targets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    subject = Column(String(100), nullable=False)
    name = Column(String(200), nullable=False)
    progress_percent = Column(Integer, default=0)
    deadline = Column(Date, nullable=True)
    status = Column(String(20), default="active")  # active, completed, abandoned

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")