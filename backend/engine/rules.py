from typing import List

# Simple rule-based logic for maternal health symptoms
# In a real-world scenario, this should be reviewed by medical professionals.

def evaluate_symptoms(symptoms: List[str]) -> dict:
    symptoms_lower = [s.lower() for s in symptoms]
    
    # Danger signs requiring immediate medical attention
    danger_signs = [
        "severe bleeding", "heavy bleeding", "vaginal bleeding", "spotting",
        "severe headache", "blurry vision", "convulsions", "fits",
        "fever", "severe abdominal pain", "cramping", "reduced baby movement",
        "water breaking early", "difficulty breathing", "chest pain"
    ]
    
    # Common mild symptoms
    mild_symptoms = [
        "nausea", "morning sickness", "fatigue", "mild backache", "back pain",
        "swollen feet", "swelling", "heartburn", "frequent urination",
        "mild cramping", "headache", "dizziness"
    ]
    
    has_danger = any(danger in s for danger in danger_signs for s in symptoms_lower)
    has_mild = any(mild in s for mild in mild_symptoms for s in symptoms_lower)
    
    if has_danger:
        return {
            "text": "DANGER SIGN DETECTED: Your symptoms indicate a potentially serious condition. Please visit the nearest healthcare facility or contact your healthcare provider IMMEDIATELY.",
            "severity": "danger"
        }
    
    if has_mild:
        return {
            "text": "Your symptoms are common during pregnancy. Make sure to rest, stay hydrated, and mention them to your doctor during your next antenatal visit. However, if they worsen, please seek medical attention.",
            "severity": "normal"
        }
        
    if not symptoms:
        return {
            "text": "No symptoms provided. If you have concerns, please describe what you are feeling.",
            "severity": "unknown"
        }
        
    return {
        "text": "We could not classify your symptoms with our basic logic. When in doubt, it is always safest to consult with your healthcare provider or visit a clinic.",
        "severity": "unknown"
    }
