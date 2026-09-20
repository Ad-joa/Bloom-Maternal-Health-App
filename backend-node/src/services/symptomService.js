"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateRules = void 0;
exports.evaluateSymptoms = evaluateSymptoms;
function evaluateSymptoms(symptoms, userContext) {
    const symptomsLower = symptoms.map(s => s.toLowerCase());
    // Personalization Logic
    let personalPrefix = "";
    if (userContext) {
        const { trimester, medical_conditions: conditions, age } = userContext;
        if (trimester) {
            personalPrefix += `Being in your ${trimester === 1 ? 'first' : trimester === 2 ? 'second' : 'third'} trimester, `;
        }
        if (conditions && conditions.toLowerCase() !== "none") {
            personalPrefix += `given your history of ${conditions}, please be extra cautious. `;
        }
        if (age && age > 35) {
            personalPrefix += "As a mother over 35, we strongly recommend consulting a doctor for new symptoms. ";
        }
    }
    // Danger signs requiring immediate medical attention
    const dangerSigns = [
        "severe bleeding", "heavy bleeding", "vaginal bleeding", "spotting",
        "convulsions", "fits", "fever", "severe abdominal pain", "cramping", "reduced baby movement",
        "water breaking early", "difficulty breathing", "chest pain"
    ];
    // Pre-Eclampsia specific red flags
    const preEclampsiaSigns = [
        "severe headache", "blurry vision", "high blood pressure", "high bp", "severe swelling"
    ];
    // Common mild symptoms
    const mildSymptoms = [
        "nausea", "morning sickness", "fatigue", "mild backache", "back pain",
        "swollen feet", "swelling", "heartburn", "frequent urination",
        "mild cramping", "headache", "dizziness"
    ];
    const hasDanger = symptomsLower.some(symptom => dangerSigns.some(danger => symptom.includes(danger)));
    const hasPreEclampsia = symptomsLower.some(symptom => preEclampsiaSigns.some(danger => symptom.includes(danger)));
    const hasMild = symptomsLower.some(symptom => mildSymptoms.some(mild => symptom.includes(mild)));
    if (hasPreEclampsia) {
        return {
            text: personalPrefix + "🚨 RED FLAG DETECTED (Pre-Eclampsia Risk): Your symptoms (severe headache, blurred vision, or high BP) are highly dangerous. Please go to the nearest CHPS compound or Hospital IMMEDIATELY.",
            severity: 'danger'
        };
    }
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
// Database-driven rules evaluation (used by logs route)
const evaluateRules = (logData, rules) => {
    const triggeredAlerts = [];
    const bpSys = logData.blood_pressure ? parseInt(logData.blood_pressure.split('/')[0]) : 0;
    const bpDia = logData.blood_pressure ? parseInt(logData.blood_pressure.split('/')[1]) : 0;
    for (const rule of rules) {
        let isTriggered = false;
        const cond = rule.condition.toLowerCase();
        if (cond.includes('severity') && cond.includes('severe') && logData.severity.toLowerCase() === 'severe') {
            isTriggered = true;
        }
        if (cond.includes('blood_pressure') && cond.includes('> 140') && bpSys > 140)
            isTriggered = true;
        if (cond.includes('blood_pressure') && cond.includes('> 90') && bpDia > 90)
            isTriggered = true;
        if (cond.includes('symptoms') && cond.includes('headache') && logData.symptoms.toLowerCase().includes('headache'))
            isTriggered = true;
        if (cond.includes('symptoms') && cond.includes('bleeding') && logData.symptoms.toLowerCase().includes('bleeding'))
            isTriggered = true;
        if (isTriggered)
            triggeredAlerts.push(rule);
    }
    return triggeredAlerts;
};
exports.evaluateRules = evaluateRules;
//# sourceMappingURL=symptomService.js.map