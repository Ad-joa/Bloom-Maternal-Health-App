from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.base import get_db
from app.models.health import SymptomReport, HealthContent
from app.schemas import SymptomReportCreate, SymptomReportResponse, HealthContentResponse
from app.services.advisory_engine import engine

router = APIRouter()

@router.post("/advisory", response_model=SymptomReportResponse)
def get_advisory(report: SymptomReportCreate, db: Session = Depends(get_db)):
    # Run the rule engine
    result = engine.evaluate_symptoms(report.symptoms)
    
    # Save to database (optional for demo, but good for FYP)
    db_report = SymptomReport(
        symptoms=report.symptoms,
        risk_level=result["risk_level"],
        advice_given=result["advice"]
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    return SymptomReportResponse(
        id=db_report.id,
        risk_level=db_report.risk_level,
        advice=db_report.advice_given,
        created_at=db_report.created_at
    )

@router.get("/content/{trimester}", response_model=List[HealthContentResponse])
def get_trimester_content(trimester: int, db: Session = Depends(get_db)):
    content = db.query(HealthContent).filter(HealthContent.trimester == trimester).all()
    return content
