// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function Dashboard() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState({ name: "Demo User" });

//   useEffect(() => {
//     // Fetch events (replace with your backend API)
//     const fetchEvents = async () => {
//       try {
//         const token = localStorage.getItem("userToken");
//         const res = await axios.get("http://localhost:5000/api/events", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setEvents(res.data.events || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h2 className="text-gray-500">Total Events</h2>
//           <p className="text-2xl font-bold">{events.length}</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h2 className="text-gray-500">Upcoming Events</h2>
//           <p className="text-2xl font-bold">
//             {events.filter(event => new Date(event.start) > new Date()).length}
//           </p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h2 className="text-gray-500">Past Events</h2>
//           <p className="text-2xl font-bold">
//             {events.filter(event => new Date(event.start) <= new Date()).length}
//           </p>
//         </div>
//       </div>

//       {/* Event List */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4">Your Events</h2>
//         {loading ? (
//           <p>Loading events...</p>
//         ) : events.length === 0 ? (
//           <p>No events found. Create one!</p>
//         ) : (
//           <ul className="space-y-4">
//             {events.map(event => (
//               <li key={event._id} className="border p-4 rounded hover:bg-gray-50 transition">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h3 className="font-semibold text-lg">{event.title}</h3>
//                     <p className="text-gray-500 text-sm">{new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}</p>
//                   </div>
//                   <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">{event.privacy}</span>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "Demo User" });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          setUser({ name: decodedToken.name || "User" });
        }

        const res = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data.events);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {`${user.name}`}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500">Total Events</h2>
          <p className="text-2xl font-bold">{events.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500">Upcoming Events</h2>
          <p className="text-2xl font-bold">
            {
              events.filter((event) => new Date(event.start) > new Date())
                .length
            }
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500">Past Events</h2>
          <p className="text-2xl font-bold">
            {
              events.filter((event) => new Date(event.start) < new Date())
                .length
            }
          </p>
        </div>
      </div>

      {/* Event List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Your Events</h2>
        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events found. Create one!</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event._id}
                className="border p-4 rounded hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(event.start).toLocaleString()} -{" "}
                      {new Date(event.end).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 bg-indigo-100 text-indigo-700 rounded`}
                  >
                    {event.privacy}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
