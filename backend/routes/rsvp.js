import express from 'express';
import RSVP from '../models/RSVP.js';
import Event from '../models/Event.js';        
import { authMiddleware } from '../utils/authMiddleware.js';
const router = express.Router();



router.get('/', (req, res) => {
  res.json({ message: 'RSVP routes working' });
});
// ✅ RSVP to event


router.post('/:eventId', authMiddleware, async (req, res) => {
  try {
    const { status, note } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    // Ensure attendees array exists (for legacy events)
    if (!event.attendees) {
      event.attendees = [];
    }

    // Either update existing RSVP or create new
    let rsvp = await RSVP.findOne({ eventId: event._id, userId: req.user.id });
    if (rsvp) {
      rsvp.status = status;
      rsvp.note = note;
      rsvp.respondedAt = new Date();
    } else {
      rsvp = new RSVP({
        eventId: event._id,
        userId: req.user.id,
        status,
        note
      });
    }

    await rsvp.save();

    await rsvp.save();

    // Sync with Event attendees list using atomic operators to avoid validation/race conditions
    if (status === 'yes') {
        await Event.findByIdAndUpdate(event._id, {
            $addToSet: { attendees: req.user.id }
        });
    } else {
        await Event.findByIdAndUpdate(event._id, {
            $pull: { attendees: req.user.id }
        });
    }

    res.json(rsvp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all RSVPs for an event
router.get('/:eventId', authMiddleware, async (req, res) => {
  try {
    const rsvps = await RSVP.find({ eventId: req.params.eventId }).populate('userId', 'name email');
    res.json(rsvps);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//module.exports = router;

export default router;

