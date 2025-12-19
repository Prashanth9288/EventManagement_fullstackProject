import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };
    
    // In a real production app, we would push this to a Redis queue (Bull).
    // For this MVP, we just send immediately but wrap in a promise to not block main thread heavily if not awaited.
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw, just log. We don't want to crash the server for an email failure.
    return null;
  }
};

export const sendEventReminder = async (event, user) => {
    const subject = `Reminder: ${event.title} starts tomorrow!`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f766e;">Upcoming Event Reminder</h2>
            <p>Hi ${user.name},</p>
            <p>This is a friendly reminder that <strong>${event.title}</strong> is starting soon.</p>
            
            <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Date:</strong> ${new Date(event.start).toLocaleString()}</p>
                <p><strong>Location:</strong> ${event.location?.address || 'Online'}</p>
            </div>

            <p>We look forward to seeing you there!</p>
            <br/>
            <a href="http://localhost:5173/events/${event._id}" style="background: #0f766e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Event Details</a>
        </div>
    `;
    return sendEmail(user.email, subject, html);
};
