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
    user_id: int = None

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
            "email": user.email,
            "trimester": user.trimester,
            "due_date": user.due_date,
            "is_first_pregnancy": user.is_first_pregnancy,
            "medical_conditions": user.medical_conditions,
            "age": user.age,
            "weight": user.weight,
            "primary_goal": user.primary_goal,
            "dietary_preferences": user.dietary_preferences,
            "emergency_contact_name": user.emergency_contact_name,
            "emergency_contact_phone": user.emergency_contact_phone
        }
    }

@app.get("/trimester/{trimester_id}")
def get_trimester_info(trimester_id: int):
    # Comprehensive, structured mock data for Trimesters
    trimester_data = {
        1: {
            "title": "First Trimester",
            "description": "Weeks 1-12. A critical time of development.",
            "babyDevelopment": "Your baby is growing rapidly. The brain, spinal cord, and other organs are forming. By week 12, the baby's heartbeat might be heard.",
            "bodyChanges": "You may experience morning sickness, severe fatigue, swollen and tender breasts, and frequent urination as your body adjusts.",
            "dosAndDonts": [
                "Do take your daily prenatal vitamins containing folic acid.",
                "Do drink plenty of water and eat small, frequent meals.",
                "Don't smoke or consume alcohol.",
                "Don't consume unpasteurized dairy or raw meats.",
                "Do book your first antenatal visit early."
            ]
        },
        2: {
            "title": "Second Trimester",
            "description": "Weeks 13-26. Often called the 'golden period' of pregnancy.",
            "babyDevelopment": "Your baby is growing larger and stronger. You will likely start feeling their first movements (quickening) between weeks 16-20. Hair and fingerprints are forming.",
            "bodyChanges": "Nausea usually subsides. You might experience backaches, stretch marks, and a noticeable 'bump'. Your energy levels should improve.",
            "dosAndDonts": [
                "Do continue taking your prenatal vitamins.",
                "Do start doing pelvic floor exercises (Kegels).",
                "Do sleep on your side, preferably your left side.",
                "Don't lie flat on your back for extended periods.",
                "Do attend your anomaly scan (around week 20)."
            ]
        },
        3: {
            "title": "Third Trimester",
            "description": "Weeks 27-end. Preparing for childbirth and meeting your baby.",
            "babyDevelopment": "Your baby is gaining weight rapidly and their lungs are maturing. They will move into a head-down position in preparation for birth.",
            "bodyChanges": "You may experience shortness of breath, heartburn, Braxton Hicks contractions, and difficulty sleeping as your bump grows very large.",
            "dosAndDonts": [
                "Do monitor your baby's movements daily.",
                "Do pack your hospital bag and finalize your birth plan.",
                "Do rest as much as possible.",
                "Don't ignore any signs of reduced baby movement or heavy bleeding.",
                "Do attend antenatal classes and frequent clinic visits."
            ]
        }
    }
    
    info = trimester_data.get(trimester_id)
    if not info:
        raise HTTPException(status_code=404, detail="Invalid trimester ID")
        
    return info

@app.post("/advisory")
def get_advisory(request: SymptomRequest, db: Session = Depends(get_db)):
    user_context = None
    if request.user_id:
        user = db.query(models.User).filter(models.User.id == request.user_id).first()
        if user:
            user_context = {
                "trimester": user.trimester,
                "due_date": user.due_date,
                "is_first_pregnancy": user.is_first_pregnancy,
                "medical_conditions": user.medical_conditions,
                "age": user.age,
                "weight": user.weight,
                "primary_goal": user.primary_goal,
                "dietary_preferences": user.dietary_preferences
            }
            
    advice = evaluate_symptoms(request.symptoms, user_context)
    return {"advice": advice}

@app.post("/users/{user_id}/logs", response_model=schemas.SymptomLogResponse)
def log_symptoms(user_id: int, log: schemas.SymptomLogCreate, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=db.query(models.User).filter(models.User.id == user_id).first().email) if db.query(models.User).filter(models.User.id == user_id).first() else None
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return crud.create_symptom_log(db=db, log=log, user_id=user_id)

@app.get("/users/{user_id}/insights")
def get_insights(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Simple insight: Count total logs
    log_count = db.query(models.SymptomLog).filter(models.SymptomLog.user_id == user_id).count()
    
    return {
        "totalLogs": log_count,
        "overallVibe": "Good" if log_count < 5 else "Needs Rest"
    }
@app.put("/users/{user_id}/onboard", response_model=schemas.UserResponse)
def onboard_user(user_id: int, data: schemas.UserOnboarding, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if data.trimester is not None:
        user.trimester = data.trimester
    if data.due_date is not None:
        user.due_date = data.due_date
    if data.is_first_pregnancy is not None:
        user.is_first_pregnancy = data.is_first_pregnancy
    if data.medical_conditions is not None:
        user.medical_conditions = data.medical_conditions
    if data.age is not None:
        user.age = data.age
    if data.weight is not None:
        user.weight = data.weight
    if data.primary_goal is not None:
        user.primary_goal = data.primary_goal
    if data.dietary_preferences is not None:
        user.dietary_preferences = data.dietary_preferences
    if data.emergency_contact_name is not None:
        user.emergency_contact_name = data.emergency_contact_name
    if data.emergency_contact_phone is not None:
        user.emergency_contact_phone = data.emergency_contact_phone
        
    db.commit()
    db.refresh(user)
    return user
