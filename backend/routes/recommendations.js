import express from 'express';
import { getRecommendedEvents, getNetworkingMatches } from '../controllers/recommendationController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/events', authMiddleware, getRecommendedEvents);
router.get('/people', authMiddleware, getNetworkingMatches);


export default router;
