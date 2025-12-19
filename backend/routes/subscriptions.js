import express from 'express';
import { subscribe, checkSubscription } from '../controllers/subscriptionController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, subscribe);
router.get('/:organizerId', authMiddleware, checkSubscription);

export default router;
