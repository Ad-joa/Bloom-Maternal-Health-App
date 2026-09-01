"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// GET /users/:id
router.get('/:id', userController_1.getUser);
// PUT /users/:id
router.put('/:id', authMiddleware_1.authenticateToken, userController_1.updateUser);
// PUT /users/:user_id/onboard
router.put('/:user_id/onboard', authMiddleware_1.authenticateToken, userController_1.onboardUser);
// GET /users/:user_id/insights
router.get('/:user_id/insights', authMiddleware_1.authenticateToken, userController_1.getUserInsights);
// GET /users/:user_id/partner-summary
router.get('/:user_id/partner-summary', authMiddleware_1.authenticateToken, userController_1.fetchPartnerSummary);
const prisma_1 = __importDefault(require("../lib/prisma"));
// --- Reminders ---
router.get('/:id/reminders', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const reminders = await prisma_1.default.reminders.findMany({ where: { user_id: userId } });
        res.json(reminders);
    }
    catch (e) {
        res.status(500).json({ error: "Failed to fetch reminders" });
    }
});
router.post('/:id/reminders', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { title, type, time } = req.body;
        const reminder = await prisma_1.default.reminders.create({
            data: { user_id: userId, title, type, time }
        });
        res.json(reminder);
    }
    catch (e) {
        res.status(500).json({ error: "Failed to create reminder" });
    }
});
router.delete('/:id/reminders/:reminder_id', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const reminderId = parseInt(req.params.reminder_id);
        if (!isNaN(reminderId)) {
            await prisma_1.default.reminders.delete({ where: { id: reminderId } });
        }
        res.json({ success: true });
    }
    catch (e) {
        if (e.code === 'P2025') {
            return res.json({ success: true });
        }
        console.error("Delete reminder error:", e);
        res.status(500).json({ error: "Failed to delete reminder" });
    }
});
// --- Partner Mode ---
router.post('/:id/partner/link', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { code } = req.body;
        const partner = await prisma_1.default.users.findUnique({ where: { partner_code: code } });
        if (!partner)
            return res.status(404).json({ error: "Invalid partner code" });
        if (partner.id === userId)
            return res.status(400).json({ error: "Cannot link to yourself" });
        await prisma_1.default.users.update({ where: { id: userId }, data: { linked_user_id: partner.id } });
        await prisma_1.default.users.update({ where: { id: partner.id }, data: { linked_user_id: userId } });
        res.json({ success: true, partnerName: partner.name });
    }
    catch (e) {
        res.status(500).json({ error: "Failed to link partner" });
    }
});
router.get('/:id/partner/dashboard', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await prisma_1.default.users.findUnique({ where: { id: userId } });
        if (!user || !user.linked_user_id)
            return res.status(404).json({ error: "No partner linked" });
        const partnerData = await prisma_1.default.users.findUnique({
            where: { id: user.linked_user_id },
            include: {
                symptom_logs: { take: 5, orderBy: { created_at: 'desc' } },
                anc_visits: { where: { status: 'scheduled' }, orderBy: { created_at: 'asc' } }
            }
        });
        res.json(partnerData);
    }
    catch (e) {
        res.status(500).json({ error: "Failed to fetch partner dashboard" });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map