from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from app.db.base import Base


class Creation(Base):
    __tablename__ = "creations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    type = Column(String(50), nullable=False)   # e.g. "study_plan", "website_idea", "routine_draft"
    title = Column(String(200), nullable=False)
    content = Column(JSONB, nullable=False)      # flexible structure per type

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")