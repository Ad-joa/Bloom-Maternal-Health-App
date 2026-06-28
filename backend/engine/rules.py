from typing import List

# Simple rule-based logic for maternal health symptoms
# In a real-world scenario, this should be reviewed by medical professionals.

def evaluate_symptoms(symptoms: List[str], user_context: dict = None) -> dict:
    symptoms_lower = [s.lower() for s in symptoms]
    
    # Personalization Logic
    personal_prefix = ""
    if user_context:
        trimester = user_context.get("trimester")
        conditions = user_context.get("medical_conditions")
        age = user_context.get("age")
        
        if trimester:
            personal_prefix += f"[Context: Trimester {trimester}] "
        if conditions and conditions.lower() != "none":
            personal_prefix += f"Given your medical history of {conditions}, please be extra cautious. "
        if age and age > 35:
            personal_prefix += "As a mother over 35, we strongly recommend consulting a doctor for new symptoms. "
            
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
            "text": personal_prefix + "DANGER SIGN DETECTED: Your symptoms indicate a potentially serious condition. Please visit the nearest healthcare facility or contact your healthcare provider IMMEDIATELY.",
            "severity": "danger"
        }
    
    if has_mild:
        return {
            "text": personal_prefix + "Your symptoms are common during pregnancy. Make sure to rest, stay hydrated, and mention them to your doctor during your next antenatal visit. However, if they worsen, please seek medical attention.",
            "severity": "normal"
        }
        
    if not symptoms:
        return {
            "text": "No symptoms provided. If you have concerns, please describe what you are feeling.",
            "severity": "unknown"
        }
        
    return {
        "text": personal_prefix + "We could not classify your symptoms with our basic logic. When in doubt, it is always safest to consult with your healthcare provider or visit a clinic.",
        "severity": "unknown"
    }
