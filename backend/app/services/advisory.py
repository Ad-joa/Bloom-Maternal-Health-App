from typing import List, Dict

class AdvisoryEngine:
    """
    Enhanced Rule-based expert system for BLOOM.
    Includes specific logic for serious conditions like Pre-eclampsia.
    """
    
    HIGH_RISK_COMBINATIONS = [
        ({"severe headache", "visual disturbance"}, "Potential Pre-eclampsia: Please see a doctor immediately."),
        ({"high fever", "abdominal pain"}, "Potential Infection: Urgent clinical assessment required."),
        ({"vaginal bleeding"}, "Critical: Immediate hospital visit required.")
    ]

    DANGER_SIGNS = {
        "vaginal bleeding": "Immediate clinical attention required.",
        "severe headache": "Could indicate high blood pressure.",
        "visual disturbance": "Often associated with pre-eclampsia.",
        "blurry vision": "Sign of pre-eclampsia.",
        "severe abdominal pain": "Possible placental issues.",
        "convulsions": "Immediate emergency.",
        "high fever": "Sign of serious infection.",
        "reduced fetal movement": "Urgent check required."
    }

    def evaluate(self, symptoms: List[str]) -> Dict:
        symptoms_set = {s.lower().strip() for s in symptoms}
        
        # Check for specific serious combinations
        for combo, message in self.HIGH_RISK_COMBINATIONS:
            if combo.issubset(symptoms_set):
                return {"risk_level": "high", "advice": message}
        
        # Check for individual danger signs
        found_danger = [s for s in symptoms_set if s in self.DANGER_SIGNS]
        if found_danger:
            return {
                "risk_level": "high",
                "advice": f"DANGER: {self.DANGER_SIGNS[found_danger[0]]} Proceed to a health facility now."
            }

        # Medium risk cases (non-emergency but need check)
        if len(symptoms_set) > 3 or "swelling" in symptoms_set:
            return {
                "risk_level": "medium",
                "advice": "Please consult your midwife soon for a check-up."
            }

        return {
            "risk_level": "low",
            "advice": "Continue with your routine care and rest. Report any changes."
        }

advisory_engine = AdvisoryEngine()
