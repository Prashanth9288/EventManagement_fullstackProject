// backend/routes/events.js
import express from "express";
import Joi from "joi";
import Event from "../models/Event.js";
import mongoose from "mongoose";
import { authMiddleware } from "../utils/authMiddleware.js"; // optional if you want auth-protected routes

const router = express.Router();

// --- Validation schemas ---
const createEventSchema = Joi.object({
  host: Joi.string().optional(),
  title: Joi.string().min(2).required(),
  description: Joi.string().allow(""),
  tags: Joi.array().items(Joi.string()),
  privacy: Joi.string().valid("public", "private", "rsvp").default("public"),
  type: Joi.string().valid("corporate", "social", "workshop", "other").default("social"),
  format: Joi.string().valid("virtual", "physical", "hybrid").default("physical"),
  status: Joi.string().valid("draft", "published", "past", "cancelled").default("draft"),
  start: Joi.date().required(),
  end: Joi.date().required(),
  timezone: Joi.string().default("UTC"),
  location: Joi.object({
    address: Joi.string().allow(""),
    lat: Joi.number().optional().allow(null),
    lng: Joi.number().optional().allow(null),
    placeId: Joi.string().allow(""),
  }).optional(),
  virtualVenue: Joi.object({
    link: Joi.string().allow(""),
    platform: Joi.string().allow("")
  }).optional(),
  media: Joi.object({
    banners: Joi.array().items(Joi.string()),
    logos: Joi.array().items(Joi.string()),
    videos: Joi.array().items(Joi.string()),
    gallery: Joi.array().items(Joi.string())
  }).optional(),
  ticketing: Joi.object({
    type: Joi.string().valid("free", "paid").default("free"),
    currency: Joi.string().default("USD"),
    tiers: Joi.array().items(Joi.object({
      name: Joi.string(),
      price: Joi.number(),
      capacity: Joi.number(),
      description: Joi.string().allow("")
    }))
  }).optional(),
  agenda: Joi.array().items(Joi.object({
    title: Joi.string().allow(""),
    startTime: Joi.string().allow(""),
    type: Joi.string().allow(""),
    description: Joi.string().allow("")
  })).optional(),
  settings: Joi.object().optional()
});

const updateEventSchema = Joi.object({
  host: Joi.string().optional(),
  title: Joi.string().min(2).optional(),
  description: Joi.string().allow("").optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  privacy: Joi.string().valid("public", "private", "rsvp").optional(),
  type: Joi.string().valid("corporate", "social", "workshop", "other").optional(),
  format: Joi.string().valid("virtual", "physical", "hybrid").optional(),
  status: Joi.string().valid("draft", "published", "past", "cancelled").optional(),
  start: Joi.date().optional(),
  end: Joi.date().optional(),
  timezone: Joi.string().optional(),
  location: Joi.object({
    address: Joi.string().allow(""),
    lat: Joi.number().optional().allow(null),
    lng: Joi.number().optional().allow(null),
    placeId: Joi.string().allow(""),
  }).optional(),
  virtualVenue: Joi.object({
    link: Joi.string().allow(""),
    platform: Joi.string().allow("")
  }).optional(),
  media: Joi.object({
    banners: Joi.array().items(Joi.string()),
    logos: Joi.array().items(Joi.string()),
    videos: Joi.array().items(Joi.string()),
    gallery: Joi.array().items(Joi.string())
  }).optional(),
  ticketing: Joi.object({
    type: Joi.string().valid("free", "paid").optional(),
    currency: Joi.string().optional(),
    tiers: Joi.array().items(Joi.object({
      name: Joi.string(),
      price: Joi.number(),
      capacity: Joi.number(),
      description: Joi.string().allow("")
    }))
  }).optional(),
  agenda: Joi.array().items(Joi.object({
    title: Joi.string().allow(""),
    startTime: Joi.string().allow(""),
    type: Joi.string().allow(""),
    description: Joi.string().allow("")
  })).optional(),
  settings: Joi.object().optional()
});

