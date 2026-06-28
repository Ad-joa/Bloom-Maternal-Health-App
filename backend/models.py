from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Onboarding details
    trimester = Column(Integer, nullable=True, index=True)
    due_date = Column(String, nullable=True, index=True)
    is_first_pregnancy = Column(Boolean, nullable=True)
    medical_conditions = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    weight = Column(String, nullable=True)
    primary_goal = Column(String, nullable=True)
    dietary_preferences = Column(String, nullable=True)
    emergency_contact_name = Column(String, nullable=True)
    emergency_contact_phone = Column(String, nullable=True)

    # Relationships
    logs = relationship("SymptomLog", back_populates="user")

class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    symptoms = Column(String)  # Stored as comma-separated string
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="logs")
