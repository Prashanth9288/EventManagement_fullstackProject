import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js';

export const createTicket = async (req, res) => {
  try {
    const { eventId, type, ticketTierId } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check availability if limited capacity (omitted for MVP speed)

    // Verify payment logic would go here if paid
    // For MVP, we assume free RSVP or successful payment verification passed

    const ticket = await Ticket.create({
      event: eventId,
      user: userId,
      type: type || 'general',
      status: 'confirmed',
      accessKey: `KEY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${userId}-${eventId}`
    });

    res.status(201).json({ ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .populate('event', 'title start location virtualVenue media')
      .sort({ createdAt: -1 });
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkIn = async (req, res) => {
    // Logic for QR scan check-in
    res.json({ message: "Check-in logic placeholder" });
};
