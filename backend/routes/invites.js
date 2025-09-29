import express from 'express';
import Invite from '../models/Invite.js';
import Event from '../models/Event.js'; //  fixed from require to import
import { authMiddleware } from '../utils/authMiddleware.js';
import crypto from 'crypto'; //  fixed from require to import

const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.json({ message: 'Invite routes working' });
});

// Invite someone to an event
router.post('/:eventId', authMiddleware, async (req, res) => {
  try {
    const { email, role, note } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Generate unique token
    const token = crypto.randomBytes(16).toString('hex');

    const invite = new Invite({
      eventId: event._id,
      email,
      invitedBy: req.user.id,
      role: role || 'guest',
      token,
      note
    });

    await invite.save();

    // TODO: send email via SendGrid/SES
    res.status(201).json(invite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all invites for an event
router.get('/:eventId', authMiddleware, async (req, res) => {
  try {
    const invites = await Invite.find({ eventId: req.params.eventId });
    res.json(invites);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
