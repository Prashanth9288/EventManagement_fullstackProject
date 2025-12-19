import express from 'express';
import Event from '../models/Event.js';
import Session from '../models/Session.js';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const router = express.Router();

// GET /api/analytics/events/:eventId - Full stats
router.get('/events/:eventId', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Ensure user is host
    if (event.host.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    // 1. Total Attendees (Registered)
    const totalAttendees = event.attendees ? event.attendees.length : 0;

    // 2. Ticket Sales (If paid)
    // Assuming we have a Ticket model or payment logic. 
    // For now, let's mock revenue based on event.ticketing.tiers * attendees if strict, 
    // but better to just count number of attendees * avg price or similar if we don't have Payment model handy right here.
    // If we have RSVP list, we can check their ticket type. 
    // Let's keep it simple: just count attendees for now.
    
    // 3. Top Sessions (by bookmark count)
    // We need to query Users who have bookmarked sessions of this event.
    let sessionBookmarkCounts = [];
    let eventSessions = [];
    try {
        eventSessions = await Session.find({ event: eventId });
        const sessionIds = eventSessions.map(s => s._id);

        if (sessionIds.length > 0) {
             // Aggregation to count bookmarks
             // Optimization: Store bookmark count on Session model? 
             // For now, let's Aggregate on User collection (might be slow if millions of users, but ok for MVP)
             sessionBookmarkCounts = await User.aggregate([
                 { $unwind: "$bookmarkedSessions" },
                 { $match: { bookmarkedSessions: { $in: sessionIds } } },
                 { $group: { _id: "$bookmarkedSessions", count: { $sum: 1 } } }
             ]);
        }
    } catch (aggErr) {
        console.warn("Analytics Aggregation Error (Non-fatal):", aggErr.message);
        // Continue without session stats
    }

    const stats = {
        totalAttendees,
        revenue: totalAttendees * 50, // Mock revenue: $50 per attendee avg
        sessions: eventSessions.map(s => {
            const countObj = sessionBookmarkCounts.find(c => c._id.toString() === s._id.toString());
            return {
                title: s.title,
                bookmarks: countObj ? countObj.count : 0
            };
        }).sort((a,b) => b.bookmarks - a.bookmarks).slice(0, 5) // Top 5
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/organizer/stats - Aggregate stats for the logged-in organizer
router.get('/organizer/stats', authMiddleware, async (req, res) => {
  try {
    // 1. Find all events hosted by this user
    const events = await Event.find({ host: req.user.id });
    const eventIds = events.map(e => e._id);

    // 2. Calculate Total Revenue & Registrations from Tickets
    // Note: This relies on the Ticket model being populated correctly during payments
    const tickets = await Ticket.find({ event: { $in: eventIds }, status: 'confirmed' });
    
    const totalRevenue = tickets.reduce((acc, ticket) => acc + (ticket.pricePaid || 0), 0);
    const totalRegistrations = tickets.length; // Count of sold tickets

    // 3. Active Events (Future events)
    const activeEventsCount = events.filter(e => new Date(e.start) > new Date()).length;

    // 4. Page Views (Mocked for now as we don't have a tracking system)
    // In a real app, we'd query an AnalyticsEvents collection
    const pageViews = events.reduce((acc, e) => acc + (e.views || 0), 0); 

    res.json({
        totalRevenue,
        totalRegistrations,
        activeEvents: activeEventsCount,
        pageViews: pageViews || 12500 // Fallback if no view tracking logic yet
    });
  } catch (err) {
    console.error("Organizer Stats Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/organizer/attendees - All unique attendees for this organizer
router.get('/organizer/attendees', authMiddleware, async (req, res) => {
    try {
        const events = await Event.find({ host: req.user.id });
        const eventIds = events.map(e => e._id);

        // Find tickets for these events and populate user info
        const tickets = await Ticket.find({ event: { $in: eventIds } })
            .populate('user', 'name email')
            .populate('event', 'title start');

        // Deduplicate users (one user might attend multiple events)
        const attendeeMap = new Map();

        tickets.forEach(ticket => {
            if (!ticket.user) return;
            const userId = ticket.user._id.toString();
            
            if (!attendeeMap.has(userId)) {
                attendeeMap.set(userId, {
                    _id: ticket.user._id,
                    name: ticket.user.name,
                    email: ticket.user.email,
                    eventsAttended: [],
                    totalSpent: 0
                });
            }

            const attendee = attendeeMap.get(userId);
            attendee.eventsAttended.push({
                eventId: ticket.event._id,
                eventTitle: ticket.event.title,
                date: ticket.event.start,
                ticketType: ticket.type
            });
            attendee.totalSpent += (ticket.pricePaid || 0);
        });

        res.json({ attendees: Array.from(attendeeMap.values()) });
    } catch (err) {
        console.error("Organizer Attendees Error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
