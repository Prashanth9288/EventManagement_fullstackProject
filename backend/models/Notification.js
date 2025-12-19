import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ['rsvp', 'reminder', 'invite', 'system', 'vote'], default: 'system' },
    referenceId: { type: mongoose.Schema.Types.ObjectId }, // To link to Event or User
    referenceModel: { type: String } // 'Event' or 'User'
  },
  { timestamps: true }
);

// Export the model in ESM style
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
