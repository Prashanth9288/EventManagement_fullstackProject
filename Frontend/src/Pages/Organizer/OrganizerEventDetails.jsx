import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
    FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaMoneyBill, 
    FaEdit, FaTrash, FaShareAlt, FaPoll, FaBullhorn, FaCommentDots 
} from "react-icons/fa";
import CreatePollModal from "../../components/CreatePollModal";

const OrganizerEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPollModal, setShowPollModal] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvent(res.data);
      } catch (err) {
        console.error("Failed to fetch event details", err);
        alert("Failed to load event.");
        navigate("/organizer-dashboard"); // Go back on error
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEventDetails();
  }, [id, navigate]);

  const handleDeleteEvent = async () => {
      if(!window.confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
      try {
          const token = localStorage.getItem("userToken");
          await axios.delete(`http://localhost:5000/api/events/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          alert("Event deleted successfully");
          navigate("/organizer-dashboard");
      } catch (err) {
          console.error(err);
          alert("Failed to delete event");
      }
  };

  const handleSendReminder = async () => {
      if(!window.confirm("Send email reminders to all attendees of this event?")) return;
      try {
          const token = localStorage.getItem("userToken");
          const res = await axios.post("http://localhost:5000/api/notifications/send-event-reminder", { eventId: id }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          alert(res.data.message);
      } catch (err) {
          console.error(err);
          alert("Failed to send reminders");
      }
  };

  if (loading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500 font-medium">Loading Event Details...</p>
          </div>
      );
  }

  if (!event) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
              <p className="text-gray-500 mb-6">The event you are looking for does not exist or you don't have permission to view it.</p>
              <button 
                onClick={() => navigate("/organizer-dashboard")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
              >
                  Back to Dashboard
              </button>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-24 animate-fadeIn"> {/* Added pt-24 as App.jsx Layout handles padding but maybe not for organizer routes? Verified App.jsx: Organizer routes don't have pt-20. So we need padding. */}
      
      {/* Header & Back Button */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
          <button 
            onClick={() => navigate("/organizer-dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold transition"
          >
              <FaArrowLeft /> Back to My Events
          </button>
          
          <div className="flex gap-3">
              <Link 
                to={`/edit-event/${id}`} 
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-bold hover:bg-orange-200 transition flex items-center gap-2"
              >
                  <FaEdit /> Edit
              </Link>
              <button 
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 transition flex items-center gap-2"
              >
                  <FaTrash /> Delete
              </button>
          </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Event Info */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Event Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {event.media?.banners?.[0] && (
                      <div className="h-64 w-full bg-gray-200">
                          <img src={event.media.banners[0]} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                  )}
                  <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${event.privacy === 'public' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {event.privacy}
                          </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 mb-6">
                          <div className="flex items-center gap-3">
                              <FaCalendarAlt className="text-blue-500" />
                              <span>{new Date(event.start).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <FaMapMarkerAlt className="text-red-500" />
                              <span>{event.location?.address || "Online Event"}</span>
                          </div>
                      </div>

                      <div className="prose max-w-none text-gray-600">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">About this Event</h3>
                          <p className="whitespace-pre-wrap">{event.description || "No description provided."}</p>
                      </div>
                  </div>
              </div>

              {/* Operations Toolbar */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      
                      <button 
                        onClick={() => setShowPollModal(true)}
                        className="p-4 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex flex-col items-center gap-2 text-center"
                      >
                          <FaPoll size={24} />
                          <span className="font-bold text-sm">Create Poll</span>
                      </button>

                      <button 
                        onClick={handleSendReminder}
                        className="p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex flex-col items-center gap-2 text-center"
                      >
                          <FaBullhorn size={24} />
                          <span className="font-bold text-sm">Send Reminder</span>
                      </button>

                      <Link 
                        to={`/organizer/event/${id}/hub`}
                        className="p-4 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 transition flex flex-col items-center gap-2 text-center"
                      >
                          <FaCommentDots size={24} />
                          <span className="font-bold text-sm">Open Hub</span>
                      </Link>

                      <button 
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/events/${id}`);
                            alert("Event link copied!");
                        }}
                        className="p-4 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition flex flex-col items-center gap-2 text-center"
                      >
                          <FaShareAlt size={24} />
                          <span className="font-bold text-sm">Share Link</span>
                      </button>

                  </div>
              </div>
          </div>

          {/* Right Column: Stats & Attendees */}
          <div className="space-y-8">
              
              {/* Mini Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">Event Stats</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><FaMoneyBill /></div>
                          <span className="text-gray-600 font-medium">Revenue</span>
                      </div>
                      {/* Placeholder calculation - needs real ticket data */}
                      <span className="text-xl font-bold text-gray-900">₹0</span> 
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FaUsers /></div>
                          <span className="text-gray-600 font-medium">Attendees</span>
                      </div>
                      <span className="text-xl font-bold text-gray-900">{event.attendees?.length || 0}</span>
                  </div>
                  
                  {/* RSVP Breakdown */}
                  <div className="space-y-2">
                       <p className="text-xs font-bold text-gray-500 uppercase">RSVP Status</p>
                       <div className="flex gap-2">
                           <div className="flex-1 bg-green-50 p-2 rounded text-center">
                               <span className="block text-lg font-bold text-green-700">{event.rsvpCounts?.yes || 0}</span>
                               <span className="text-xs text-green-600">Going</span>
                           </div>
                           <div className="flex-1 bg-gray-50 p-2 rounded text-center">
                               <span className="block text-lg font-bold text-gray-700">{event.rsvpCounts?.maybe || 0}</span>
                               <span className="text-xs text-gray-600">Maybe</span>
                           </div>
                           <div className="flex-1 bg-red-50 p-2 rounded text-center">
                               <span className="block text-lg font-bold text-red-700">{event.rsvpCounts?.no || 0}</span>
                               <span className="text-xs text-red-600">No</span>
                           </div>
                       </div>
                  </div>
              </div>

               {/* Attendees List */}
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900">Registered Users</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                      {event.attendees && event.attendees.map(user => (
                          <div key={user._id} className="p-4 flex items-center gap-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                  {user.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              </div>
                          </div>
                      ))}
                      {(!event.attendees || event.attendees.length === 0) && (
                          <div className="p-6 text-center text-gray-400 text-sm">No attendees yet.</div>
                      )}
                  </div>
              </div>
          </div>

      </div>

      {showPollModal && (
        <CreatePollModal 
            eventId={id}
            onClose={() => setShowPollModal(false)}
            onSuccess={() => alert("Poll created successfully!")}
        />
      )}
    </div>
  );
};

export default OrganizerEventDetails;
