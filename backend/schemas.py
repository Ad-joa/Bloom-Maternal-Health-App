from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserOnboarding(BaseModel):
    trimester: Optional[int] = None
    due_date: Optional[str] = None
    is_first_pregnancy: Optional[bool] = None
    medical_conditions: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[str] = None
    primary_goal: Optional[str] = None
    dietary_preferences: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    trimester: Optional[int] = None
    due_date: Optional[str] = None

    class Config:
        from_attributes = True

class SymptomLogCreate(BaseModel):
    symptoms: str

class SymptomLogResponse(BaseModel):
    id: int
    user_id: int
    symptoms: str
    
    class Config:
        from_attributes = True
