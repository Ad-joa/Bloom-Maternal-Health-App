import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();

// GET /logs - Fetch recent logs for the authenticated user
router.get('/', authenticateToken, async (req: any, res: any) => {
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
    console.error("Error fetching logs:", error);
    res.status(500).json({ detail: "Server error fetching logs" });
  }
});

// POST /logs - Create a new log for the authenticated user
router.post('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const { symptoms, severity, notes, blood_pressure, weight, fetal_kicks } = req.body;
    
    const newLog = await prisma.symptom_logs.create({
      data: {
        user_id: userId,
        symptoms: symptoms || '',
        severity: severity || 'unknown',
        notes: notes || '',
        blood_pressure: blood_pressure || null,
        weight: weight ? parseFloat(weight) : null,
        fetal_kicks: fetal_kicks ? parseInt(fetal_kicks) : null,
      }
    });
    
    res.status(201).json(newLog);
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({ detail: "Server error creating log" });
  }
});

export default router;
