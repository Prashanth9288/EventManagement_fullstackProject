import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import Footer from '../components/Footer';
import ChatWindow from '../components/ChatWindow';
import { FaUserPlus, FaCheck, FaTimes, FaSearch, FaUserFriends, FaLinkedin, FaTwitter, FaGlobe, FaCommentDots } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

export default function NetworkingHub() {
  const [attendees, setAttendees] = useState([]);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  
  // Chat State
  const [chatUser, setChatUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
        setCurrentUser(jwtDecode(token));
    }
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };

      const [attendeesRes, meRes] = await Promise.all([
        fetch(window.API_BASE_URL + '/api/networking/attendees', { headers }),
        fetch(window.API_BASE_URL + '/api/networking/me', { headers })
      ]);

      if (attendeesRes.ok) setAttendees(await attendeesRes.json());
      if (meRes.ok) {
        const meData = await meRes.json();
        setConnections(meData.connections);
        setRequests(meData.requests);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load networking data");
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (userId) => {
      try {
          const token = localStorage.getItem("userToken");
          const res = await fetch(`${window.API_BASE_URL}/api/networking/connect/${userId}`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) {
              toast.success("Request sent!");
              // Optimistically update UI? For now just refresh or disable button
              setAttendees(prev => prev.map(u => u._id === userId ? {...u, requestSent: true} : u));
          } else {
              toast.error(data.error);
          }
      } catch (err) {
          toast.error("Error sending request");
      }
  };

  const acceptRequest = async (userId) => {
      try {
          const token = localStorage.getItem("userToken");
          const res = await fetch(`${window.API_BASE_URL}/api/networking/accept/${userId}`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
              toast.success("Connected!");
              fetchNetworkData(); // Refresh everything
          }
      } catch (err) {
          toast.error("Error accepting request");
      }
  };

  const filteredAttendees = attendees.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.networkingProfile?.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.networkingProfile?.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="min-h-screen pt-20 flex justify-center items-center">Loading Network...</div>;

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex flex-col pt-10">
      <ToastContainer />
      
      {/* Chat Window Overlay */}
      {chatUser && currentUser && (
          <ChatWindow 
              currentUser={currentUser} 
              otherUser={chatUser} 
              onClose={() => setChatUser(null)} 
          />
      )}

      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 py-16 text-center text-white relative overflow-hidden rounded-3xl mx-6 mt-6">
          <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1600x400/?people,network')] opacity-10 bg-cover bg-center"></div>
          <h1 className="text-4xl font-bold mb-4 relative z-10">Networking Hub</h1>
          <p className="text-xl opacity-90 relative z-10">Connect, Collaborate, and Grow your network.</p>
      </div>

      <div className="container mx-auto px-6 py-12 flex-1">
        
        {/* Tabs */}
        <div className="flex justify-center mb-12">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-200 inline-flex">
                <button 
                  onClick={() => setActiveTab('discover')}
                  className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'discover' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                   Discover
                </button>
                <button 
                  onClick={() => setActiveTab('connections')}
                  className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'connections' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                   My Connections 
                   {requests.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{requests.length}</span>}
                </button>
            </div>
        </div>

        {activeTab === 'discover' && (
            <div className="animate-fade-in">
                {/* Search */}
                <div className="max-w-2xl mx-auto mb-10 relative">
                   <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input 
                      type="text" 
                      placeholder="Search by name, role, or interests..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {filteredAttendees.map(user => {
                       const isConnected = connections.some(c => c._id === user._id);
                       const isPending = user.requestSent; // Simplified local check
                       const hasIncomingRequest = requests.some(r => r.from._id === user._id);

                       if (isConnected) return null; // Filter out already connected in discover tab often (optional)

                       return (
                           <div key={user._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center group">
                               <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 mb-4 overflow-hidden p-1">
                                   <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-indigo-400">
                                       {user.name[0]}
                                   </div>
                               </div>
                               <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
                               <p className="text-sm text-gray-500 mb-4 font-mono">{user.role}</p>
                               
                               {user.networkingProfile?.bio && (
                                   <p className="text-gray-600 text-sm mb-4 line-clamp-2 px-4 h-10">{user.networkingProfile.bio}</p>
                               )}

                               {user.networkingProfile?.tags && (
                                   <div className="flex flex-wrap gap-2 justify-center mb-6">
                                       {user.networkingProfile.tags.slice(0,3).map((tag, i) => (
                                           <span key={i} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">{tag}</span>
                                       ))}
                                   </div>
                               )}
                               
                               <div className="mt-auto w-full pt-4 border-t border-gray-50">
                                   {hasIncomingRequest ? (
                                       <button onClick={() => acceptRequest(user._id)} className="w-full py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition">Accept Request</button>
                                   ) : (
                                       <button 
                                         onClick={() => sendConnectionRequest(user._id)} 
                                         disabled={isPending}
                                         className={`w-full py-2 rounded-xl font-bold transition flex items-center justify-center gap-2 ${isPending ? 'bg-gray-100 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20'}`}
                                       >
                                           {isPending ? 'Request Sent' : <><FaUserPlus /> Connect</>}
                                       </button>
                                   )}
                               </div>
                           </div>
                       );
                   })}
                </div>
            </div>
        )}

        {activeTab === 'connections' && (
            <div className="animate-fade-in max-w-4xl mx-auto space-y-12">
                {/* Requests */}
                {requests.length > 0 && (
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Pending Requests</h3>
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            {requests.map(req => (
                                <div key={req._id} className="p-4 border-b border-gray-50 flex items-center justify-between last:border-0 hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {req.from.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{req.from.name}</h4>
                                            <p className="text-xs text-gray-500">wants to connect</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => acceptRequest(req.from._id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"><FaCheck /></button> 
                                        <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"><FaTimes /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Connections List */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Connections ({connections.length})</h3>
                    {connections.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-400">No connections yet. Go to Discover to find people!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {connections.map(conn => (
                                <div key={conn._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                                     <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                         {conn.name[0]}
                                     </div>
                                     <div className="flex-1">
                                         <h4 className="font-bold text-gray-900">{conn.name}</h4>
                                         <div className="flex gap-2 mt-1">
                                             {/* Dummy socials */}
                                             <button className="text-gray-300 hover:text-blue-600"><FaLinkedin /></button>
                                             <button className="text-gray-300 hover:text-sky-500"><FaTwitter /></button>
                                             <button className="text-gray-300 hover:text-gray-600"><FaGlobe /></button>
                                         </div>
                                     </div>
                                     <button 
                                        onClick={() => setChatUser(conn)}
                                        className="px-3 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-100 transition flex items-center gap-1"
                                     >
                                         <FaCommentDots /> Chat
                                     </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
