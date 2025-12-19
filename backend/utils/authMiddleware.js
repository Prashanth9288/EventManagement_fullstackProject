// backend/utils/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // If no header or invalid, use dummy user (for testing only!)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('No token provided, using dummy user for testing');
      req.user = {
        id: '6512bd43d9caa6e02c990b0a', // your dummy user id from DB
        name: 'Test User',
        email: 'test@example.com'
      };
      return next();
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      // Try ACCESS_TOKEN_SECRET first, fallback to JWT_SECRET for legacy/simple setups
      const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
      decoded = jwt.verify(token, secret);
    } catch (err) {
      console.error("JWT Verify Error:", err.message);
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (!decoded || !decoded.id) {
      console.error("Invalid Token Payload:", decoded);
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.error("User not found for ID:", decoded.id);
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('AuthMiddleware error:', err.message);
    return res.status(500).json({ error: 'Server error in authentication' });
  }
};
