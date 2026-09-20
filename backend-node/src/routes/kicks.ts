import express from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// POST /kicks - Save a completed kick counter session
router.post('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { kick_count, duration_sec } = req.body;

    if (kick_count === undefined || duration_sec === undefined) {
      return res.status(400).json({ error: 'kick_count and duration_sec are required' });
    }

    const session = await (prisma as any).kick_sessions.create({
      data: {
        user_id: userId,
        kick_count: Number(kick_count),
        duration_sec: Number(duration_sec),
      },
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error saving kick session:', error);
    res.status(500).json({ error: 'Failed to save kick session' });
  }
});

// GET /kicks - Get kick session history for the logged-in user
router.get('/', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const sessions = await (prisma as any).kick_sessions.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching kick sessions:', error);
    res.status(500).json({ error: 'Failed to fetch kick sessions' });
  }
});

export default router;
