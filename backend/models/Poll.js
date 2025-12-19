import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  question: { type: String, required: true },
  options: [{
    text: String,
    votes: { type: Number, default: 0 }
  }],
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Poll', pollSchema);
