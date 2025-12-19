import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

// GET /api/networking/attendees - List users (simple version: list all except me)
router.get('/attendees', authMiddleware, async (req, res) => {
  try {
    const attendees = await User.find({ _id: { $ne: req.user.id } })
      .select('name email networkingProfile role')
      .limit(50); // limit for now
    res.json(attendees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/networking/me - Get my network info (requests, connections)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('connections', 'name email networkingProfile')
            .populate('connectionRequests.from', 'name email networkingProfile');
        res.json({
            connections: user.connections,
            requests: user.connectionRequests
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/networking/connect/:userId - Send request
router.post('/connect/:userId', authMiddleware, async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        if (targetUserId === req.user.id) return res.status(400).json({ error: "Cannot connect self" });

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return res.status(404).json({ error: "User not found" });

        // Check if already connected or pending
        const existingRequest = targetUser.connectionRequests.find(r => r.from.toString() === req.user.id);
        const alreadyConnected = targetUser.connections.includes(req.user.id);

        if (existingRequest || alreadyConnected) {
            return res.status(400).json({ error: "Request already sent or connected" });
        }

        targetUser.connectionRequests.push({ from: req.user.id, status: 'pending' });
        await targetUser.save();

        res.json({ message: "Connection request sent" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/networking/accept/:userId - Accept request
router.post('/accept/:userId', authMiddleware, async (req, res) => {
    try {
        const requesterId = req.params.userId;
        const me = await User.findById(req.user.id);

        const requestIndex = me.connectionRequests.findIndex(
            r => r.from.toString() === requesterId && r.status === 'pending'
        );

        if (requestIndex === -1) return res.status(404).json({ error: "No pending request using this ID" });

        // Add to connections for both
        me.connections.push(requesterId);
        me.connectionRequests.splice(requestIndex, 1); // remove request
        await me.save();

        const requester = await User.findById(requesterId);
        requester.connections.push(me._id);
        await requester.save();

        res.json({ message: "Connected!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
