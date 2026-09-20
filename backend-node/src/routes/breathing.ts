import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// POST /breathing - Save a completed breathing exercise session
router.post('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { duration_sec } = req.body;

    if (duration_sec === undefined) {
      return res.status(400).json({ error: 'duration_sec is required' });
    }

    const session = await (prisma as any).breathing_sessions.create({
      data: {
        user_id: userId,
        duration_sec: Number(duration_sec),
      },
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error saving breathing session:', error);
    res.status(500).json({ error: 'Failed to save breathing session' });
  }
});

// GET /breathing - Get breathing session history for the logged-in user
router.get('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const sessions = await (prisma as any).breathing_sessions.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching breathing sessions:', error);
    res.status(500).json({ error: 'Failed to fetch breathing sessions' });
  }
});

export default router;
