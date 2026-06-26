from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from engine.rules import evaluate_symptoms

app = FastAPI(title="Smart Maternal Health Advisory API")

class SymptomRequest(BaseModel):
    symptoms: List[str]

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Maternal Health Advisory API"}

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
