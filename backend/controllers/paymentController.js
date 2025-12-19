import Razorpay from 'razorpay';
import crypto from 'crypto';
import Ticket from '../models/Ticket.js';
import Notification from '../models/Notification.js';
import RSVP from '../models/RSVP.js';
import Event from '../models/Event.js';

// Helper to initialize Razorpay Lazily
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are missing in .env");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Create Order (Initiate Payment)
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: Math.max(amount * 100, 100), // Enforce minimum 1 INR (100 paise)
      currency,
      receipt,
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Verify Payment (Complete Payment)
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, ticketDetails } = req.body;

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment Successful
      
      // 1. Create Ticket in DB
      const newTicket = new Ticket({
         user: req.user.id,
         event: ticketDetails.eventId,
         type: ticketDetails.type || 'Standard',
         price: ticketDetails.price,
         status: 'confirmed',
         paymentId: razorpay_payment_id,
         qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${req.user.id}-${ticketDetails.eventId}-${razorpay_payment_id}`
      });
      await newTicket.save();

      // 2. Send Notification
      const notification = new Notification({
          userId: req.user.id,
          message: `Your ticket for event ID ${ticketDetails.eventId} is confirmed!`,
          type: 'system',
      });
      await notification.save();

      // 3. Auto-RSVP and Add to Attendees
      // Imports moved to top
      
      await RSVP.findOneAndUpdate(
          { eventId: ticketDetails.eventId, userId: req.user.id },
          { status: 'yes', respondedAt: new Date() },
          { upsert: true, new: true }
      );

      await Event.findByIdAndUpdate(ticketDetails.eventId, {
          $addToSet: { attendees: req.user.id }
      });

      res.json({ status: 'success', message: 'Payment verified successfully', ticket: newTicket });
    } else {
      res.status(400).json({ status: 'failure', message: 'Signature verification failed' });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
