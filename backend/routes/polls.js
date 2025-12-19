import express from 'express';
import { getEventPolls, createPoll, votePoll } from '../controllers/pollController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/:eventId', getEventPolls); // Public read? or auth?
router.post('/create', authMiddleware, createPoll);
router.post('/vote', authMiddleware, votePoll);

export default router;
