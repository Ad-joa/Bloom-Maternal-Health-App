import express from 'express';
import prisma from '../lib/prisma';

const router = express.Router();

// GET /educational
// Returns educational content, optionally filtered by trimester or category
router.get('/', async (req, res) => {
  try {
    const { trimester, category } = req.query;
    
    let whereClause: any = {};
    if (trimester) {
      whereClause.trimester = parseInt(trimester as string);
    }
    if (category) {
      whereClause.category = category;
    }

    const content = await (prisma as any).educational_content.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' }
    });
    
    res.json(content);
  } catch (error) {
    console.error("Error fetching educational content:", error);
    res.status(500).json({ detail: "Server error fetching educational content" });
  }
});

export default router;
