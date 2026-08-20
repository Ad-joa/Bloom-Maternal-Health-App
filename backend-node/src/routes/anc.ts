import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();

// GET /anc - Fetch user's ANC visits
router.get('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const visits = await prisma.anc_visits.findMany({
      where: { user_id: userId },
      orderBy: { scheduled_date: 'asc' }
    });
    res.json(visits);
  } catch (error) {
    console.error("Error fetching ANC visits:", error);
    res.status(500).json({ detail: "Server error fetching ANC visits" });
  }
});

// POST /anc - Create a new ANC visit check-in
router.post('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const { clinic_name, scheduled_date, attended, notes } = req.body;
    
    const newVisit = await prisma.anc_visits.create({
      data: {
        user_id: userId,
        clinic_name: clinic_name || 'Community Clinic',
        scheduled_date: scheduled_date ? new Date(scheduled_date) : new Date(),
        status: attended ? 'completed' : 'scheduled',
        notes: notes || '',
      }
    });
    
    res.status(201).json(newVisit);
  } catch (error) {
    console.error("Error creating ANC visit:", error);
    res.status(500).json({ detail: "Server error creating ANC visit" });
  }
});

export default router;
