"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPartnerSummary = exports.getAdvisoryResponse = exports.ai = void 0;
const genai_1 = require("@google/genai");
const prisma_1 = __importDefault(require("../lib/prisma"));
const symptomService_1 = require("./symptomService");
// Initialize Gemini Client
exports.ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY' });
const getAdvisoryResponse = async (user_id, symptoms) => {
    let context = null;
    let userDetails = "";
    const userPrompt = Array.isArray(symptoms) ? symptoms.join(', ') : symptoms;
    if (user_id) {
        const user = await prisma_1.default.users.findUnique({ where: { id: user_id } });
        if (user) {
            context = {
                trimester: user.trimester,
                medical_conditions: user.medical_conditions,
                age: user.age
            };
            userDetails = `
        The user's name is ${user.name || 'Mama'}.
        She is currently in Trimester ${user.trimester || 'Unknown'}.
        Her primary goal is: ${user.primary_goal || 'Healthy Pregnancy'}.
        Medical conditions/history: ${user.medical_conditions || 'None'}.
        Age: ${user.age || 'Unknown'}.
      `;
        }
        const recentLogs = await prisma_1.default.symptom_logs.findMany({
            where: { user_id: user_id },
            orderBy: { created_at: 'desc' },
            take: 5
        });
        if (recentLogs && recentLogs.length > 0) {
            userDetails += `\nHere is a summary of her recent daily logs (most recent first):\n`;
            recentLogs.forEach((log) => {
                const date = log.created_at ? new Date(log.created_at).toLocaleDateString() : 'Unknown Date';
                userDetails += `- Date: ${date}, Symptoms: ${log.symptoms || 'None'}, Severity: ${log.severity || 'N/A'}, Blood Pressure: ${log.blood_pressure || 'N/A'}, Weight: ${log.weight ? log.weight + 'kg' : 'N/A'}\n`;
            });
        }
        else {
            userDetails += `\nNo recent logs found.`;
        }
        // Save user message to history
        await prisma_1.default.bloom_ai_chats.create({
            data: { user_id, text: userPrompt, sender: 'user' }
        });
    }
    // Safety First: Use the local rules engine to detect critical danger signs immediately
    const rulesResult = (0, symptomService_1.evaluateSymptoms)(symptoms, context);
    if (rulesResult.severity === 'danger') {
        return rulesResult.text; // Return immediately, do not wait for AI
    }
    // No danger detected. Ask Gemini for an empathetic, personalized response.
    const systemInstruction = `
    You are Bloom AI, a warm and concise maternal health companion for a pregnant mother.
    
    Her profile:
    ${userDetails}
    
    STRICT RULES:
    1. BREVITY IS MANDATORY: Respond in 2-3 sentences MAX. Never exceed 4 sentences. No long paragraphs.
    2. BE PRECISE AND INSIGHTFUL: Give one clear, actionable insight or reassurance. No filler words, no generic advice.
    3. CONTEXT-AWARE: Reference her trimester, recent logs, or conditions naturally — don't just list facts.
    4. PLAIN TEXT ONLY: No asterisks (*), no hashtags (#), no bold, no markdown. Use dashes (-) for short lists if needed.
    5. HUMAN TONE: Be warm and caring but brief — like a knowledgeable friend texting, not a textbook.
    6. End with a one-line doctor reminder ONLY if the topic is medical. Skip it for casual questions.
  `;
    try {
        const response = await exports.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                maxOutputTokens: 300,
            }
        });
        const advice = response.text || rulesResult.text;
        if (user_id && advice) {
            await prisma_1.default.bloom_ai_chats.create({
                data: { user_id, text: advice, sender: 'ai' }
            });
        }
        return advice;
    }
    catch (aiError) {
        console.error("Gemini API Error:", aiError);
        // Fallback to rules engine if AI fails or key is missing
        const advice = rulesResult.text;
        if (user_id) {
            await prisma_1.default.bloom_ai_chats.create({
                data: { user_id, text: advice, sender: 'ai' }
            });
        }
        return advice;
    }
};
exports.getAdvisoryResponse = getAdvisoryResponse;
const getPartnerSummary = async (user_id) => {
    const user = await prisma_1.default.users.findUnique({ where: { id: user_id } });
    if (!user)
        throw new Error("User not found");
    const recentLogs = await prisma_1.default.symptom_logs.findMany({
        where: { user_id },
        orderBy: { created_at: 'desc' },
        take: 5
    });
    const recentSymptoms = recentLogs.map(log => log.symptoms).filter(Boolean).join(', ');
    const fallbackResponse = {
        vibe: "She is doing okay, but experiencing some standard pregnancy symptoms.",
        emoji: "🙂",
        tags: ["Okay", "Resting"],
        support_actions: ["Make sure she is drinking plenty of water.", "Offer a gentle back massage.", "Remind her to rest."]
    };
    if (!recentSymptoms) {
        return fallbackResponse;
    }
    const systemInstruction = `
    You are an AI generating a dashboard for a pregnant woman's partner.
    Her name is ${user.name || 'Mama'}. 
    Recent symptoms she logged: ${recentSymptoms}.
    
    Generate a JSON response EXACTLY matching this structure, with no markdown formatting:
    {
      "vibe": "A one sentence empathetic summary of how she is feeling today.",
      "emoji": "A single emoji representing her vibe (e.g. 😴, 🤢, 🙂, 😖)",
      "tags": ["1-2 word tag", "1-2 word tag"],
      "support_actions": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"]
    }
    Make the support actions highly specific to her symptoms.
  `;
    try {
        const response = await exports.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate partner summary JSON",
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        vibe: { type: "STRING", description: "A one sentence empathetic summary of how she is feeling today." },
                        emoji: { type: "STRING", description: "A single emoji representing her vibe (e.g. 😴, 🤢, 🙂, 😖)" },
                        tags: { type: "ARRAY", items: { type: "STRING" }, description: "1-2 word tags" },
                        support_actions: { type: "ARRAY", items: { type: "STRING" }, description: "Actionable tips" }
                    },
                    required: ["vibe", "emoji", "tags", "support_actions"]
                }
            }
        });
        let parsed = JSON.parse(response.text || '{}');
        if (!parsed.vibe || !parsed.support_actions) {
            parsed = fallbackResponse;
        }
        return parsed;
    }
    catch (aiError) {
        console.error("Gemini API Error:", aiError);
        return fallbackResponse;
    }
};
exports.getPartnerSummary = getPartnerSummary;
//# sourceMappingURL=aiService.js.map