from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Date, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class PregnancyProfile(Base):
    __tablename__ = "pregnancy_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lmp_date = Column(Date)
    due_date = Column(Date)
    current_trimester = Column(Integer)

    user = relationship("User", back_populates="profile")

class HealthContent(Base):
    __tablename__ = "health_content"

    id = Column(Integer, primary_key=True, index=True)
    trimester = Column(Integer, nullable=False)
    category = Column(String)
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    symptoms = Column(JSON)  # List of symptoms
    advisory_result = Column(Text)
    risk_level = Column(String) # low / medium / high
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="symptom_logs")

class AntenatalVisit(Base):
    __tablename__ = "antenatal_visits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    visit_date = Column(DateTime)
    notes = Column(Text)
    next_visit_date = Column(DateTime)

    user = relationship("User", back_populates="visits")
