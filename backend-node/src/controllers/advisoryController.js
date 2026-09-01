"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAdvisoryHistory = exports.getAdvisoryHistory = exports.getAdvisory = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const aiService_1 = require("../services/aiService");
const getAdvisory = async (req, res) => {
    try {
        const { symptoms } = req.body;
        const user_id = req.user.userId;
        const advice = await (0, aiService_1.getAdvisoryResponse)(user_id, symptoms);
        res.json({ advice });
    }
    catch (error) {
        console.error("Error in advisory:", error);
        res.status(500).json({ detail: "Server error" });
    }
};
exports.getAdvisory = getAdvisory;
const getAdvisoryHistory = async (req, res) => {
    try {
        const user_id = req.user.userId;
        if (!user_id)
            return res.status(401).json({ detail: "Unauthorized" });
        const chats = await prisma_1.default.bloom_ai_chats.findMany({
            where: { user_id },
            orderBy: { created_at: 'asc' },
        });
        res.json(chats);
    }
    catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ detail: "Server error" });
    }
};
exports.getAdvisoryHistory = getAdvisoryHistory;
const clearAdvisoryHistory = async (req, res) => {
    try {
        const user_id = req.user.userId;
        if (!user_id)
            return res.status(401).json({ detail: "Unauthorized" });
        await prisma_1.default.bloom_ai_chats.deleteMany({
            where: { user_id },
        });
        res.json({ success: true, detail: "Chat history cleared" });
    }
    catch (error) {
        console.error("Error clearing chat history:", error);
        res.status(500).json({ detail: "Server error" });
    }
};
exports.clearAdvisoryHistory = clearAdvisoryHistory;
//# sourceMappingURL=advisoryController.js.map