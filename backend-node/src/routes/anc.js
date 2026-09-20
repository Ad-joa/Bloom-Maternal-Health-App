"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// GET /anc - Fetch user's ANC visits
router.get('/', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const visits = await prisma_1.default.anc_visits.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });
        res.json(visits);
    }
    catch (error) {
        console.error("Error fetching ANC visits:", error);
        res.status(500).json({ detail: "Server error fetching ANC visits" });
    }
});
// POST /anc - Create a new ANC visit check-in
router.post('/', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { date, time, doctor, notes, status, attendance_status } = req.body;
        const newVisit = await prisma_1.default.anc_visits.create({
            data: {
                user_id: userId,
                date: date || new Date().toISOString().split('T')[0],
                time: time || '09:00',
                doctor: doctor || 'Community Clinic',
                notes: notes || '',
                status: status || 'scheduled',
                attendance_status: attendance_status || 'pending'
            }
        });
        res.status(201).json(newVisit);
    }
    catch (error) {
        console.error("Error creating ANC visit:", error);
        res.status(500).json({ detail: "Server error creating ANC visit" });
    }
});
// PUT /anc/:id - Update an ANC visit
router.put('/:id', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const visitId = parseInt(req.params.id);
        const { attendance_status, status } = req.body;
        // Ensure the visit belongs to the user
        const visit = await prisma_1.default.anc_visits.findFirst({
            where: { id: visitId, user_id: userId }
        });
        if (!visit)
            return res.status(404).json({ detail: "Visit not found" });
        const updatedVisit = await prisma_1.default.anc_visits.update({
            where: { id: visitId },
            data: {
                attendance_status: attendance_status || visit.attendance_status,
                status: status || visit.status
            }
        });
        res.json(updatedVisit);
    }
    catch (error) {
        console.error("Error updating ANC visit:", error);
        res.status(500).json({ detail: "Server error updating ANC visit" });
    }
});
// DELETE /anc/:id - Delete an ANC visit
router.delete('/:id', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const visitId = parseInt(req.params.id);
        // Ensure the visit belongs to the user
        const visit = await prisma_1.default.anc_visits.findFirst({
            where: { id: visitId, user_id: userId }
        });
        if (!visit)
            return res.status(404).json({ detail: "Visit not found" });
        await prisma_1.default.anc_visits.delete({
            where: { id: visitId }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error deleting ANC visit:", error);
        res.status(500).json({ detail: "Server error deleting ANC visit" });
    }
});
exports.default = router;
//# sourceMappingURL=anc.js.map