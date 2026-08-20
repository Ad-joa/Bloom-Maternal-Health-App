import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ detail: "Token missing" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ detail: "Token invalid or expired" });
    req.user = user;
    next();
  });
};

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
