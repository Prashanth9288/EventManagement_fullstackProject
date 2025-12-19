import Subscription from '../models/Subscription.js';
import Notification from '../models/Notification.js';

export const subscribe = async (req, res) => {
  try {
    const { organizerId } = req.body;
    const subscriberId = req.user.id;

    if (organizerId === subscriberId) return res.status(400).json({ error: "Cannot subscribe to yourself" });

    // Check existing
    const existing = await Subscription.findOne({ subscriber: subscriberId, organizer: organizerId });
    if (existing) return res.status(400).json({ error: "Already subscribed" });

    const newSub = new Subscription({ subscriber: subscriberId, organizer: organizerId });
    await newSub.save();

    // Notify Organizer
    await Notification.create({
        userId: organizerId,
        message: `New subscriber!`,
        type: 'system',
        referenceId: subscriberId,
        referenceModel: 'User'
    });

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkSubscription = async (req, res) => {
    try {
        const { organizerId } = req.params;
        const exists = await Subscription.findOne({ subscriber: req.user.id, organizer: organizerId });
        res.json({ subscribed: !!exists });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
