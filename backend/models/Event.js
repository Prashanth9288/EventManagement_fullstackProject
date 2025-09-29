import mongoose from 'mongoose';
const { Schema } = mongoose;

const EventSchema = new Schema({
  host: { type: Schema.Types.ObjectId, ref: 'User'},
  title: { type: String, required: true },
  description: { type: String },
  tags: [String],
  privacy: { type: String, enum: ['public', 'private', 'rsvp'], default: 'public' },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  timezone: { type: String, default: 'UTC' },
  location: {
    address: String,
    lat: Number,
    lng: Number,
    placeId: String,
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  media: [String],
  settings: { type: Object, default: {} }
}, { timestamps: true });

EventSchema.index({ "location.coordinates": "2dsphere" });

const Event = mongoose.model('Event', EventSchema);
export default Event;
