import { useState, useEffect } from 'react';
import { FaUsers, FaChartLine, FaBookmark, FaDollarSign } from 'react-icons/fa';

export default function AnalyticsDashboard({ eventId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`http://localhost:5000/api/analytics/events/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            setStats(await res.json());
        }
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [eventId]);

  if (loading) return <div className="p-8 text-center bg-gray-50 rounded-2xl">Loading Analytics...</div>;
  if (!stats) return <div className="p-8 text-center bg-gray-50 rounded-2xl">Unable to load analytics data.</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                 <FaUsers />
             </div>
             <div>
                 <p className="text-gray-500 text-sm font-medium">Total Attendees</p>
                 <h3 className="text-2xl font-bold text-gray-900">{stats.totalAttendees}</h3>
             </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold">
                 <FaDollarSign />
             </div>
             <div>
                 <p className="text-gray-500 text-sm font-medium">Est. Revenue</p>
                 <h3 className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</h3>
             </div>
         </div>
      </div>

      {/* Charts / Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaChartLine className="text-indigo-500"/> Top Sessions (Bookmarks)
              </h3>
              <div className="space-y-4">
                  {stats.sessions.length === 0 && <p className="text-gray-400">No session data yet.</p>}
                  {stats.sessions.map((s, idx) => (
                      <div key={idx} className="relative">
                          <div className="flex justify-between items-center mb-1 relative z-10">
                              <span className="font-medium text-gray-700">{s.title}</span>
                              <span className="text-sm font-bold text-indigo-600">{s.bookmarks} <FaBookmark className="inline text-xs mb-0.5 ml-1"/></span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(100, (s.bookmarks / (stats.totalAttendees || 1)) * 100)}%` }} // Normalized somewhat
                              ></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}
