// backend/routes/upload.js
import express from 'express';
import { authMiddleware } from '../utils/authMiddleware.js'; // fixed import path
import { getPresignedUrl } from '../utils/s3.js'; // fixed import path

const router = express.Router();

router.post('/presigned', authMiddleware, async (req, res) => {
  try {
    const { filename, contentType } = req.body;
    if (!filename || !contentType) 
      return res.status(400).json({ error: 'Filename & contentType required' });

    const url = getPresignedUrl(filename, contentType);
    res.json({ url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router; //  use export default instead of module.exports
