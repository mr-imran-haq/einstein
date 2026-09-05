from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class NewsPreference(Base):
    __tablename__ = "news_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    topic = Column(String(100), nullable=False)   # e.g. "AI", "Bangladesh", "cybersecurity"
    is_active = Column(String(10), default="true")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")


class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String(300), nullable=False)
    summary = Column(Text, nullable=True)
    source = Column(String(100), nullable=True)
    url = Column(String(500), nullable=True)
    topic = Column(String(100), nullable=True)

    fetched_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")