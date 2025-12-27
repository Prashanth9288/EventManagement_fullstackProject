
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

        const res = await fetch(window.API_BASE_URL + "/api/events");
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
      const socket = window.io(window.API_BASE_URL + "");
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
      result = result.filter(e => e.type && e.type.toLowerCase() === categoryFilter.toLowerCase());
    }
    setFilteredEvents(result);
  }, [searchTerm, categoryFilter, events]);

  const EventCard = ({ event }) => (
    <Link to={`/events/${event._id}`} className="group bg-white dark:bg-bluewood rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-fiord hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <div className="h-56 relative overflow-hidden">
            <img 
               src={event.media?.banners?.[0] || `https://source.unsplash.com/random/800x600/?event,${event.type}`} 
               alt={event.title} 
               onError={(e) => { e.target.onerror = null; e.target.src = `https://source.unsplash.com/random/800x600/?event,${event.type}`; }}
               className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
            
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-mirage/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-800 dark:text-white shadow-sm">
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
                <div className="flex items-center text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                    <FaCalendarAlt className="mr-2" />
                    {new Date(event.start).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                </div>
                <div className="flex items-center text-gray-500 dark:text-lynch text-sm">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    <span className="truncate">{event.location?.address || "Online Event"}</span>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-50 dark:border-fiord flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold uppercase ring-2 ring-white shadow-sm">
                        {event.host?.name?.[0] || "O"}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 dark:text-lynch font-bold uppercase">Hosted By</span>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[100px]">{event.host?.name || "Organizer"}</span>
                    </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-gray-50 dark:bg-fiord/30 flex items-center justify-center text-gray-400 dark:text-lynch group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <FaChevronRight className="pl-0.5" />
                </button>
            </div>
        </div>
    </Link>
  );

  const FeaturedCarousel = ({ events }) => {
      const [currentIndex, setCurrentIndex] = useState(0);
      const featuredEvents = events.slice(0, 5); // Show top 5

      useEffect(() => {
          const timer = setInterval(() => {
              setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
          }, 5000); // 5 seconds slide
          return () => clearInterval(timer);
      }, [featuredEvents.length]);

      if (featuredEvents.length === 0) return null;

      const currentEvent = featuredEvents[currentIndex];

      return (
        <div className="relative w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl mb-12 group transition-all duration-500">
            {/* Background Image with Transition */}
            <div key={currentEvent._id} className="absolute inset-0 animate-fade-in">
                <img 
                    src={currentEvent.media?.banners?.[0] || `https://source.unsplash.com/random/1600x900/?event,${currentEvent.type}`} 
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://source.unsplash.com/random/1600x900/?event,${currentEvent.type}`; }}
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[2000ms]"
                    alt={currentEvent.title}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl z-10">
                <div className="flex items-center gap-3 mb-4 animate-slide-up">
                    <span className="px-4 py-1.5 rounded-full bg-orange-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-900/20">
                        <FaFire /> Trending
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold uppercase tracking-wider border border-white/30">
                        {currentEvent.type}
                    </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
                    {currentEvent.title}
                </h1>
                
                <p className="text-gray-200 text-lg mb-8 line-clamp-2 max-w-2xl animate-slide-up" style={{ animationDelay: '200ms' }}>
                    {currentEvent.description || "Join us for an amazing experience. Book your tickets now!"}
                </p>
                
                <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <Link 
                        to={`/events/${currentEvent._id}`} 
                        className="px-8 py-3.5 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition shadow-xl flex items-center gap-2"
                    >
                        <FaTag /> Get Tickets
                    </Link>
                    <Link
                        to={`/events/${currentEvent._id}`} 
                         className="px-8 py-3.5 bg-white/10 backdrop-blur text-white font-bold rounded-xl hover:bg-white/20 transition border border-white/30 flex items-center gap-2"
                    >
                        View Details <FaChevronRight size={12} />
                    </Link>
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 right-8 flex gap-2 z-20">
                {featuredEvents.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            idx === currentIndex ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/80'
                        }`}
                    />
                ))}
            </div>
            
            {/* Side Navigation Arrows */}
            <button 
                onClick={() => setCurrentIndex(currentIndex === 0 ? featuredEvents.length - 1 : currentIndex - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 text-white backdrop-blur hover:bg-black/40 transition opacity-0 group-hover:opacity-100"
            >
                <FaChevronRight className="rotate-180" />
            </button>
            <button 
                onClick={() => setCurrentIndex((currentIndex + 1) % featuredEvents.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 text-white backdrop-blur hover:bg-black/40 transition opacity-0 group-hover:opacity-100"
            >
                <FaChevronRight />
            </button>
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] dark:bg-mirage transition-colors duration-300">
      <div className="bg-white dark:bg-bluewood border-b border-gray-200 dark:border-fiord sticky top-0 z-20 shadow-sm/50 backdrop-blur-md bg-white/90 dark:bg-bluewood/90">
         <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Discover</h1>
                  {user.role === 'organizer' && (
                      <Link to="/organizer-dashboard" className="ml-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition shadow-sm">
                          Switch to Organizer View
                      </Link>
                  )}
               </div>
               <div className="flex flex-1 max-w-2xl gap-3">
                  <div className="relative flex-1">
                     <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input 
                        type="text" 
                        placeholder="Search events, organizers, categories..." 
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-100 dark:bg-mirage border-none rounded-2xl focus:ring-2 focus:ring-teal-500 text-sm font-medium transition-all hover:bg-white dark:hover:bg-fiord/50 hover:shadow-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-lynch"
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
                            ${categoryFilter === cat ? 'bg-black dark:bg-white text-white dark:text-mirage shadow-lg scale-105' : 'bg-gray-100 dark:bg-fiord text-gray-600 dark:text-lynch hover:bg-gray-200 dark:hover:bg-fiord/80'}`}
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
                    <FeaturedCarousel events={events} />
                )}

                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {searchTerm ? `Results for "${searchTerm}"` : 
                             categoryFilter !== 'all' ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Events` : 
                             "Upcoming Events"}
                        </h2>
                        <p className="text-gray-500 dark:text-lynch mt-1">Found {filteredEvents.length} distinct experiences</p>
                    </div>
                </div>

                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredEvents.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white dark:bg-bluewood rounded-3xl border border-dashed border-gray-200 dark:border-fiord">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-fiord/30 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl grayscale opacity-50">🎪</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No events found</h3>
                        <p className="text-gray-500 dark:text-lynch max-w-md mx-auto">We couldn't find matches for your search. Try broadening your terms or checking back later.</p>
                        <button onClick={() => {setSearchTerm(""); setCategoryFilter("all")}} className="mt-8 text-teal-600 font-bold hover:underline">Clear all filters</button>
                    </div>
                )}
             </>
         )}
      </div>
    </div>
  );
}
