import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import CreatePollModal from "../components/CreatePollModal";
import NotificationDropdown from "../components/NotificationDropdown";
import { 
    FaCalendarAlt, FaUsers, FaChartLine, FaCog, FaPlus, 
    FaSearch, FaBell, FaSignOutAlt, FaBullhorn, FaMoneyBill, FaCompass, FaEnvelope,
    FaTrash, FaEdit, FaShareAlt, FaPoll, FaCommentDots, FaMapMarkerAlt
} from "react-icons/fa";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalRegistrations: 0, activeEvents: 0, pageViews: 0 });
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "Organizer" });
  const [activeTab, setActiveTab] = useState("overview"); 
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showPollModal, setShowPollModal] = useState(false);
  const navigate = useNavigate();

  // --- Actions ---
  const handleDeleteEvent = async (id) => {
      if(!window.confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
      try {
          const token = localStorage.getItem("userToken");
          await axios.delete(`${window.API_BASE_URL}/api/events/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setEvents(prev => prev.filter(e => e._id !== id));
          alert("Event deleted successfully");
      } catch (err) {
          console.error(err);
          alert("Failed to delete event");
      }
  };

  const handleSendReminder = async (eventId) => {
      if(!eventId) return alert("Please select an event first.");
      if(!window.confirm("Send email reminders to all attendees of this event?")) return;
      try {
          const token = localStorage.getItem("userToken");
          const res = await axios.post(window.API_BASE_URL + "/api/notifications/send-event-reminder", { eventId }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          alert(res.data.message);
      } catch (err) {
          console.error(err);
          alert("Failed to send reminders");
      }
  };

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) return;
        
        const decodedToken = jwtDecode(token);
        setUser({ name: decodedToken.name || "Organizer" });

        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Events (MY events only)
        const eventsRes = await axios.get(window.API_BASE_URL + "/api/events/my-events", { headers });
        setEvents(eventsRes.data.events);

        // 2. Fetch Stats
        const statsRes = await axios.get(window.API_BASE_URL + "/api/analytics/organizer/stats", { headers });
        setStats(statsRes.data);

        // 3. Fetch Attendees (Lazy load or fetch now? Let's fetch now for simplicity)
        const attendeesRes = await axios.get(window.API_BASE_URL + "/api/analytics/organizer/attendees", { headers });
        setAttendees(attendeesRes.data.attendees);

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const SidebarItem = ({ id, icon, label }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-4
            ${activeTab === id 
                ? 'bg-blue-50 border-blue-600 text-blue-700' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
    >
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[var(--color-bg-base)] overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20 shadow-lg">
        <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 text-blue-900">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-blue-200">
                    E
                </div>
                <span className="font-bold text-xl tracking-tight">EventPro</span>
            </div>
        </div>

        <div className="flex-1 py-6 space-y-1 overflow-y-auto">
            <SidebarItem id="overview" icon={<FaChartLine />} label="Overview" />
            <SidebarItem id="events" icon={<FaCalendarAlt />} label="My Events" />
            <SidebarItem id="attendees" icon={<FaUsers />} label="Attendees" />
            <SidebarItem id="marketing" icon={<FaBullhorn />} label="Marketing" />
            <SidebarItem id="finance" icon={<FaMoneyBill />} label="Finance" />
            <div className="pt-6 mt-6 border-t border-gray-100">
                <SidebarItem id="settings" icon={<FaCog />} label="Settings" />
            </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
             <Link to="/dashboard" className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                <FaCompass /> Switch to Attendee View
             </Link>

             <div className="flex items-center gap-3 p-2 rounded-xl border border-gray-200 bg-white">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-500 truncate uppercase tracking-wider">Organizer</p>
                </div>
                <button onClick={() => { localStorage.removeItem('userToken'); navigate('/login'); }} className="text-gray-400 hover:text-red-500">
                    <FaSignOutAlt />
                </button>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
         
         {/* Top Header */}
         <header className="h-20 bg-white border-b border-gray-200 flex justify-between items-center px-8 shadow-sm z-10">
             <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
             
             <div className="flex items-center gap-6">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 w-64 text-sm"
                    />
                </div>
                <NotificationDropdown user={user} />
                <Link to="/create-event" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                    <FaPlus /> Create Event
                </Link>
             </div>
         </header>

         {/* Dashboard Content */}
         <div className="flex-1 overflow-y-auto p-8">
            
            {/* --- OVERVIEW TAB --- */}
            {activeTab === 'overview' && (
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: "Total Revenue", value: `₹${stats.totalRevenue}`, change: "Real-time", color: "emerald", icon: <FaMoneyBill /> },
                            { label: "Total Registrations", value: stats.totalRegistrations, change: "Real-time", color: "blue", icon: <FaUsers /> },
                            { label: "Active Events", value: stats.activeEvents, change: "Live", color: "indigo", icon: <FaCalendarAlt /> },
                            { label: "Page Views", value: stats.pageViews, change: "Est.", color: "purple", icon: <FaChartLine /> },
                        ].map((stat, idx) => (
                           <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                               <div className="flex justify-between items-start mb-4">
                                   <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 text-xl`}>
                                       {stat.icon}
                                   </div>
                                   <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                       {stat.change}
                                   </span>
                               </div>
                               <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                               <p className="text-gray-500 text-sm">{stat.label}</p>
                           </div>
                        ))}
                    </div>

                    {/* Recent Events Table (Reused from before) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Your Events</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Event Name</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Privacy</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {events.map(event => (
                                        <tr key={event._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(event.start).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase">Active</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${event.privacy === 'public' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {event.privacy}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button onClick={() => navigate(`/edit-event/${event._id}`)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Manage</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- EVENTS TAB --- */}
            {activeTab === 'events' && (
                <div className="grid grid-cols-1 gap-6">
                     <div className="flex justify-between items-center mb-4">
                         <h2 className="text-xl font-bold">My Managed Events</h2>
                         <Link to="/create-event" className="text-blue-600 font-bold hover:underline">+ Create New</Link>
                     </div>
                     {events.length === 0 && <p className="text-gray-500">You haven't created any events yet.</p>}
                     
                     {events.map(event => (
                         <div key={event._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
                             <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-2">
                                     <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                                     <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${event.privacy === 'private' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                         {event.privacy}
                                     </span>
                                 </div>
                                 <p className="text-gray-500 flex items-center gap-2 mb-1">
                                     <FaCalendarAlt className="text-gray-400" /> {new Date(event.start).toLocaleString()}
                                 </p>
                                 <p className="text-gray-500 flex items-center gap-2">
                                     <FaMapMarkerAlt className="text-gray-400" /> {event.location?.address || 'Online'}
                                 </p>
                             </div>
                             
                             {/* Actions Toolbar */}
                             <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                                 {/* Primary Action: Edit */}
                                 <Link 
                                    to={`/edit-event/${event._id}`} 
                                    className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg font-bold hover:bg-orange-100 transition shadow-sm"
                                 >
                                     <FaEdit /> <span>Edit Event</span>
                                 </Link>

                                 {/* Engagement Actions */}
                                 <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                                     <button 
                                        onClick={() => setSelectedEventId(event._id) || setShowPollModal(true)}
                                        className="p-2 text-indigo-600 hover:bg-white rounded-md transition flex items-center gap-1 text-xs font-bold"
                                        title="Create Poll"
                                     >
                                         <FaPoll /> Poll
                                     </button>
                                     <div className="w-[1px] bg-gray-200 mx-1"></div>
                                     <Link 
                                        to={`/events/${event._id}`} 
                                        className="p-2 text-teal-600 hover:bg-white rounded-md transition flex items-center gap-1 text-xs font-bold"
                                        title="Discussion"
                                     >
                                         <FaCommentDots /> Chat
                                     </Link>
                                 </div>

                                 {/* Share & Delete */}
                                 <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/events/${event._id}`);
                                        alert("Event link copied!");
                                    }}
                                    className="p-2.5 text-gray-400 hover:text-blue-600 transition border border-transparent hover:border-blue-100 rounded-lg"
                                    title="Share Link"
                                 >
                                     <FaShareAlt />
                                 </button>

                                 <button 
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="p-2.5 text-gray-400 hover:text-red-600 transition border border-transparent hover:border-red-100 rounded-lg"
                                    title="Delete Event"
                                 >
                                     <FaTrash />
                                 </button>
                             </div>
                         </div>
                     ))}
                </div>
            )}

            {/* --- ATTENDEES TAB --- */}
            {activeTab === 'attendees' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between">
                        <h3 className="text-lg font-bold text-gray-900">All Attendees ({attendees.length})</h3>
                        <button className="text-blue-600 text-sm font-bold">Export CSV</button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Total Spent</th>
                                <th className="px-6 py-4">Events Attended</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {attendees.map(att => (
                                <tr key={att._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{att.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{att.email}</td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">₹{att.totalSpent}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {att.eventsAttended.map(e => e.eventTitle).join(", ")}
                                    </td>
                                </tr>
                            ))}
                            {attendees.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No attendees yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- MARKETING TAB --- */}
            {activeTab === 'marketing' && (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            <FaBullhorn />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Campaigns</h2>
                        <p className="text-gray-500 mb-8">Send updates, reminders, and newsletters to your audience.</p>
                        
                        <div className="text-left max-w-lg mx-auto bg-gray-50 p-6 rounded-xl">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Select Event to Blast</label>
                            <select 
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                                onChange={(e) => setSelectedEventId(e.target.value)}
                            >
                                <option value="">-- Select Event --</option>
                                {events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                            </select>
                            <button 
                                onClick={() => handleSendReminder(selectedEventId)}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
                            >
                                Send Reminder Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- FINANCE TAB --- */}
            {activeTab === 'finance' && (
                 <div className="max-w-4xl mx-auto space-y-6">
                     <div className="bg-emerald-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                         <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">₹{stats.totalRevenue}</h2>
                            <p className="opacity-90">Total Revenue Collected</p>
                         </div>
                         <FaMoneyBill className="absolute -right-6 -bottom-6 text-9xl text-white opacity-20" />
                     </div>

                     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                         <h3 className="font-bold text-gray-900 mb-4">Revenue Breakdown by Event</h3>
                         {events.map(event => (
                             <div key={event._id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                                 <div>
                                     <p className="font-bold text-gray-800">{event.title}</p>
                                     <p className="text-xs text-gray-500">{new Date(event.start).toLocaleDateString()}</p>
                                 </div>
                                 <span className="font-mono text-gray-600">Calculated from Ticket Sales</span>
                             </div>
                         ))}
                     </div>
                 </div>
            )}

            {/* --- SETTINGS TAB --- */}
            {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Organizer Name</label>
                            <input type="text" value={user.name} readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input type="email" value={user.email || "organizer@example.com"} readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
                        </div>
                        
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Branding</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-4 border border-dashed border-gray-300 rounded-xl flex flex-col items-center gap-2 text-gray-500 hover:border-blue-500 hover:text-blue-600 transition">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">📷</div>
                                    <span className="text-sm font-bold">Upload Logo</span>
                                </button>
                                <button className="p-4 border border-dashed border-gray-300 rounded-xl flex flex-col items-center gap-2 text-gray-500 hover:border-blue-500 hover:text-blue-600 transition">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">🎨</div>
                                    <span className="text-sm font-bold">Theme Color</span>
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                             <button onClick={() => alert("Settings Saved Successfully!")} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
            
         </div>
      </main>
       {/* Poll Modal */}
       {showPollModal && selectedEventId && (
           <CreatePollModal 
               eventId={selectedEventId}
               onClose={() => setShowPollModal(false)}
               onSuccess={() => alert("Poll Created Successfully!")}
           />
       )}
    </div>
  );
}
