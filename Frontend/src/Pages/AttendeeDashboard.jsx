
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaMapMarkerAlt, FaCalendarAlt, FaTag, FaFire, FaChevronRight } from "react-icons/fa";

export default function AttendeeDashboard() {
  const [user, setUser] = useState({ name: "Attendee" });
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (token) {
           const decoded = jwtDecode(token);
           setUser({ name: decoded.name, role: decoded.role });
        }

        const res = await fetch("http://localhost:5000/api/events");
        const data = await res.json();
        if (res.ok) {
           setEvents(data.events || []);
           setFilteredEvents(data.events || []);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();

    if (window.io) {
      const socket = window.io("http://localhost:5000");
      socket.on("event:new", (newEvent) => {
        setEvents((prev) => [newEvent, ...prev]);
      });
      return () => socket.disconnect();
    }
  }, []);

  useEffect(() => {
    let result = events;
    if (searchTerm) {
      result = result.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (categoryFilter !== 'all') {
      result = result.filter(e => e.type === categoryFilter);
    }
    setFilteredEvents(result);
  }, [searchTerm, categoryFilter, events]);

  const EventCard = ({ event }) => (
    <Link to={`/events/${event._id}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <div className="h-56 relative overflow-hidden">
            <img 
               src={event.media?.banners?.[0] || `https://source.unsplash.com/random/800x600/?event,${event.type}`} 
               alt={event.title} 
               className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
            
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-800 shadow-sm">
                {event.type}
            </div>
            
            <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <div className="bg-teal-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        {event.privacy === 'private' ? 'PRIVATE' : 'PUBLIC'}
                    </div>
                    {event.price === 0 && <div className="bg-green-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">FREE</div>}
                </div>
                <h3 className="text-lg font-bold leading-tight line-clamp-2 drop-shadow-md">{event.title}</h3>
            </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
            <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center text-xs font-bold text-teal-600 uppercase tracking-wide">
                    <FaCalendarAlt className="mr-2" />
                    {new Date(event.start).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    <span className="truncate">{event.location?.address || "Online Event"}</span>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold uppercase ring-2 ring-white shadow-sm">
                        {event.host?.name?.[0] || "O"}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Hosted By</span>
                        <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">{event.host?.name || "Organizer"}</span>
                    </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <FaChevronRight className="pl-0.5" />
                </button>
            </div>
        </div>
    </Link>
  );

  const FeaturedHero = ({ event }) => (
      <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl mb-12 group">
          <img 
               src={event.media?.banners?.[0] || `https://source.unsplash.com/random/1600x900/?concert,conference`} 
               className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-12 max-w-2xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
                  <FaFire className="inline mr-2 mb-0.5" /> Trending Now
              </span>
              <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">{event.title}</h1>
              <p className="text-gray-200 text-lg mb-8 line-clamp-2">{event.description}</p>
              <div className="flex gap-4">
                  <Link to={`/events/${event._id}`} className="px-8 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg">
                      Get Tickets
                  </Link>
                  <button className="px-8 py-3 bg-white/20 backdrop-blur text-white font-bold rounded-xl hover:bg-white/30 transition border border-white/50">
                      View Details
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm/50 backdrop-blur-md bg-white/90">
         <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Discover</h1>
               </div>
               <div className="flex flex-1 max-w-2xl gap-3">
                  <div className="relative flex-1">
                     <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input 
                        type="text" 
                        placeholder="Search events, organizers, categories..." 
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 text-sm font-medium transition-all hover:bg-white hover:shadow-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </div>
            </div>
             
             {/* Categories Scroll */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'social', 'corporate', 'workshop', 'conference', 'concert', 'exhibition'].map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all
                            ${categoryFilter === cat ? 'bg-black text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
         {loading ? (
             <div className="flex h-96 items-center justify-center">
                 <div className="w-12 h-12 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin"></div>
             </div>
         ) : (
             <>
                {!searchTerm && categoryFilter === 'all' && events.length > 0 && (
                    <FeaturedHero event={events[0]} />
                )}

                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {searchTerm ? `Results for "${searchTerm}"` : 
                             categoryFilter !== 'all' ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Events` : 
                             "Upcoming Events"}
                        </h2>
                        <p className="text-gray-500 mt-1">Found {filteredEvents.length} distinct experiences</p>
                    </div>
                </div>

                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredEvents.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl grayscale opacity-50">🎪</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">We couldn't find matches for your search. Try broadening your terms or checking back later.</p>
                        <button onClick={() => {setSearchTerm(""); setCategoryFilter("all")}} className="mt-8 text-teal-600 font-bold hover:underline">Clear all filters</button>
                    </div>
                )}
             </>
         )}
      </div>
    </div>
  );
}
