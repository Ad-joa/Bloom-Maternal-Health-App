import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// POST /contractions - Save a single logged contraction
router.post('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { start_time, end_time, duration_sec, frequency_sec } = req.body;

    if (!start_time || !end_time || duration_sec === undefined) {
      return res.status(400).json({ error: 'start_time, end_time, and duration_sec are required' });
    }

    const contraction = await (prisma as any).contraction_logs.create({
      data: {
        user_id: userId,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        duration_sec: Number(duration_sec),
        frequency_sec: frequency_sec !== undefined ? Number(frequency_sec) : null,
      },
    });

    res.status(201).json(contraction);
  } catch (error) {
    console.error('Error saving contraction:', error);
    res.status(500).json({ error: 'Failed to save contraction' });
  }
});

// GET /contractions - Get contraction history for the logged-in user
router.get('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const contractions = await (prisma as any).contraction_logs.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 100,
    });
    res.json(contractions);
  } catch (error) {
    console.error('Error fetching contractions:', error);
    res.status(500).json({ error: 'Failed to fetch contractions' });
  }
});

export default router;
