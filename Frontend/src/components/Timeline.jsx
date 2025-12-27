import { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark, FaClock, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Timeline({ eventId, isOrganizer, user }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState([]);

  useEffect(() => {
    fetchSessions();
    if (user && user.bookmarkedSessions) {
        setBookmarked(user.bookmarkedSessions);
    }
  }, [eventId, user]);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${window.API_BASE_URL}/api/events/${eventId}/sessions`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error("Failed to load sessions", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (sessionId) => {
      try {
          const token = localStorage.getItem("userToken");
          if (!token) {
              toast.error("Please login to bookmark sessions");
              return;
          }
          const res = await fetch(`${window.API_BASE_URL}/api/sessions/${sessionId}/bookmark`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
              const updatedBookmarks = await res.json();
              setBookmarked(updatedBookmarks);
              toast.success("Bookmark updated");
          }
      } catch (err) {
          toast.error("Failed to update bookmark");
      }
  };

  if (loading) return <div className="text-center py-8">Loading agenda...</div>;
  if (sessions.length === 0) return <div className="text-center py-8 text-gray-500">No sessions scheduled yet.</div>;

  // Group sessions by date
  const groupedSessions = sessions.reduce((acc, session) => {
      const date = new Date(session.startTime).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
      if (!acc[date]) acc[date] = [];
      acc[date].push(session);
      return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groupedSessions).map(([date, daySessions]) => (
        <div key={date} className="animate-fade-in">
          <h3 className="text-xl font-bold text-gray-800 mb-4 sticky top-0 bg-[var(--color-bg-base)]/95 backdrop-blur-sm py-2 z-10 border-b border-gray-200">
            {date}
          </h3>
          <div className="space-y-4 ml-4 border-l-2 border-teal-100 pl-6 relative">
            {daySessions.map((session) => {
               const isBookmarked = bookmarked.includes(session._id);
               return (
                <div key={session._id} className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-6 w-4 h-4 rounded-full bg-teal-500 border-4 border-[var(--color-bg-base)]"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-2 font-mono">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <FaClock className="text-teal-500" />
                            {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                            {new Date(session.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        {session.location && (
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                <FaMapMarkerAlt className="text-red-400" /> {session.location}
                            </span>
                        )}
                      </div>
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                        {session.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {session.description}
                      </p>

                      {session.speakers && session.speakers.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                             {session.speakers.map((sp, idx) => (
                                 <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
                                     <FaUser className="text-teal-500 text-xs" />
                                     <span>{sp.name || sp}</span>
                                 </div>
                             ))}
                          </div>
                      )}
                    </div>

                    <div className="flex items-start">
                        <button 
                            onClick={() => toggleBookmark(session._id)}
                            className={`p-3 rounded-xl transition-all ${isBookmarked ? 'bg-teal-100 text-teal-600' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            title={isBookmarked ? "Remove from My Agenda" : "Add to My Agenda"}
                        >
                            {isBookmarked ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
                        </button>
                    </div>
                  </div>
                </div>
               );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