// --- Routes ---

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Event routes working" });
});

// GET /api/events/my-events - logged in user's events
router.get("/my-events", authMiddleware, async (req, res, next) => {
  try {
    const events = await Event.find({ host: req.user.id }).sort({ start: 1 });
    res.json({ events });
  } catch (err) {
    next(err);
  }
});

// GET /api/events - all events (public)
router.get("/", async (req, res, next) => {
  try {
    const events = await Event.find().sort({ start: 1 }).populate('host', 'name');
    res.json({ events });
  } catch (err) {
    next(err);
  }
});

// POST /api/events - create new event
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    // Use logged in user as host
    const hostId = req.user.id;
    
    // Allow nulls for validation
    // Pre-processing to remove null lat/lng if they are strictly string "null" from some forms?
    // Joi .allow(null) handles actual nulls.
    
    const { error, value } = createEventSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const eventData = {
      ...value,
      host: hostId,
      location: {
        ...value.location,
        type: "Point",
        coordinates: [
           (value.location?.lng) || 0, 
           (value.location?.lat) || 0
        ],
      },
    };

    const event = await Event.create(eventData);
    
    // Real-time update
    const io = req.app.get('io');
    if (io) io.emit('event:new', event);

    res.status(201).json({ event });
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id - single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('host', 'name email')
      .populate('attendees', 'name email');
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Aggregate RSVPs
    const RSVP = mongoose.model('RSVP');
    const counts = await RSVP.aggregate([
      { $match: { eventId: event._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const rsvpCounts = {
      yes: counts.find(c => c._id === 'yes')?.count || 0,
      no: counts.find(c => c._id === 'no')?.count || 0,
      maybe: counts.find(c => c._id === 'maybe')?.count || 0
    };

    res.json({ ...event.toObject(), rsvpCounts });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// GET /api/events/:id/polls - get polls for an event
router.get("/:id/polls", async (req, res) => {
  try {
    // Dynamic import if Poll is not imported at top, or assume imported. 
    // Best to use mongoose.model('Poll') if import is tricky, or just import at top.
    // For now, I will use mongoose.model
    const Poll = mongoose.model('Poll'); 
    const polls = await Poll.find({ event: req.params.id }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch polls" });
  }
});

// PUT /api/events/:id - update event
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { error, value } = updateEventSchema.validate(req.body, {
      allowUnknown: true,
    });
    if (error) return res.status(400).json({ error: error.message });

    const existing = await Event.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Event not found" });

    // Check ownership
    if (existing.host.toString() !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized: You are not the host of this event" });
    }

    // Prevent changing host
    value.host = existing.host;

    if (value.location) {
      value.location.type = "Point";
      const existingLng = existing.location && existing.location.lng ? existing.location.lng : 0;
      const existingLat = existing.location && existing.location.lat ? existing.location.lat : 0;
      
      const newLng = value.location.lng !== undefined && value.location.lng !== null ? value.location.lng : existingLng;
      const newLat = value.location.lat !== undefined && value.location.lat !== null ? value.location.lat : existingLat;
      
      value.location.coordinates = [
        newLng,
        newLat,
      ];
    }

    const event = await Event.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    res.json({ event });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/events/:id
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, host: req.user.id });
    if (!event) return res.status(404).json({ error: "Event not found or unauthorized" });
    res.json({ message: "Event deleted successfully", event });
  } catch (err) {
    next(err);
  }
});

// GET /api/events/nearby/:lng/:lat/:radius
router.get("/nearby/:lng/:lat/:radius", async (req, res, next) => {
  try {
    const { lng, lat, radius } = req.params;

    const radiusInRadians = parseFloat(radius) / 6378137;

    const events = await Event.find({
      "location.coordinates": {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians],
        },
      },
    });

    res.json({ events });
  } catch (err) {
    next(err);
  }
});

export default router;
