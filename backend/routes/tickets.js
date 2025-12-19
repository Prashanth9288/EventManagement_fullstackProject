import express from 'express';
import { createTicket, getMyTickets, checkIn } from '../controllers/ticketController.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createTicket);
router.get('/my-tickets', authMiddleware, getMyTickets);
router.post('/check-in', authMiddleware, checkIn);

export default router;
