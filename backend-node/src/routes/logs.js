"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const zod_1 = require("zod");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
// Validation schema for saving a symptom log
const logSchema = zod_1.z.object({
    body: zod_1.z.object({
        symptoms: zod_1.z.string().optional(),
        severity: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
        blood_pressure: zod_1.z.string().optional(),
        weight: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional()
    })
});
// GET /logs - Fetch recent logs for the authenticated user
router.get('/', authMiddleware_1.authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        // Fetch last 10 symptom logs
        const logs = await prisma_1.default.symptom_logs.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
            take: 10
        });
        res.json(logs);
    }
    catch (error) {
        next(error);
    }
});
const symptomService_1 = require("../services/symptomService");
// POST /logs - Create a new log for the authenticated user
router.post('/', authMiddleware_1.authenticateToken, (0, validate_1.validate)(logSchema), async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { symptoms, severity, notes, blood_pressure, weight } = req.body;
        // Use an Interactive Transaction to save log & evaluate alerts atomically
        const resultLog = await prisma_1.default.$transaction(async (tx) => {
            // 1. Create the symptom log
            const newLog = await tx.symptom_logs.create({
                data: {
                    user_id: userId,
                    symptoms: symptoms || '',
                    severity: severity || 'unknown',
                    notes: notes || '',
                    blood_pressure: blood_pressure || null,
                    weight: weight ? parseFloat(weight) : null,
                }
            });
            // 2. Fetch active advisory rules
            const activeRules = await tx.advisory_rules.findMany({
                where: { is_active: true }
            });
            // 3. Evaluate rules against the new log
            const triggeredRules = (0, symptomService_1.evaluateRules)(newLog, activeRules);
            // 4. Create health alerts if any rules triggered
            for (const rule of triggeredRules) {
                await tx.health_alerts.create({
                    data: {
                        user_id: userId,
                        symptom_log_id: newLog.id,
                        alert_message: rule.alert_message,
                        risk_level: rule.risk_level
                    }
                });
            }
            return { log: newLog, alerts: triggeredRules };
        });
        res.status(201).json(resultLog);
    }
    catch (error) {
        next(error);
    }
});
// POST /sync/symptoms - Sync offline logs
router.post('/sync', async (req, res, next) => {
    try {
        const { logs } = req.body;
        if (!logs || !Array.isArray(logs)) {
            return res.status(400).json({ success: false, detail: "Invalid logs payload" });
        }
        const mappedLogs = logs.map(log => ({
            user_id: parseInt(log.user_id),
            symptoms: log.symptoms,
            severity: log.severity || 'unknown',
            notes: log.notes || '',
            blood_pressure: log.blood_pressure || null,
            weight: log.weight ? parseFloat(log.weight) : null,
            created_at: new Date(log.created_at)
        }));
        await prisma_1.default.symptom_logs.createMany({
            data: mappedLogs,
            skipDuplicates: true
        });
        res.json({ success: true, count: mappedLogs.length });
    }
    catch (error) {
        console.error('Sync Error:', error);
        res.status(500).json({ success: false, detail: "Server error during sync" });
    }
});
exports.default = router;
//# sourceMappingURL=logs.js.map