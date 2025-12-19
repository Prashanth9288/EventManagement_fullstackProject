import mongoose from 'mongoose';
const { Schema } = mongoose;

const TicketSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['vip', 'general', 'rsvp', 'Standard', 'Private'], required: true },
  status: { type: String, enum: ['confirmed', 'pending', 'cancelled', 'checked-in'], default: 'pending' },
  pricePaid: { type: Number, default: 0 },
  currency: { type: String },
  paymentId: { type: String }, // Stripe Charge ID
  qrCode: { type: String }, // URL or data string
  accessKey: { type: String } // Unique entry code
}, { timestamps: true });

export default mongoose.model('Ticket', TicketSchema);
