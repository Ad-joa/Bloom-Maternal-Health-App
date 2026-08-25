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
    const logs = await (prisma as any).symptom_logs.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 10
    });
    
    res.json(logs);
  } catch (error) {
    next(error);
  }
});

// Helper to evaluate basic rules
const evaluateRules = (logData: any, rules: any[]) => {
  const triggeredAlerts = [];
  const bpSys = logData.blood_pressure ? parseInt(logData.blood_pressure.split('/')[0]) : 0;
  const bpDia = logData.blood_pressure ? parseInt(logData.blood_pressure.split('/')[1]) : 0;
  
  for (const rule of rules) {
    let isTriggered = false;
    const cond = rule.condition.toLowerCase();
    
    if (cond.includes('severity') && cond.includes('severe') && logData.severity.toLowerCase() === 'severe') {
      isTriggered = true;
    }
    if (cond.includes('blood_pressure') && cond.includes('> 140') && bpSys > 140) isTriggered = true;
    if (cond.includes('blood_pressure') && cond.includes('> 90') && bpDia > 90) isTriggered = true;
    if (cond.includes('symptoms') && cond.includes('headache') && logData.symptoms.toLowerCase().includes('headache')) isTriggered = true;
    if (cond.includes('symptoms') && cond.includes('bleeding') && logData.symptoms.toLowerCase().includes('bleeding')) isTriggered = true;

    if (isTriggered) triggeredAlerts.push(rule);
  }
  return triggeredAlerts;
};

// POST /logs - Create a new log for the authenticated user
router.post('/', authenticateToken, validate(logSchema), async (req: any, res: any, next: any) => {
  try {
    const userId = req.user.userId;
    const { symptoms, severity, notes, blood_pressure, weight } = req.body;
    
    // Use an Interactive Transaction to save log & evaluate alerts atomically
    const resultLog = await (prisma as any).$transaction(async (tx: any) => {
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

export default router;
