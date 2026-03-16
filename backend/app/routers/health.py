from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.models.health import SymptomLog, HealthContent
from app.schemas import SymptomReportCreate, SymptomReportResponse, HealthContentResponse
from app.services.advisory import advisory_engine

router = APIRouter(tags=["health"])

@router.post("/advisory/check", response_model=SymptomReportResponse)
async def check_symptoms(report: SymptomReportCreate, db: AsyncSession = Depends(get_db)):
    result = advisory_engine.evaluate(report.symptoms)
    
    db_log = SymptomLog(
        symptoms=report.symptoms,
        advisory_result=result["advice"],
        risk_level=result["risk_level"]
    )
    db.add(db_log)
    await db.commit()
    await db.refresh(db_log)
    
    return {
        "id": db_log.id,
        "risk_level": db_log.risk_level,
        "advice": db_log.advisory_result,
        "created_at": db_log.created_at
    }

@router.get("/content", response_model=List[HealthContentResponse])
async def get_content(trimester: int = Query(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(HealthContent).filter(HealthContent.trimester == trimester))
    return result.scalars().all()
