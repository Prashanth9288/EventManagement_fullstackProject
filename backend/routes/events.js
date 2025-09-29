// backend/routes/events.js
import express from "express";
import Joi from "joi";
import Event from "../models/Event.js";
import { authMiddleware } from "../utils/authMiddleware.js"; // optional if you want auth-protected routes

const router = express.Router();

// --- Validation schemas ---
const createEventSchema = Joi.object({
  host: Joi.string().optional(),
  title: Joi.string().min(2).required(),
  description: Joi.string().allow(""),
  tags: Joi.array().items(Joi.string()),
  privacy: Joi.string().valid("public", "private", "rsvp").default("public"),
  start: Joi.date().required(),
  end: Joi.date().required(),
  timezone: Joi.string().default("UTC"),
  location: Joi.object({
    address: Joi.string().required(),
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    placeId: Joi.string().allow(""),
  }).required(),
});

const updateEventSchema = Joi.object({
  host: Joi.string().optional(),
  title: Joi.string().min(2).optional(),
  description: Joi.string().allow("").optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  privacy: Joi.string().valid("public", "private", "rsvp").optional(),
  start: Joi.date().optional(),
  end: Joi.date().optional(),
  timezone: Joi.string().optional(),
  location: Joi.object({
    address: Joi.string().optional(),
    lat: Joi.number().optional(),
    lng: Joi.number().optional(),
    placeId: Joi.string().allow(""),
  }).optional(),
});

// --- Routes ---

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Event routes working" });
});

// POST /api/events - create new event
router.post("/", async (req, res, next) => {
  try {
    const hostId = req.body.host || "650abc1234abcd"; // dummy host
    const { error, value } = createEventSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const eventData = {
      ...value,
      host: hostId,
      location: {
        ...value.location,
        type: "Point",
        coordinates: [value.location.lng, value.location.lat],
      },
    };

    const event = await Event.create(eventData);
    res.status(201).json({ event });
  } catch (err) {
    next(err);
  }
});

// GET /api/events - all events
router.get("/", async (req, res, next) => {
  try {
    const events = await Event.find().sort({ start: 1 });
    res.json({ events });
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id - single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// PUT /api/events/:id - update event
router.put("/:id", async (req, res, next) => {
  try {
    const { error, value } = updateEventSchema.validate(req.body, {
      allowUnknown: true,
    });
    if (error) return res.status(400).json({ error: error.message });

    const existing = await Event.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Event not found" });

    if (!value.host) value.host = existing.host;

    if (value.location) {
      value.location.type = "Point";
      value.location.coordinates = [
        value.location.lng || existing.location.lng,
        value.location.lat || existing.location.lat,
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
router.delete("/:id", async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
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
