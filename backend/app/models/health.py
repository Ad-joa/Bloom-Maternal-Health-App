from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Date, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class PregnancyProfile(Base):
    __tablename__ = "pregnancy_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    last_menstrual_period = Column(Date)
    due_date = Column(Date)
    current_trimester = Column(Integer)  # 1, 2, or 3
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="profile")

class HealthContent(Base):
    __tablename__ = "health_content"

    id = Column(Integer, primary_key=True, index=True)
    trimester = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    image_url = Column(String)
    category = Column(String)  # e.g., "Nutrition", "Exercise", "Warning Signs"

class SymptomReport(Base):
    __tablename__ = "symptom_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    symptoms = Column(JSON)  # List of symptoms reported
    risk_level = Column(String)  # "Low", "Mid", "High"
    advice_given = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AntenatalVisit(Base):
    __tablename__ = "antenatal_visits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    visit_date = Column(DateTime)
    notes = Column(Text)
    reminders_sent = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
