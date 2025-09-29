// backend/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import http from 'http';
import { Server } from 'socket.io';

// Routes
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import rsvpRoutes from './routes/rsvp.js';
import inviteRoutes from './routes/invites.js';
import uploadRoutes from './routes/upload.js';
import notificationsRoutes from './routes/notifications.js';

dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// --- API routes ---
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rsvps', rsvpRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationsRoutes);

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// --- HTTP server for Socket.IO ---
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// --- Socket.IO logic ---
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Join rooms: user and event
  socket.on('join', ({ userId, eventId }) => {
    if (userId) socket.join(`user_${userId}`);
    if (eventId) socket.join(`event_${eventId}`);
  });

  // RSVP update
  socket.on('rsvp:update', (data) => {
    io.to(`event_${data.eventId}`).emit('rsvp:update', data);
  });

  // New comment
  socket.on('comment:new', (data) => {
    io.to(`event_${data.eventId}`).emit('comment:new', data);
  });

  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

// --- Connect DB and start server ---
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
});

// --- Export io for other modules ---
export { io };
