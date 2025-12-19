import express from 'express';
import Session from '../models/Session.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { authMiddleware } from '../utils/authMiddleware.js'; // Assuming this exists or similar

const router = express.Router();

// GET /api/events/:eventId/sessions
router.get('/events/:eventId/sessions', async (req, res) => {
  try {
    const { eventId } = req.params;
    const sessions = await Session.find({ event: eventId }).sort({ startTime: 1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events/:eventId/sessions - Organizer only
router.post('/events/:eventId/sessions', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Check if user is host
    if (event.host.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const session = new Session({ ...req.body, event: eventId });
    await session.save();
    
    // Optional: Add to event's agenda array if you want bidirectional linkage
    // event.agenda.push(session._id);
    // await event.save();

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/sessions/:id - Update session
router.put('/sessions/:id', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('event');
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Check ownership
    if (session.event.host.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    Object.assign(session, req.body);
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/sessions/:id
router.delete('/sessions/:id', authMiddleware, async (req, res) => {
  try {
      const session = await Session.findById(req.params.id).populate('event');
      if (!session) return res.status(404).json({ error: 'Session not found' });

      // Check ownership
      if (session.event.host.toString() !== req.user.id) {
          return res.status(403).json({ error: 'Unauthorized' });
      }

      await session.deleteOne();
      res.json({ message: 'Session deleted' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// POST /api/sessions/:id/bookmark
router.post('/sessions/:id/bookmark', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const sessionId = req.params.id;

        // Check if already bookmarked
        const index = user.bookmarkedSessions.indexOf(sessionId);
        if (index === -1) {
            user.bookmarkedSessions.push(sessionId);
        } else {
            user.bookmarkedSessions.splice(index, 1);
        }
        await user.save();
        res.json(user.bookmarkedSessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
