import express from 'express';
import { getAdvisory, getAdvisoryHistory, clearAdvisoryHistory } from '../controllers/advisoryController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, getAdvisory);
router.get('/history', authenticateToken, getAdvisoryHistory);
router.delete('/history', authenticateToken, clearAdvisoryHistory);

export default router;
