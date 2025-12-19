import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  refreshTokenHash: { type: String, default: null },
  role: { type: String, enum: ['user', 'organizer', 'admin'], default: 'user' },
  preferences: {
    interests: [String],
    industry: String,
    notifications: { type: Boolean, default: true }
  },
  branding: {
    logo: { type: String, default: "" },
    themeColor: { type: String, default: "#3B82F6" }
  },
  networkingProfile: {
    bio: String,
    tags: [String],
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String
    }
  },
  bookmarkedSessions: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
  connections: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  connectionRequests: [{
      from: { type: Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
