import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// GET /hospitals
// Returns a list of hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await (prisma as any).hospitals.findMany({
      orderBy: { distance: 'asc' }
    });
    
    res.json(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ detail: "Server error fetching hospitals" });
  }
});

export default router;
