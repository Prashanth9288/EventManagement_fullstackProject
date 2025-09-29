import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function EventDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rsvps, setRsvps] = useState([]);
  const [activeTab, setActiveTab] = useState("discussion");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch Event, RSVPs, and Comments in parallel
        const [eventRes, rsvpRes] = await Promise.all([
          fetch(`http://localhost:5000/api/events/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/rsvps/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (!eventRes.ok) {
          const errorData = await eventRes.json();
          throw new Error(errorData.error || "Failed to fetch event details");
        }
        const eventData = await eventRes.json();
        setEvent(eventData);
        setComments(eventData.comments || []); // Assuming comments are part of event data

        if (rsvpRes.ok) {
          const rsvpData = await rsvpRes.json();
          setRsvps(rsvpData);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDetails();
  }, [id, navigate]);

  const handleRsvp = async (status) => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`http://localhost:5000/api/rsvps/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to RSVP");
      }
      const newRsvp = await res.json();
      // Update the RSVPs list
      setRsvps(prevRsvps => {
        const existingRsvpIndex = prevRsvps.findIndex(r => r.userId._id === newRsvp.userId);
        if (existingRsvpIndex > -1) {
          const updatedRsvps = [...prevRsvps];
          updatedRsvps[existingRsvpIndex] = { ...updatedRsvps[existingRsvpIndex], status: newRsvp.status };
          return updatedRsvps;
        } else {
          // This part might need adjustment based on how your backend sends back the user object on new RSVP
          return [...prevRsvps, { ...newRsvp, userId: { _id: newRsvp.userId, name: user.name, email: user.email }}];
        }
      });
      toast.success(`You have RSVP'd as ${status}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePostComment = async (e) => {
      e.preventDefault();
      if (!comment.trim()) return;

      try {
          const token = localStorage.getItem("userToken");
          const res = await fetch(`http://localhost:5000/api/events/${id}/comments`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ text: comment }),
          });

          if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Failed to post comment");
          }

          const newComment = await res.json();
          setComments(prevComments => [newComment, ...prevComments]);
          setComment("");
          toast.success("Comment posted!");
      } catch (err) {
          toast.error(err.message);
      }
  };

  if (loading) return <p className="text-center mt-8">Loading event details...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
  if (!event) return <p className="text-center mt-8">Event not found.</p>;

  // RSVP Counts
  const rsvpCounts = {
    yes: rsvps.filter(r => r.status === 'yes').length,
    maybe: rsvps.filter(r => r.status === 'maybe').length,
    no: rsvps.filter(r => r.status === 'no').length,
  };
  const userRsvp = rsvps.find(r => r.userId._id === user._id);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <button onClick={() => navigate(-1)} className="text-indigo-600 hover:text-indigo-800 mb-4">
          &larr; Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{event.privacy}</span>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">upcoming</span>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                {/* Share Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
              </button>
            </div>
            <h1 className="text-3xl font-bold mt-2">{event.title}</h1>
            <p className="text-gray-600 mt-1">Hosted by {event.host?.name || 'Unknown'}</p>
            <div className="flex flex-wrap text-gray-500 mt-4 gap-x-6 gap-y-2">
              <p>🗓️ {formatDate(event.start)}</p>
              <p>📍 {event.location.address}</p>
              <p>👥 {rsvps.length}/{event.capacity || 'Unlimited'}</p>
            </div>
            <p className="mt-4 text-gray-700">{event.description}</p>

            {/* Tabs */}
            <div className="border-b border-gray-200 mt-6">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('discussion')} className={`${activeTab === 'discussion' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                  Discussion
                </button>
                <button onClick={() => setActiveTab('attendees')} className={`${activeTab === 'attendees' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                  Attendees
                </button>
                <button onClick={() => setActiveTab('updates')} className={`${activeTab === 'updates' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                  Updates
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'discussion' && (
                <div>
                  <form onSubmit={handlePostComment}>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Join the conversation..."
                      className="w-full p-2 border rounded-md"
                      rows="3"
                    ></textarea>
                    <button type="submit" className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                      Post Comment
                    </button>
                  </form>
                  <div className="mt-6 space-y-4">
                    {comments.length > 0 ? comments.map(c => (
                      <div key={c._id} className="flex space-x-3">
                        {/* Avatar placeholder */}
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
                          {c.user?.name.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="font-semibold">{c.user?.name || 'Anonymous'}</p>
                          <p>{c.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(c.createdAt)}</p>
                        </div>
                      </div>
                    )) : <p>No comments yet.</p>}
                  </div>
                </div>
              )}
              {activeTab === 'attendees' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-green-100 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-green-800">{rsvpCounts.yes}</p>
                      <p className="text-green-700">Attending</p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-800">{rsvpCounts.maybe}</p>
                      <p className="text-yellow-700">Maybe</p>
                    </div>
                    <div className="bg-red-100 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-red-800">{rsvpCounts.no}</p>
                      <p className="text-red-700">Can't Attend</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mt-6 mb-4">RSVP Responses</h3>
                  <div className="space-y-4">
                    {rsvps.map(r => (
                      <div key={r._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
                              {r.userId.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{r.userId.name}</p>
                            <p className="text-sm text-gray-500">{r.userId.email}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          r.status === 'yes' ? 'bg-green-200 text-green-800' :
                          r.status === 'maybe' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'updates' && (
                <div className="text-center py-10">
                  <p className="text-gray-500">No updates yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg">RSVP Status</h3>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <button onClick={() => handleRsvp('yes')} className={`p-2 rounded-md text-center border-2 ${userRsvp?.status === 'yes' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>Yes ({rsvpCounts.yes})</button>
                <button onClick={() => handleRsvp('maybe')} className={`p-2 rounded-md text-center border-2 ${userRsvp?.status === 'maybe' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}>Maybe ({rsvpCounts.maybe})</button>
                <button onClick={() => handleRsvp('no')} className={`p-2 rounded-md text-center border-2 ${userRsvp?.status === 'no' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>No ({rsvpCounts.no})</button>
              </div>
              {userRsvp && <p className="text-center mt-3 text-sm text-gray-600">You responded: <span className="font-semibold">{userRsvp.status}</span></p>}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-lg">Event Card Preview</h3>
              <div className="mt-4 border-t pt-4">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{event.privacy}</span>
                  <h4 className="font-semibold mt-2">{event.title}</h4>
                  <p className="text-sm text-gray-500">{formatDate(event.start)}</p>
                  <p className="text-sm text-gray-500">📍 {event.location.address}</p>
                  <p className="text-sm text-gray-500">👥 Hosted by {event.host?.name || 'Unknown'}</p>
                  <div className="text-sm mt-2">
                    <span className="text-green-600">● {rsvpCounts.yes} Yes</span>
                    <span className="text-yellow-600 ml-2">● {rsvpCounts.maybe} Maybe</span>
                    <span className="text-red-600 ml-2">● {rsvpCounts.no} No</span>
                  </div>
                  <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>
       {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-lg">
                  📅
                </div>
                <h3 className="font-semibold text-xl text-gray-800">
                  EventHub
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Creating amazing event experiences through innovative design and
                technology.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-6 text-lg">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Event Manager
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-6 text-lg">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-6 text-lg">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600">
              © 2025 EventHub. All rights reserved.
            </div>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


