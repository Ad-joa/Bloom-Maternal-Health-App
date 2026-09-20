import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/authMiddleware';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation schema for saving a symptom log
const logSchema = z.object({
  body: z.object({
    symptoms: z.string().optional(),
    severity: z.string().optional(),
    notes: z.string().optional(),
    blood_pressure: z.string().optional(),
    weight: z.union([z.string(), z.number()]).optional()
  })
});

// GET /logs - Fetch recent logs for the authenticated user
router.get('/', authenticateToken, async (req: any, res: any, next: any) => {
  try {
    const userId = req.user.userId;
    
    // Fetch last 10 symptom logs
    const logs = await prisma.symptom_logs.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 10
    });
    
    res.json(logs);
  } catch (error) {
    next(error);
  }
});

import { evaluateRules } from '../services/symptomService';
// POST /logs - Create a new log for the authenticated user
router.post('/', authenticateToken, validate(logSchema), async (req: any, res: any, next: any) => {
  try {
    const userId = req.user.userId;
    const { symptoms, severity, notes, blood_pressure, weight } = req.body;
    
    // Use an Interactive Transaction to save log & evaluate alerts atomically
    const resultLog = await prisma.$transaction(async (tx: any) => {
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
      const triggeredRules = evaluateRules(newLog, activeRules);

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
  } catch (error) {
    next(error);
  }
});

// POST /sync/symptoms - Sync offline logs
router.post('/sync', async (req: any, res: any, next: any) => {
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

    await prisma.symptom_logs.createMany({
      data: mappedLogs,
      skipDuplicates: true
    });

    res.json({ success: true, count: mappedLogs.length });
  } catch (error) {
    console.error('Sync Error:', error);
    res.status(500).json({ success: false, detail: "Server error during sync" });
  }
});

export default router;
