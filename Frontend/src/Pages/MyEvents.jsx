// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Events({ user }) {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const fetchEvents = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:5000/api/events");
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to fetch events");

//       const userEvents = data.events.filter(
//         (e) => e.host === user?._id || e.host?._id === user?._id
//       );
//       setEvents(userEvents);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, [user]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this event?")) return;
//     try {
//       const res = await fetch(`http://localhost:5000/api/events/${id}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to delete");
//       setEvents(events.filter((e) => e._id !== id));
//       toast.success("Event deleted successfully!");
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   const handleUpdate = (id) => {
//     navigate(`/create-event?id=${id}`);
//     toast.info("Redirecting to update event...");
//   };

//   const handleShare = async (event) => {
//     const shareUrl = window.location.origin + `/events/${event._id}`;
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: event.title,
//           text: event.description || "",
//           url: shareUrl,
//         });
//       } catch {
//         // user cancelled share, no need for error
//       }
//     } else {
//       try {
//         await navigator.clipboard.writeText(shareUrl);
//         toast.success("Event link copied to clipboard!");
//       } catch {
//         toast.info(`Copy this link: ${shareUrl}`);
//       }
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <ToastContainer />
//       <h2 className="text-2xl font-bold mb-6">Your Events</h2>

//       {loading && <p>Loading events...</p>}
//       {error && <p className="text-red-500">{error}</p>}
//       {events.length === 0 && !loading && (
//         <div className="text-center py-10">
//           <p className="text-gray-600 mb-4">No events created yet.</p>
//           <button
//             onClick={() => navigate("/create-event")}
//             className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
//           >
//             Create Event
//           </button>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {events.map((event) => (
//           <div
//             key={event._id}
//             className="border rounded-lg p-5 shadow hover:shadow-md transition relative bg-white"
//           >
//             <div className="flex justify-between items-start">
//               <div>
//                 <h3 className="text-lg font-semibold">{event.title}</h3>
//                 <p className="text-gray-600">{event.description}</p>
//               </div>
//               <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
//                 {event.privacy || "published"}
//               </span>
//             </div>

//             <div className="flex justify-between mt-3 text-gray-500 text-sm">
//               <div className="flex items-center gap-1">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z"
//                   />
//                 </svg>
//                 {new Date(event.start).toLocaleDateString()}
//               </div>
//               <div className="flex items-center gap-1">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4l3 3"
//                   />
//                 </svg>
//                 {new Date(event.start).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </div>
//             </div>

//             <div className="flex justify-between mt-1 text-gray-500 text-sm">
//               <div className="flex items-center gap-1">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 11c0 4-3 7-7 7s-7-3-7-7 3-7 7-7 7 3 7 7z"
//                   />
//                 </svg>
//                 {event.location?.address || "N/A"}
//               </div>
//               <div className="flex items-center gap-1">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//                 {event.attendees
//                   ? `${event.attendees.length}/500`
//                   : `0/500`}
//               </div>
//             </div>

//             <div className="mt-3 flex flex-wrap gap-2">
//               {event.tags?.map((tag) => (
//                 <span
//                   key={tag}
//                   className="bg-gray-200 text-xs px-2 py-1 rounded"
//                 >
//                   {tag}
//                 </span>
//               ))}
//             </div>

//             <div className="mt-4 flex flex-wrap gap-2">
//               <button
//                 onClick={() => handleUpdate(event._id)}
//                 className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
//               >
//                 Update
//               </button>
//               <button
//                 onClick={() => handleDelete(event._id)}
//                 className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
//               >
//                 Delete
//               </button>
//               <button
//                 onClick={() => navigate(`/events/${event._id}`)}
//                 className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-600"
//               >
//                 View Details
//               </button>
//               <button
//                 onClick={() => handleShare(event)}
//                 className="bg-indigo-500 px-3 py-1 rounded text-white hover:bg-indigo-600"
//               >
//                 Share
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

        const res = await fetch("http://localhost:5000/api/events", {
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
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
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

  if (loading) return <p className="text-center mt-8">Loading your events...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
        <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">My Events</h2>
      {events.length === 0 && !loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
          <button 
            onClick={() => navigate("/create-event")} 
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        events.map((event) => (
          <div
            key={event._id}
            className="border rounded p-4 mb-4 shadow hover:shadow-lg transition bg-white"
          >
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <p className="text-gray-600 mt-1">{event.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(event.start).toLocaleString()} -{" "}
              {new Date(event.end).toLocaleString()}
            </p>
            <p className="mt-1 text-gray-500">
              Location: {event.location.address}
            </p>
            <div className="mt-3 flex gap-2 flex-wrap">
              {event.tags?.map((tag) => (
                <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2 border-t pt-3">
              <button
                onClick={() => navigate(`/events/${event._id}`)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                View Details
              </button>
              <button
                onClick={() => handleUpdate(event._id)}
                className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => handleShare(event)}
                className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
              >
                Share
              </button>
            </div>
          </div>
        ))
      )}
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

