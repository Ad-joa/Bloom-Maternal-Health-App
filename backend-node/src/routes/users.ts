import express from 'express';
import { getUser, updateUser, onboardUser, getUserInsights, fetchPartnerSummary } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// GET /users/:id
router.get('/:id', getUser);

// PUT /users/:id
router.put('/:id', authenticateToken, updateUser);

// PUT /users/:user_id/onboard
router.put('/:user_id/onboard', authenticateToken, onboardUser);

// GET /users/:user_id/insights
router.get('/:user_id/insights', authenticateToken, getUserInsights);

// GET /users/:user_id/partner-summary
router.get('/:user_id/partner-summary', authenticateToken, fetchPartnerSummary);

import prisma from '../lib/prisma';

// --- Reminders ---
router.get('/:id/reminders', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = parseInt(req.params.id as string);
    const reminders = await prisma.reminders.findMany({ where: { user_id: userId } });
    res.json(reminders);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

router.post('/:id/reminders', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = parseInt(req.params.id as string);
    const { title, type, time } = req.body;
    const reminder = await prisma.reminders.create({
      data: { user_id: userId, title, type, time }
    });
    res.json(reminder);
  } catch (e) {
    res.status(500).json({ error: "Failed to create reminder" });
  }
});

router.delete('/:id/reminders/:reminder_id', authenticateToken, async (req: any, res: any) => {
  try {
    const reminderId = parseInt(req.params.reminder_id as string);
    if (!isNaN(reminderId)) {
      await prisma.reminders.delete({ where: { id: reminderId } });
    }
    res.json({ success: true });
  } catch (e: any) {
    if (e.code === 'P2025') {
      return res.json({ success: true });
    }
    console.error("Delete reminder error:", e);
    res.status(500).json({ error: "Failed to delete reminder" });
  }
});

// --- Partner Mode ---
router.post('/:id/partner/link', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = parseInt(req.params.id as string);
    const { code } = req.body;
    
    const partner = await prisma.users.findUnique({ where: { partner_code: code } });
    if (!partner) return res.status(404).json({ error: "Invalid partner code" });
    if (partner.id === userId) return res.status(400).json({ error: "Cannot link to yourself" });

    await prisma.users.update({ where: { id: userId }, data: { linked_user_id: partner.id } });
    await prisma.users.update({ where: { id: partner.id }, data: { linked_user_id: userId } });
    
    res.json({ success: true, partnerName: partner.name });
  } catch (e) {
    res.status(500).json({ error: "Failed to link partner" });
  }
});

router.get('/:id/partner/dashboard', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = parseInt(req.params.id as string);
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user || !user.linked_user_id) return res.status(404).json({ error: "No partner linked" });

    const partnerData = await prisma.users.findUnique({
      where: { id: user.linked_user_id },
      include: {
        symptom_logs: { take: 5, orderBy: { created_at: 'desc' } },
        anc_visits: { where: { status: 'scheduled' }, orderBy: { created_at: 'asc' } }
      }
    });

    res.json(partnerData);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch partner dashboard" });
  }
});

export default router;
