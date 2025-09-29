// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// export default function CreateEvent() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const eventId = searchParams.get("id");

//   // Get current logged-in user from localStorage
//   const currentUser = JSON.parse(localStorage.getItem("user"));

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     tags: [],
//     privacy: "public",
//     start: "",
//     end: "",
//     timezone: "UTC",
//     location: { address: "", lat: "", lng: "", placeId: "" },
//   });

//   const [tagInput, setTagInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch existing event for editing
//   useEffect(() => {
//     if (!eventId) return;

//     const fetchEvent = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/events/${eventId}`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || "Failed to fetch event");

//         setFormData({
//           title: data.title || "",
//           description: data.description || "",
//           tags: data.tags || [],
//           privacy: data.privacy || "public",
//           start: data.start ? data.start.slice(0, 16) : "",
//           end: data.end ? data.end.slice(0, 16) : "",
//           timezone: data.timezone || "UTC",
//           location: data.location || {
//             address: "",
//             lat: "",
//             lng: "",
//             placeId: "",
//           },
//         });
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchEvent();
//   }, [eventId]);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (["address", "lat", "lng", "placeId"].includes(name)) {
//       setFormData((prev) => ({
//         ...prev,
//         location: { ...prev.location, [name]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Handle tags
//   const handleAddTag = () => {
//     if (tagInput && !formData.tags.includes(tagInput)) {
//       setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput] }));
//       setTagInput("");
//     }
//   };
//   const handleRemoveTag = (tag) => {
//     setFormData((prev) => ({
//       ...prev,
//       tags: prev.tags.filter((t) => t !== tag),
//     }));
//   };

//   // Submit event
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       if (!currentUser || !currentUser._id) {
//         throw new Error("User not logged in");
//       }

//       const payload = {
//         ...formData,
//         host: currentUser._id, // Assign current user as host
//       };

//       const url = eventId
//         ? `http://localhost:5000/api/events/${eventId}`
//         : "http://localhost:5000/api/events";
//       const method = eventId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to submit event");

//       navigate("/events");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
//       <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
//         <h2 className="text-2xl font-bold mb-4">
//           {eventId ? "Update Event" : "Create Event"}
//         </h2>
//         {error && <p className="text-red-500 mb-2">{error}</p>}
//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="title"
//             placeholder="Event Title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded"
//           />
//           <textarea
//             name="description"
//             placeholder="Description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//           />

//           {/* Tags */}
//           <div>
//             <div className="flex gap-2 mb-2">
//               <input
//                 type="text"
//                 value={tagInput}
//                 onChange={(e) => setTagInput(e.target.value)}
//                 placeholder="Add tag"
//                 className="border p-2 rounded flex-1"
//               />
//               <button
//                 type="button"
//                 onClick={handleAddTag}
//                 className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700"
//               >
//                 Add
//               </button>
//             </div>
//             <div className="flex gap-2 flex-wrap">
//               {formData.tags.map((tag) => (
//                 <span
//                   key={tag}
//                   className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
//                 >
//                   {tag}
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveTag(tag)}
//                     className="text-red-500 font-bold"
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Privacy */}
//           <select
//             name="privacy"
//             value={formData.privacy}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//           >
//             <option value="public">Public</option>
//             <option value="private">Private</option>
//             <option value="rsvp">RSVP</option>
//           </select>

//           {/* Start/End */}
//           <div className="flex gap-2">
//             <input
//               type="datetime-local"
//               name="start"
//               value={formData.start}
//               onChange={handleChange}
//               required
//               className="w-1/2 p-2 border rounded"
//             />
//             <input
//               type="datetime-local"
//               name="end"
//               value={formData.end}
//               onChange={handleChange}
//               required
//               className="w-1/2 p-2 border rounded"
//             />
//           </div>

//           {/* Location */}
//           <input
//             type="text"
//             name="address"
//             placeholder="Address"
//             value={formData.location.address}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded"
//           />
//           <div className="flex gap-2">
//             <input
//               type="number"
//               step="any"
//               name="lat"
//               placeholder="Latitude"
//               value={formData.location.lat}
//               onChange={handleChange}
//               required
//               className="w-1/2 p-2 border rounded"
//             />
//             <input
//               type="number"
//               step="any"
//               name="lng"
//               placeholder="Longitude"
//               value={formData.location.lng}
//               onChange={handleChange}
//               required
//               className="w-1/2 p-2 border rounded"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
//           >
//             {loading
//               ? eventId
//                 ? "Updating..."
//                 : "Creating..."
//               : eventId
//               ? "Update Event"
//               : "Create Event"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("id");

  // Get user info and token from localStorage
  const token = localStorage.getItem("userToken");
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("userData"));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    privacy: "public",
    start: "",
    end: "",
    timezone: "UTC",
    location: {
      address: "",
      lat: "",
      lng: "",
      placeId: "",
    },
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (eventId) {
      const fetchEvent = async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/api/events/${eventId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || "Failed to fetch event");
          }
          setFormData({
            title: data.title || "",
            description: data.description || "",
            tags: data.tags || [],
            privacy: data.privacy || "public",
            start: data.start ? data.start.slice(0, 16) : "",
            end: data.end ? data.end.slice(0, 16) : "",
            timezone: data.timezone || "UTC",
            location: data.location || {
              address: "",
              lat: "",
              lng: "",
              placeId: "",
            },
          });
        } catch (err) {
          setError(err.message);
        }
      };
      fetchEvent();
    }
  }, [eventId, navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["address", "lat", "lng", "placeId"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!user || !user._id) {
        throw new Error(
          "User not logged in. Please log in to create an event."
        );
      }

      const payload = {
        ...formData,
        host: user._id, // Assign current user as host
      };

      const url = eventId
        ? `http://localhost:5000/api/events/${eventId}`
        : "http://localhost:5000/api/events";
      const method = eventId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit event");
      }
      navigate("/events");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">
          {eventId ? "Update Event" : "Create Event"}
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Form fields remain the same */}
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
          {/* Tags */}
          <div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                className="border p-2 rounded flex-1"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 font-bold"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
          {/* Privacy */}
          <select
            name="privacy"
            value={formData.privacy}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="rsvp">RSVP</option>
          </select>
          {/* Start/End Time */}
          <div className="flex gap-2">
            <input
              type="datetime-local"
              name="start"
              value={formData.start}
              onChange={handleChange}
              required
              className="w-1/2 p-2 border rounded"
            />
            <input
              type="datetime-local"
              name="end"
              value={formData.end}
              onChange={handleChange}
              required
              className="w-1/2 p-2 border rounded"
            />
          </div>
          {/* Location */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.location.address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              name="lat"
              placeholder="Latitude"
              value={formData.location.lat}
              onChange={handleChange}
              required
              className="w-1/2 p-2 border rounded"
            />
            <input
              type="number"
              step="any"
              name="lng"
              placeholder="Longitude"
              value={formData.location.lng}
              onChange={handleChange}
              required
              className="w-1/2 p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {loading
              ? eventId
                ? "Updating..."
                : "Creating..."
              : eventId
              ? "Update Event"
              : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
