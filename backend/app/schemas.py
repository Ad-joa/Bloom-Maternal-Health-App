from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date, datetime

# Auth Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Health Content Schemas
class HealthContentResponse(BaseModel):
    id: int
    trimester: int
    title: str
    body: str
    image_url: Optional[str] = None
    category: Optional[str] = None

    class Config:
        from_attributes = True

# Advisory Schemas
class SymptomReportCreate(BaseModel):
    symptoms: List[str]

class SymptomReportResponse(BaseModel):
    id: int
    risk_level: str
    advice: str
    created_at: datetime

    class Config:
        from_attributes = True
