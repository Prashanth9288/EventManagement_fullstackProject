import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

// Create Order (Requires auth to associate with user)
router.post('/create-order', authMiddleware, createOrder);

// Verify Payment and book ticket
router.post('/verify-payment', authMiddleware, verifyPayment);

export default router;
