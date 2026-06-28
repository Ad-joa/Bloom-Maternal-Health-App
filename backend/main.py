from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

import models
import schemas
import crud
from database import engine, get_db
from engine.rules import evaluate_symptoms

# Create all tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Maternal Health Advisory API")

class SymptomRequest(BaseModel):
    symptoms: List[str]

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Maternal Health Advisory API"}

@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=request.email)
    if not user or not crud.verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    return {
        "message": "Login successful", 
        "user": {
            "id": user.id, 
            "name": user.name, 
            "email": user.email
        }
    }

@app.get("/trimester/{trimester_id}")
def get_trimester_info(trimester_id: int):
    # Dummy data, will be expanded later
    info = {
        1: {"title": "First Trimester", "description": "Weeks 1-12. Focus on folic acid and booking your first antenatal visit."},
        2: {"title": "Second Trimester", "description": "Weeks 13-26. Usually the most comfortable. Start feeling baby move."},
        3: {"title": "Third Trimester", "description": "Weeks 27-end. Prepare for birth. Monitor baby's movements closely."}
    }
    return info.get(trimester_id, {"error": "Invalid trimester ID"})

@app.post("/advisory")
def get_advisory(request: SymptomRequest):
    advice = evaluate_symptoms(request.symptoms)
    return {"advice": advice}
