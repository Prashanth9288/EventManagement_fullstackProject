
import mongoose from 'mongoose';
const { Schema } = mongoose;

const inviteSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    email: { type: String, required: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
  },
  { timestamps: true }
);

const Invite = mongoose.model('Invite', inviteSchema);

export default Invite; 
