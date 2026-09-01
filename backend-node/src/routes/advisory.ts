import express from 'express';
import { getAdvisory, getAdvisorySessions, getAdvisoryHistoryBySession, deleteAdvisorySession } from '../controllers/advisoryController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, getAdvisory);
router.get('/sessions', authenticateToken, getAdvisorySessions);
router.get('/history/:sessionId', authenticateToken, getAdvisoryHistoryBySession);
router.delete('/sessions/:sessionId', authenticateToken, deleteAdvisorySession);

export default router;
