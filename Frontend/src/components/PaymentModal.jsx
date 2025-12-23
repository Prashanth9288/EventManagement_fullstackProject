import { useState } from 'react';
import axios from 'axios';
import { FaLock } from 'react-icons/fa';

export default function PaymentModal({ isOpen, onClose, event, ticketType, price, onSuccess }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      
      // 1. Create Order
      const orderRes = await axios.post(
        window.API_BASE_URL + '/api/payments/create-order', 
        { amount: price, currency: 'INR' }, // Amount in INR
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = orderRes.data;

      // 2. Open Razorpay
      const options = {
        key: "rzp_test_RsX00wtcePujdH", // Updated Public Key from User
        amount: order.amount,
        currency: order.currency,
        name: "EventPro",
        description: `Ticket: ${event.title} (${ticketType})`,
        image: "https://example.com/logo.png", // Add logo if available
        order_id: order.id,
        handler: async function (response) {
           try {
             // Fetch latest token inside callback
             const paymentToken = localStorage.getItem('userToken');
             
             // 3. Verify Payment
             const verifyRes = await axios.post(
               window.API_BASE_URL + '/api/payments/verify-payment',
               {
                 razorpay_order_id: response.razorpay_order_id,
                 razorpay_payment_id: response.razorpay_payment_id,
                 razorpay_signature: response.razorpay_signature,
                 ticketDetails: {
                     eventId: event._id,
                     type: ticketType,
                     price: price
                 }
               },
               { headers: { Authorization: `Bearer ${paymentToken}` } }
             );

             if (verifyRes.data.status === 'success') {
                 onSuccess(verifyRes.data.ticket);
                 onClose();
             } else {
                 alert("Payment Verification Failed");
             }
           } catch (err) {
               console.error("Verification Error", err);
               if (err.response?.status === 401) {
                   alert("Session expired during payment. Please login again.");
                   window.location.href = '/login';
               } else {
                   alert("Payment Verification Failed on Server: " + (err.response?.data?.message || err.message));
               }
           }
        },
        prefill: {
            name: "Prashanth User", // Could fetch from user profile
            email: "user@example.com",
            contact: "9999999999"
        },
        theme: {
            color: "#4F46E5"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert(response.error.description);
      });
      rzp1.open();

    } catch (err) {
      console.error("Payment Error", err);
      alert("Functionality requires Backend Server running");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 font-bold">✕</button>
          
          <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <FaLock />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
              <p className="text-gray-500 text-sm">Processed by Razorpay</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Event</span>
                  <span className="font-bold text-gray-900 text-right truncate w-40">{event.title}</span>
              </div>
              <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Ticket Type</span>
                  <span className="font-bold text-gray-900">{ticketType}</span>
              </div>
              <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                  <span className="text-gray-900 font-bold">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">₹{price}</span>
              </div>
          </div>

          <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
              {loading ? 'Processing...' : 'Pay Now'}
          </button>
      </div>
    </div>
  );
}
