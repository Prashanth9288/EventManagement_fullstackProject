import mongoose from 'mongoose';
const { Schema } = mongoose;

const SessionSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  title: { type: String, required: true },
  description: String,
  speakers: [{
    name: String,
    bio: String,
    photo: String
  }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  location: String, // Room name or virtual link
  type: { type: String, enum: ['keynote', 'workshop', 'panel', 'networking', 'break'], default: 'keynote' },
  capacity: Number,
  virtualLink: { type: String },
  isLive: { type: Boolean, default: false }
}, { timestamps: true });


// Index for efficient querying by event
SessionSchema.index({ event: 1, startTime: 1 });

export default mongoose.model('Session', SessionSchema);
