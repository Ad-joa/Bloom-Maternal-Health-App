export interface UserContext {
  trimester?: number | null;
  medical_conditions?: string | null;
  age?: number | null;
}

export interface AdvisoryResult {
  text: string;
  severity: 'danger' | 'normal' | 'unknown';
}

export function evaluateSymptoms(symptoms: string[], userContext?: UserContext | null): AdvisoryResult {
  const symptomsLower = symptoms.map(s => s.toLowerCase());

  // Personalization Logic
  let personalPrefix = "";
  if (userContext) {
    const { trimester, medical_conditions: conditions, age } = userContext;
    
    if (trimester) {
      personalPrefix += `[Context: Trimester ${trimester}] `;
    }
    if (conditions && conditions.toLowerCase() !== "none") {
      personalPrefix += `Given your medical history of ${conditions}, please be extra cautious. `;
    }
    if (age && age > 35) {
      personalPrefix += "As a mother over 35, we strongly recommend consulting a doctor for new symptoms. ";
    }
  }

  // Danger signs requiring immediate medical attention
  const dangerSigns = [
    "severe bleeding", "heavy bleeding", "vaginal bleeding", "spotting",
    "severe headache", "blurry vision", "convulsions", "fits",
    "fever", "severe abdominal pain", "cramping", "reduced baby movement",
    "water breaking early", "difficulty breathing", "chest pain"
  ];

  // Common mild symptoms
  const mildSymptoms = [
    "nausea", "morning sickness", "fatigue", "mild backache", "back pain",
    "swollen feet", "swelling", "heartburn", "frequent urination",
    "mild cramping", "headache", "dizziness"
  ];

  const hasDanger = symptomsLower.some(symptom => dangerSigns.some(danger => symptom.includes(danger)));
  const hasMild = symptomsLower.some(symptom => mildSymptoms.some(mild => symptom.includes(mild)));

  if (hasDanger) {
    return {
      text: personalPrefix + "DANGER SIGN DETECTED: Your symptoms indicate a potentially serious condition. Please visit the nearest healthcare facility or contact your healthcare provider IMMEDIATELY.",
      severity: 'danger'
    };
  }

  if (hasMild) {
    return {
      text: personalPrefix + "Your symptoms are common during pregnancy. Make sure to rest, stay hydrated, and mention them to your doctor during your next antenatal visit. However, if they worsen, please seek medical attention.",
      severity: 'normal'
    };
  }

  if (!symptoms || symptoms.length === 0) {
    return {
      text: "No symptoms provided. If you have concerns, please describe what you are feeling.",
      severity: 'unknown'
    };
  }

  return {
    text: personalPrefix + "We could not classify your symptoms with our basic logic. When in doubt, it is always safest to consult with your healthcare provider or visit a clinic.",
    severity: 'unknown'
  };
}
