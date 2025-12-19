import Event from '../models/Event.js';
import User from '../models/User.js';

// Mock content-based filtering
export const getRecommendedEvents = async (req, res) => {
  try {
    const events = await Event.find().limit(5); // In real app, filter by user interests
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mock networking matches
export const getNetworkingMatches = async (req, res) => {
  try {
    const matches = await User.find({ _id: { $ne: req.user.userId } })
      .select('name email industry interests')
      .limit(3);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
