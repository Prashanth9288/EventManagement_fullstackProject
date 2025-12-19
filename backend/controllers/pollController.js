import Poll from '../models/Poll.js';
import { io } from '../server.js'; // Import io instance

export const getEventPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ event: req.params.eventId }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPoll = async (req, res) => {
  try {
    const { eventId, question, options } = req.body;
    const formattedOptions = options.map(opt => ({ text: opt, votes: 0 }));
    
    const newPoll = new Poll({
      event: eventId,
      question,
      options: formattedOptions,
      createdBy: req.user.id
    });
    
    await newPoll.save();
    
    // Broadcast via Socket
    io.to(`event_${eventId}`).emit('poll:new', newPoll);
    
    res.status(201).json(newPoll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { pollId, optionIdx, eventId } = req.body;
    
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // Simple increment (in real app, track user votes to prevent duplicates)
    if (poll.options[optionIdx]) {
        poll.options[optionIdx].votes += 1;
        await poll.save();
        
        // Broadcast Update
        io.to(`event_${eventId}`).emit('poll:update', poll);
        res.json(poll);
    } else {
        res.status(400).json({ error: "Invalid option" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
