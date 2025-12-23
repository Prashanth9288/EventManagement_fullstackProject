// backend/server.js
import 'dotenv/config'; // Load env vars before anything else
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './db.js';
import http from 'http';
import { Server } from 'socket.io';

// Routes
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import rsvpRoutes from './routes/rsvp.js';
import Poll from './models/Poll.js';
import inviteRoutes from './routes/invites.js';
import uploadRoutes from './routes/upload.js';
import notificationsRoutes from './routes/notifications.js';
import recommendationRoutes from './routes/recommendations.js';
import paymentRoutes from './routes/payments.js';
import ticketRoutes from './routes/tickets.js';
import sessionRoutes from './routes/sessions.js';
import networkingRoutes from './routes/networking.js';
import analyticsRoutes from './routes/analytics.js';
import pollRoutes from './routes/polls.js';
import subscriptionsRoutes from './routes/subscriptions.js';
import chatRoutes from './routes/chat.js';
import contactRoutes from './routes/contact.js';

const app = express();

// --- Middleware ---
// Security Headers (Manual implementation of Helmet-like headers)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- Static Files ---
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API routes ---
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rsvps', rsvpRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api', sessionRoutes);
app.use('/api/networking', networkingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/contact', contactRoutes);

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// --- HTTP server for Socket.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"], // Allow frontend
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.set('io', io);

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

  // --- Poll Logic ---
  socket.on('poll:create', async (data) => {
    try {
        const { eventId, question, options } = data;
        // Transform string options to objects matching Schema
        const formattedOptions = options.map(opt => ({ text: opt, votes: 0 }));
        
        const newPoll = new Poll({
            event: eventId,
            question,
            options: formattedOptions,
            status: 'active'
        });
        await newPoll.save();
        
        // Emit the saved poll (with _id) back to the room
        io.to(`event_${eventId}`).emit('poll:new', newPoll);
    } catch (err) {
        console.error("Poll create error:", err);
    }
  });

  socket.on('poll:vote', async ({ pollId, optionIdx, eventId }) => {
      try {
          const poll = await Poll.findById(pollId);
          if(poll && poll.options[optionIdx]) {
              poll.options[optionIdx].votes = (poll.options[optionIdx].votes || 0) + 1;
              await poll.save();
              io.to(`event_${eventId}`).emit('poll:update', poll);
          }
      } catch (err) {
          console.error("Poll vote error:", err);
      }
  });
  
  // --- Direct Message Logic ---
  socket.on('dm:send', async (data) => {
      try {
          const { senderId, recipientId, content } = data;
          const Message = (await import('./models/Message.js')).default;
          
          const newMsg = new Message({ sender: senderId, recipient: recipientId, content });
          await newMsg.save();

          // Emit to Recipient (joined room 'user_recipientId')
          io.to(`user_${recipientId}`).emit('dm:receive', newMsg);
          // Emit back to Sender (for confirmation/multi-device)
          io.to(`user_${senderId}`).emit('dm:receive', newMsg);
      } catch (err) {
          console.error("DM Error:", err);
      }
  });
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
// restart
