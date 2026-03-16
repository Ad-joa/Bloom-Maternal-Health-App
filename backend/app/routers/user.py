from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database import get_db
from app.models.health import AntenatalVisit
from app.models.user import User
from app.services.deps import get_current_user
from datetime import datetime

router = APIRouter(tags=["user"])

@router.get("/visits")
async def get_visits(
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(AntenatalVisit).filter(AntenatalVisit.user_id == current_user.id))
    return result.scalars().all()

@router.post("/visits")
async def create_visit(
    visit_date: datetime,
    next_visit_date: datetime,
    notes: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_visit = AntenatalVisit(
        user_id=current_user.id,
        visit_date=visit_date,
        next_visit_date=next_visit_date,
        notes=notes
    )
    db.add(db_visit)
    await db.commit()
    await db.refresh(db_visit)
    return db_visit

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "created_at": current_user.created_at
    }
