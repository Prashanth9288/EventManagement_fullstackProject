import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  refreshTokenHash: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
