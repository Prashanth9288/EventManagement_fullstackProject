
import { useState } from "react";
import axios from 'axios';
import Footer from "../../components/Footer";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaPaperPlane } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        await axios.post('http://localhost:5000/api/contact', formData);
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
        console.error(err);
        toast.error("Failed to send message. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDF7] flex flex-col pt-20">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-gray-900 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 opacity-90"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out to our team using the form below.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info Cards */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-xl shrink-0">
                <FaEnvelope />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Email Us</h3>
                <p className="text-gray-500 mb-1">Our friendly team is here to help.</p>
                <a href="mailto:support@eventhub.com" className="text-teal-600 font-semibold hover:underline">support@eventhub.com</a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl shrink-0">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Visit Us</h3>
                <p className="text-gray-500 mb-1">Come say hello at our office headquarters.</p>
                <p className="text-gray-800 font-medium">100 Smith Street<br/>Collingwood VIC 3066 AU</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-xl shrink-0">
                <FaPhoneAlt />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Call Us</h3>
                <p className="text-gray-500 mb-1">Mon-Fri from 8am to 5pm.</p>
                <a href="tel:+15550000000" className="text-gray-800 font-medium hover:text-orange-600 transition">+1 (555) 000-0000</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100">
               <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-gray-700 ml-1">Your Name</label>
                     <input 
                       type="text" 
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       placeholder="John Doe"
                       required
                       className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                     <input 
                       type="email" 
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       placeholder="john@example.com"
                       required
                       className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                     />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                   <input 
                     type="text" 
                     name="subject"
                     value={formData.subject}
                     onChange={handleChange}
                     placeholder="How can we help?"
                     required
                     className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                   <textarea 
                     name="message"
                     value={formData.message}
                     onChange={handleChange}
                     rows="5"
                     placeholder="Tell us more regarding your query..."
                     required
                     className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium resize-none"
                   ></textarea>
                 </div>

                 <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                 </button>
               </form>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}
