import express from 'express';
import Message from '../models/Message.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

// Get valid convo with specific user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params; // The other person
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: myId, recipient: userId },
        { sender: userId, recipient: myId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
