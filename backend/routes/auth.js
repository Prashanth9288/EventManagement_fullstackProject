import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const saltRounds = 10;

// ------------------
// REGISTER
// ------------------
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const existing = await User.findOne({ email: value.email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    // Hash password
    const passwordHash = await bcrypt.hash(value.password, saltRounds);

    const user = await User.create({ name: value.name, email: value.email, passwordHash });

    const safeUser = { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt };
    res.status(201).json({ user: safeUser });
  } catch (err) {
    next(err);
  }
});

// ------------------
// LOGIN
// ------------------
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(value.password, user.passwordHash);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate tokens
    const payload = { id: user._id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXP });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXP });

    // Save hashed refresh token
    const refreshTokenHash = await bcrypt.hash(refreshToken, saltRounds);
    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
});

// ------------------
// REFRESH TOKEN
// ------------------
const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { error, value } = refreshSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const decoded = jwt.verify(value.refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokenHash) return res.status(401).json({ error: 'Invalid refresh token' });

    const isValid = await bcrypt.compare(value.refreshToken, user.refreshTokenHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid refresh token' });

    // Generate new tokens
    const payload = { id: user._id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXP });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXP });

    // Update hashed refresh token
    user.refreshTokenHash = await bcrypt.hash(refreshToken, saltRounds);
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Refresh token expired' });
    next(err);
  }
});

export default router;
