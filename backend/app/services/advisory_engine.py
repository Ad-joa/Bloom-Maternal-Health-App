from typing import List, Dict

class AdvisoryEngine:
    """
    Rule-based expert system for maternal health symptoms.
    Classifies symptoms into High, Mid, or Low risk based on medical guidelines.
    """
    
    # Danger signs requiring immediate facility visits (High Risk)
    DANGER_SIGNS = [
        "vaginal bleeding",
        "severe headache",
        "blurry vision",
        "severe abdominal pain",
        "convulsions",
        "high fever",
        "reduced fetal movement",
        "swelling of hands/face"
    ]

    # Less urgent but concerning symptoms (Mid Risk)
    CONCERNING_SYMPTOMS = [
        "moderate back pain",
        "mild nausea",
        "persistent constipation",
        "mild dizziness",
        "unusual discharge"
    ]

    def evaluate_symptoms(self, reported_symptoms: List[str]) -> Dict:
        """
        Evaluates a list of reported symptoms and returns a risk level and advice.
        """
        # Case insensitive matching
        reported = [s.lower().strip() for s in reported_symptoms]
        
        # Check for High Risk signs first
        found_danger = [s for s in reported if s in self.DANGER_SIGNS]
        if found_danger:
            return {
                "risk_level": "High",
                "advice": "URGENT: Please proceed to the nearest healthcare facility immediately. These symptoms indicate potential serious complications.",
                "triggered_signs": found_danger
            }

        # Check for Mid Risk signs
        found_concerning = [s for s in reported if s in self.CONCERNING_SYMPTOMS]
        if found_concerning:
            return {
                "risk_level": "Mid",
                "advice": "Please schedule a consultation with your midwife or healthcare provider soon. While not immediate emergencies, these symptoms need professional evaluation.",
                "triggered_signs": found_concerning
            }

        # Default to Low Risk
        return {
            "risk_level": "Low",
            "advice": "Your symptoms seem normal for your current trimester. Ensure you rest, stay hydrated, and continue monitoring your health. Contact your provider if symptoms worsen.",
            "triggered_signs": []
        }

# Singleton instance
engine = AdvisoryEngine()
