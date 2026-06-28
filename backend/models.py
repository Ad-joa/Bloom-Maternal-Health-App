from sqlalchemy import Column, Integer, String
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
