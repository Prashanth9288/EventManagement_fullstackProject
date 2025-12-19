import cron from 'node-cron';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { sendEventReminder } from './emailQueue.js';

export const initReminderJob = () => {
    // Run every hour at minute 0
    cron.schedule('0 * * * *', async () => {
        console.log('Running event reminder job...');
        try {
            const now = new Date();
            const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            // Find events starting in next 24 hours that haven't sent reminders yet
            const events = await Event.find({
                start: { $gte: now, $lte: next24Hours },
                remindersSent: { $ne: true },
                status: 'published'
            }).populate('attendees');

            for (const event of events) {
                console.log(`Sending reminders for event: ${event.title}`);
                if (event.attendees && event.attendees.length > 0) {
                    for (const attendee of event.attendees) {
                        if (attendee.email) {
                            await sendEventReminder(event, attendee);
                        }
                    }
                }
                event.remindersSent = true;
                await event.save();
            }
        } catch (error) {
            console.error('Error in reminder job:', error);
        }
    });

    console.log('Event Reminder Cron Job initialized.');
};
