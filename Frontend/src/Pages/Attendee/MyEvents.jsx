
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/Footer";

export default function EventsList({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("userToken");
        if (!user || !user._id || !token) {
          navigate("/login");
          return;
        }

        const res = await fetch(window.API_BASE_URL + "/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch events");
        }
        
        const userEvents = data.events.filter(
          (e) => e.host && (e.host === user._id || e.host._id === user._id)
        );
        setEvents(userEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEvents();
    } else {
        setLoading(false);
    }
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`${window.API_BASE_URL}/api/events/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      setEvents(events.filter((e) => e._id !== id));
      toast.success("Event deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/create-event?id=${id}`);
  };

  const handleShare = async (event) => {
    const shareUrl = `${window.location.origin}/events/${event._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: shareUrl,
        });
      } catch (err) {
        // Silently fail if the user cancels the share
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Event link copied to clipboard!");
      } catch (err) {
        prompt("Copy this link:", shareUrl);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-bg-base)] dark:bg-mirage flex flex-col items-center justify-center transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 dark:text-lynch">Loading your events...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-[var(--color-bg-base)] dark:bg-mirage flex items-center justify-center transition-colors duration-300">
        <p className="text-red-500 bg-red-50 dark:bg-red-900/20 px-6 py-4 rounded-xl border border-red-100 dark:border-red-900/30">{error}</p>
    </div>
  );

  return (
    <div className="bg-[var(--color-bg-base)] dark:bg-mirage min-h-screen pt-28 pb-12 transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
           <div>
             <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">My Events</h2>
             <p className="text-gray-500 dark:text-lynch">Manage and track your organized events</p>
           </div>
           <button 
                onClick={() => navigate("/create-event")} 
                className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/30 hover:scale-105 transition-all flex items-center gap-2 shadow-md"
           >
             <span>+</span> Create New Event
           </button>
        </div>

        {events.length === 0 ? (
          <div className="bg-white dark:bg-bluewood rounded-3xl shadow-sm border border-gray-100 dark:border-fiord p-16 text-center">
             <div className="w-20 h-20 bg-gray-50 dark:bg-fiord/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 grayscale opacity-50">📅</div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No events created yet</h3>
             <p className="text-gray-500 dark:text-lynch mb-8 max-w-md mx-auto">Get started by creating your first event to share with the community.</p>
             <button 
                onClick={() => navigate("/create-event")} 
                className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600 font-bold hover:text-teal-700 hover:underline"
              >
                Create Event Now
              </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="group bg-white dark:bg-bluewood rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-fiord hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="h-40 -mx-6 -mt-6 mb-4 relative overflow-hidden rounded-t-3xl">
                      <img 
                        src={event.media?.banners?.[0] || `https://source.unsplash.com/random/800x600/?event,${event.type}`} 
                        alt={event.title}
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://source.unsplash.com/random/800x600/?event,${event.type}`; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                         <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            event.privacy === 'public' ? 'text-indigo-600 dark:text-indigo-300' : 'text-orange-600 dark:text-orange-300'
                          }`}>
                             {event.privacy}
                          </span>
                      </div>
                  </div>

                   <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col items-center bg-gradient-to-br from-teal-50 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 text-teal-800 dark:text-teal-300 rounded-2xl p-2 border border-teal-100 dark:border-teal-800 min-w-[50px] shadow-inner">
                         <span className="text-[10px] font-bold uppercase tracking-wider">{new Date(event.start).toLocaleString('default', { month: 'short' })}</span>
                         <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">{new Date(event.start).getDate()}</span>
                      </div>
                   </div>

                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                     {event.title}
                   </h3>
                   <p className="text-gray-500 dark:text-lynch text-sm line-clamp-3 mb-4 leading-relaxed">
                     {event.description || 'No description provided.'}
                   </p>
                   
                   <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-lynch">
                         <span>📍</span> {event.location?.address || 'Online'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-lynch">
                         <span>⏰</span> {new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                   </div>

                   <div className="flex flex-wrap gap-2 mb-6">
                      {event.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-gray-50 dark:bg-fiord/30 text-gray-500 dark:text-lynch text-xs px-2 py-1 rounded-lg border border-gray-100 dark:border-fiord">
                          #{tag}
                        </span>
                      ))}
                      {event.tags?.length > 3 && <span className="text-gray-400 text-xs py-1">+{event.tags.length - 3} more</span>}
                   </div>
                </div>

                <div className="pt-4 border-t border-gray-50 dark:border-fiord grid grid-cols-4 gap-2">
                  <button
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="col-span-1 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-xl py-2 font-bold text-xs transition-colors flex items-center justify-center"
                    title="View"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleUpdate(event._id)}
                    className="col-span-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-xl py-2 font-bold text-xs transition-colors flex items-center justify-center"
                    title="Edit"
                  >
                   Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="col-span-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl py-2 font-bold text-xs transition-colors flex items-center justify-center"
                    title="Delete"
                  >
                    Del
                  </button>
                  <button
                    onClick={() => handleShare(event)}
                    className="col-span-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl py-2 font-bold text-xs transition-colors flex items-center justify-center"
                    title="Share"
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

       {/* Footer */}
      <Footer />
    </div>
  );
}
