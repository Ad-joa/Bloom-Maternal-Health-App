from typing import List

# Simple rule-based logic for maternal health symptoms
# In a real-world scenario, this should be reviewed by medical professionals.

def evaluate_symptoms(symptoms: List[str]) -> str:
    symptoms_lower = [s.lower() for s in symptoms]
    
    # Danger signs
    danger_signs = [
        "severe bleeding",
        "vaginal bleeding",
        "severe headache",
        "blurry vision",
        "convulsions",
        "fits",
        "fever",
        "severe abdominal pain",
        "reduced baby movement",
        "water breaking early"
    ]
    
    # Common mild symptoms
    mild_symptoms = [
        "nausea",
        "morning sickness",
        "fatigue",
        "mild backache",
        "swollen feet",
        "heartburn",
        "frequent urination"
    ]
    
    has_danger = any(danger in s for danger in danger_signs for s in symptoms_lower)
    has_mild = any(mild in s for mild in mild_symptoms for s in symptoms_lower)
    
    if has_danger:
        return (
            "DANGER SIGN DETECTED: Your symptoms indicate a potentially serious condition. "
            "Please visit the nearest healthcare facility or contact your healthcare provider IMMEDIATELY."
        )
    
    if has_mild:
        return (
            "Your symptoms are common during pregnancy. Make sure to rest, stay hydrated, "
            "and mention them to your doctor during your next antenatal visit. "
            "However, if they worsen, please seek medical attention."
        )
        
    if not symptoms:
        return "No symptoms provided. If you have concerns, please describe what you are feeling."
        
    return (
        "We could not classify your symptoms with our basic logic. "
        "When in doubt, it is always safest to consult with your healthcare provider or visit a clinic."
    )
