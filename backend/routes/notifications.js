import express from 'express';
import Notification from '../models/Notification.js';   // ESM import
import { authMiddleware } from '../utils/authMiddleware.js'; // ESM import

const router = express.Router();

// 🔹 Health-check for notifications route
router.get('/ping', (req, res) => {
  res.json({ message: 'Notifications route working' });
});

// 🔹 Get user notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Mark notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notif) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Manually trigger event reminder (for organizers)
import Event from '../models/Event.js';
import { sendEventReminder } from '../jobs/emailQueue.js';

router.post('/send-event-reminder', authMiddleware, async (req, res) => {
    try {
        const { eventId } = req.body;
        const event = await Event.findById(eventId).populate('attendees');
        
        if (!event) return res.status(404).json({ error: 'Event not found' });
        if (event.host.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        let count = 0;
        if (event.attendees && event.attendees.length > 0) {
            for (const attendee of event.attendees) {
                if (attendee.email) {
                    await sendEventReminder(event, attendee);
                    count++;
                }
            }
        }
        res.json({ message: `Reminders sent to ${count} attendees` });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
