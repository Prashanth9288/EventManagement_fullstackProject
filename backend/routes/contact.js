import express from 'express';
import { sendEmail } from '../jobs/emailQueue.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: "Please provide name, email and message" });
        }

        // Construct Email Content
        const emailSubject = `New Contact Message: ${subject || 'No Subject'}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #0d9488; padding: 20px; text-align: center;">
                    <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <p style="color: #374151; font-size: 16px;">You have received a new message from the contact form.</p>
                    
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
                    </div>

                    <div style="margin-top: 20px;">
                        <p style="font-weight: bold; color: #374151; margin-bottom: 10px;">Message:</p>
                        <p style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; color: #4b5563; line-height: 1.6;">${message}</p>
                    </div>
                </div>
                <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
                    EventHub Contact System
                </div>
            </div>
        `;

        // Send Email
        // Sending TO the configured email user (assuming they are the admin/organizer receiving these)
        // Or strictly to 'support@eventhub.com' if that existed.
        // For now, assume process.env.EMAIL_USER is the receiver (Admin)
        await sendEmail(process.env.EMAIL_USER, emailSubject, html);

        res.json({ message: "Message sent successfully" });

    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
});

export default router;
