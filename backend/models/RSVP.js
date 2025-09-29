import mongoose from 'mongoose';

const { Schema } = mongoose;

const rsvpSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    email: { type: String },
    status: { type: String, enum: ['yes', 'no', 'maybe'], required: true },
    note: { type: String },
    respondedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Optional: Ensure one RSVP per user per event
rsvpSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const RSVP = mongoose.model('RSVP', rsvpSchema);

export default RSVP; 
