import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaVideo, FaUsers, FaPlayCircle, FaCalendarAlt } from 'react-icons/fa';
import Footer from '../components/Footer';

export default function VirtualLobby() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Event and Sessions
    const fetchData = async () => {
      try {
        const [eventRes, sessionRes] = await Promise.all([
          fetch(`${window.API_BASE_URL}/api/events/${id}`),
          fetch(`${window.API_BASE_URL}/api/events/${id}/sessions`)
        ]);

        if (eventRes.ok) setEvent(await eventRes.json());
        if (sessionRes.ok) setSessions(await sessionRes.json());
      } catch (err) {
        console.error("Error fetching lobby data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Lobby...</div>;
  if (!event) return <div className="text-center py-20">Event not found</div>;

  const now = new Date();
  const liveSessions = sessions.filter(s => s.isLive || (new Date(s.startTime) <= now && new Date(s.endTime) >= now));
  const upcomingSessions = sessions.filter(s => new Date(s.startTime) > now).sort((a,b) => new Date(a.startTime) - new Date(b.startTime));

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col pt-10">
      
      {/* Lobby Hero */}
      <div className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900/50 to-gray-900 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1600x900/?conference,digital')] bg-cover opacity-10 z-0 bg-center"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 bg-red-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4 animate-pulse">
            Live Virtual Venue
          </span>
          <h1 className="text-5xl font-bold mb-4">{event.title}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{event.description?.substring(0, 150)}...</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 flex-1">
        
        {/* Live Now Section */}
        {liveSessions.length > 0 && (
          <section className="mb-16 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              Live Now
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {liveSessions.map(session => (
                <div key={session._id} className="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-teal-500 transition-all group shadow-xl shadow-teal-900/10">
                  <div className="relative h-48 bg-gray-700 flex items-center justify-center overflow-hidden">
                     {/* Placeholder preview */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                     <FaVideo className="text-6xl text-gray-600 group-hover:text-teal-400 transition-colors z-0" />
                     <div className="absolute bottom-4 left-4 z-20">
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">LIVE</span>
                     </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{session.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{session.description}</p>
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-teal-400 font-mono flex items-center gap-2">
                          <FaUsers /> 100+ watching
                       </span>
                       {session.virtualLink ? (
                         <a href={session.virtualLink} target="_blank" rel="noreferrer" className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition">
                           Join Session
                         </a>
                       ) : (
                         <button className="px-6 py-2 bg-gray-600 text-gray-400 cursor-not-allowed rounded-xl font-bold">
                           Starting Soon
                         </button>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaCalendarAlt className="text-teal-500" /> Up Next
          </h2>
          <div className="space-y-4">
             {upcomingSessions.length === 0 && <p className="text-gray-500">No upcoming sessions.</p>}
             {upcomingSessions.map(session => (
               <div key={session._id} className="bg-gray-800/50 p-6 rounded-2xl flex items-center justify-between border border-gray-700 hover:bg-gray-800 transition">
                  <div className="flex items-center gap-6">
                     <div className="text-center min-w-[80px]">
                        <div className="text-2xl font-bold text-teal-400">
                          {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                        </div>
                        <div className="text-xs text-gray-500 uppercase font-bold">
                          {new Date(session.startTime).toLocaleDateString([], { weekday: 'short' })}
                        </div>
                     </div>
                     <div>
                        <h4 className="text-lg font-bold">{session.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                           {session.speakers?.map((s,i) => <span key={i} className="bg-gray-700 px-2 rounded-md">{s.name || s}</span>)}
                        </div>
                     </div>
                  </div>
                  <button className="text-gray-400 hover:text-white transition" title="Add to calendar">
                     <FaPlayCircle size={24} />
                  </button>
               </div>
             ))}
          </div>
        </section>

      </div>
      <Footer dark />
    </div>
  );
}
