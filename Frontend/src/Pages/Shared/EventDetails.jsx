
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaUsers,
  FaShareAlt,
  FaCheckCircle,
  FaVideo
} from "react-icons/fa";
import Footer from "../../components/Footer";
import Timeline from "../../components/Timeline";
import PaymentModal from "../../components/PaymentModal";
import EventDiscuss from "../../components/EventDiscuss";
import EventPolls from "../../components/EventPolls";

export default function EventDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [userResponse, setUserResponse] = useState(null);

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${window.API_BASE_URL}/api/events/${id}`, {
        headers,
      });
      
      if (!res.ok) {
         if(res.status === 404) throw new Error("Event not found");
         throw new Error("Failed to load event details");
      }

      const data = await res.json();
      setEvent(data);
      
      // Check if user is attending
      if(user && data.attendees) {
          const isGoing = data.attendees.some(att => att._id === user._id || att === user._id);
          setIsAttending(isGoing);
          if (isGoing) setUserResponse('yes'); // Default assumption, or fetch real status
      }

      // Check subscription
      if (token && data.host) {
          const hostId = data.host._id || data.host; // Handle populated or string ID
          const subRes = await fetch(`${window.API_BASE_URL}/api/subscriptions/${hostId}`, { headers });
          if(subRes.ok) {
              const subData = await subRes.json();
              setIsSubscribed(subData.subscribed);
          }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
       setLoading(true);
       fetchEvent();
    }
  }, [id]);

  const handleRSVP = async (status) => {
    if (rsvpLoading) return;
    
    // Check if payment is required for "Yes"
    if (status === 'yes' && (event.price > 0 || event.ticketing?.type === 'paid' || event.privacy === 'private')) {
        setShowPaymentModal(true);
        return;
    }

    try {
      setRsvpLoading(true);
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.error("Please login to RSVP");
        return;
      }

      const res = await fetch(`${window.API_BASE_URL}/api/rsvps/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      
      if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("userToken");
          localStorage.removeItem("userData");
          navigate("/login");
          return;
      }

      if (res.ok) {
        toast.success(`RSVP Updated: ${status}`);
        setUserResponse(status); // Optimistic update
        fetchEvent(); 
      } else {
        toast.error(data.error || "RSVP failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleTicketSuccess = (ticket) => {
      toast.success("Ticket Purchased & RSVP Confirmed!");
      setUserResponse('yes');
      fetchEvent();
  };

  const handleSubscribe = async () => {
      if(!user) {
          toast.info("Login to subscribe");
          return;
      }
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(window.API_BASE_URL + '/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ organizerId: event.host._id })
        });
        if(res.ok) {
            setIsSubscribed(true);
            toast.success("Subscribed to host updates!");
        } else {
            const data = await res.json();
            toast.error(data.error);
        }
      } catch(err) {
          console.error(err);
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-base)] dark:bg-mirage transition-colors duration-300">
        <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 dark:text-lynch font-medium">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-base)] dark:bg-mirage px-6 text-center transition-colors duration-300">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-8 rounded-3xl max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-4">Oops! Event Not Found</h2>
          <p className="mb-6 opacity-80">{error || "The event you are looking for does not exist or has been removed."}</p>
          <button 
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
          >
            Browse All Events
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] dark:bg-mirage flex flex-col pt-10 transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Hero Header */}
      <div className="relative h-96 w-full bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-gray-900/80 z-10"></div>
        <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://source.unsplash.com/random/1600x900/?event,party')] bg-cover bg-center"></div>
        
        <div className="absolute inset-0 z-20 flex flex-col justify-end container mx-auto px-6 pb-12">
          <div className="max-w-4xl">
             <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-200 font-semibold text-sm mb-4 backdrop-blur-sm">
                {event.privacy === 'public' ? 'Public Event' : 'Private Event'}
             </span>
             <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
               {event.title}
             </h1>
             <div className="flex flex-wrap gap-6 text-gray-300 text-lg">
                <div className="flex items-center gap-2">
                   <FaCalendarAlt className="text-teal-400" /> {formatDate(event.start)}
                </div>
                <div className="flex items-center gap-2">
                   <FaClock className="text-teal-400" /> {formatTime(event.start)} - {formatTime(event.end)}
                </div>
                <div className="flex items-center gap-2">
                   <FaMapMarkerAlt className="text-teal-400" /> {event.location?.address || "Online Event"}
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Tabs Navigation */}
            <div className="flex gap-8 border-b border-gray-200 dark:border-fiord">
               {['about', 'agenda', 'discussion', 'polls', 'attendees'].map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`pb-4 text-lg font-bold capitalize transition-all relative ${
                     activeTab === tab 
                     ? "text-teal-600 dark:text-teal-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-teal-600 dark:after:bg-teal-400 after:rounded-t-full" 
                     : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                   }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'about' && (
                <div className="animate-fade-in">
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About this Event</h3>
                   <div className="prose prose-lg text-gray-600 dark:text-lynch leading-relaxed max-w-none mb-8">
                      {event.description}
                   </div>

                   {/* Ticket Section if Price > 0 */}
                   {event.price > 0 && (
                       <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex justify-between items-center mb-8">
                           <div>
                               <div className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide mb-1">Standard Ticket</div>
                               <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">₹{event.price}</div>
                           </div>
                           <button 
                               onClick={() => setShowPaymentModal(true)}
                               className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition transform hover:scale-105"
                           >
                               Buy Ticket
                           </button>
                       </div>
                   )}
                   
                   {event.tags && event.tags.length > 0 && (
                     <div className="pt-8 border-t border-gray-100 dark:border-fiord">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map(tag => (
                            <span key={tag} className="px-4 py-2 bg-gray-100 dark:bg-bluewood text-gray-600 dark:text-lynch rounded-lg text-sm font-medium hover:bg-teal-50 dark:hover:bg-mirage hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-default">
                              #{tag}
                            </span>
                          ))}
                        </div>
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'agenda' && (
                  <div className="animate-fade-in">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Event Agenda</h3>
                      <Timeline eventId={event._id} isOrganizer={event.host?._id === user?._id} user={user} />
                  </div>
              )}

              {activeTab === 'discussion' && (
                <div className="animate-fade-in">
                   <EventDiscuss eventId={event._id} />
                </div>
              )}

              {activeTab === 'polls' && (
                 <div className="animate-fade-in">
                    <EventPolls eventId={event._id} isHost={event.host?._id === user?._id} />
                 </div>
              )}

              {activeTab === 'attendees' && (
                <div className="animate-fade-in">
                   <h3 className="text-2xl font-bold text-gray-900 mb-6">Attendees ({event.attendees?.length || 0})</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {event.attendees?.map((att, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
                           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-500/20">
                              {att.name?.[0] || "G"}
                           </div>
                           <h4 className="font-bold text-gray-900">{att.name}</h4>
                           <span className="text-sm text-teal-600 mt-1">Going</span>
                        </div>
                      ))}
                   </div>
                   {(!event.attendees || event.attendees.length === 0) && (
                      <p className="text-gray-500 italic">No attendees yet.</p>
                   )}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
             {/* RSVP Card */}
             <div className="bg-white dark:bg-bluewood p-8 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-fiord sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Are you going?</h3>
                
                <div className="flex gap-2 mb-6">
                  {['yes', 'no', 'maybe'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleRSVP(status)}
                      className={`flex-1 py-3 rounded-xl font-bold capitalize transition-all transform hover:scale-105 ${
                        userResponse === status
                          ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30 ring-2 ring-teal-600 ring-offset-2 dark:ring-offset-bluewood"
                          : "bg-white dark:bg-mirage border border-gray-200 dark:border-fiord text-gray-600 dark:text-lynch hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* RSVP Stats */}
                {event.rsvpCounts && (
                  <div className="bg-gray-50 dark:bg-mirage rounded-xl p-4 mb-6 flex justify-between text-center border border-gray-100 dark:border-fiord">
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{event.rsvpCounts.yes}</div>
                      <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Going</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{event.rsvpCounts.maybe}</div>
                      <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Maybe</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{event.rsvpCounts.no}</div>
                      <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">No</div>
                    </div>
                  </div>
                )}

                {(event.format === 'virtual' || event.format === 'hybrid') && isAttending && (
                   <button 
                     onClick={() => navigate(`/event/${event._id}/lobby`)}
                     className="w-full py-3 mb-6 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-700 transition flex items-center justify-center gap-2"
                   >
                      <FaVideo /> Enter Virtual Venue
                   </button>
                )}
                
                <div className="space-y-4 text-gray-600 dark:text-lynch">
                   <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-fiord">
                      <span className="flex items-center gap-2"><FaUsers className="text-teal-500"/> Spots</span>
                      <span className="font-semibold text-gray-900 dark:text-white">Unlimited</span>
                   </div>
                   <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-fiord">
                      <span className="flex items-center gap-2"><FaShareAlt className="text-teal-500"/> Share</span>
                      <div className="flex gap-2">
                         <button 
                             onClick={() => {
                                 if (navigator.share) {
                                     navigator.share({
                                         title: event.title,
                                         text: `Check out this event: ${event.title}`,
                                         url: window.location.href,
                                     }).catch(console.error);
                                 } else {
                                     navigator.clipboard.writeText(window.location.href);
                                     toast.info("Link copied to clipboard!");
                                 }
                             }}
                             className="w-8 h-8 rounded-full bg-gray-100 dark:bg-mirage hover:bg-blue-600 hover:text-white transition flex items-center justify-center"
                             title="Share"
                         >
                            <FaShareAlt />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-fiord">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                         <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500"></div>
                      </div>
                      <div className="flex-1">
                         <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Hosted by</p>
                         <div className="flex justify-between items-center">
                            <p className="font-bold text-gray-900 dark:text-white">{event.host?.name || "Event Organizer"}</p>
                            {/* Subscribe Button */}
                            {user && event.host?._id !== user._id && (
                                <button 
                                    onClick={handleSubscribe} 
                                    disabled={isSubscribed}
                                    className={`ml-2 text-xs font-bold px-3 py-1 rounded-full transition ${isSubscribed ? 'bg-gray-100 dark:bg-mirage text-gray-500 cursor-default' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50'}`}
                                >
                                    {isSubscribed ? "Subscribed" : "+ Subscribe"}
                                </button>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Map / Location Card */}
             {event.location?.address && (
                <div className="bg-white dark:bg-bluewood p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-fiord opacity-90">
                   <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500" /> Location
                   </h3>
                   <div className="aspect-video bg-gray-100 dark:bg-mirage rounded-xl mb-4 flex items-center justify-center text-gray-400 relative overflow-hidden group cursor-pointer">
                      <span className="group-hover:scale-110 transition-transform">Map View Placeholder</span>
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                   </div>
                   <p className="text-gray-600 dark:text-lynch font-medium leading-relaxed">
                      {event.location.address}
                   </p>
                </div>
             )}
          </div>

        </div>
      </div>
      
      <Footer />
      
      <PaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)}
          event={event}
          ticketType="Standard"
          price={event.price || 0}
          onSuccess={handleTicketSuccess}
      />
    </div>
  );
}
