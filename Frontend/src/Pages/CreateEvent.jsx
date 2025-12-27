import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";

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

    if (user && user.role !== 'organizer') {
      navigate("/dashboard");
      return;
    }

    if (eventId) {
      const fetchEvent = async () => {
        try {
          const res = await fetch(
            `${window.API_BASE_URL}/api/events/${eventId}`,
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
        ? `${window.API_BASE_URL}/api/events/${eventId}`
        : window.API_BASE_URL + "/api/events";
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
      navigate("/organizer-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDF7] dark:bg-mirage relative overflow-hidden flex flex-col transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 -z-10"></div>

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
            <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-500 dark:text-lynch hover:text-teal-600 dark:hover:text-teal-400 font-bold mb-8 transition-colors">
            <span className="w-8 h-8 rounded-full bg-white dark:bg-bluewood border border-gray-200 dark:border-fiord flex items-center justify-center group-hover:border-teal-200 dark:group-hover:border-teal-700 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 transition-all">←</span>
            Cancel
            </button>

            <div className="bg-white dark:bg-bluewood rounded-3xl shadow-xl border border-gray-100 dark:border-fiord overflow-hidden transition-colors duration-300">
            <div className="px-8 py-6 border-b border-gray-50 dark:border-fiord bg-gray-50/30 dark:bg-fiord/20 flex justify-between items-center">
                <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {eventId ? "Edit Event" : "Create New Event"}
                </h2>
                <p className="text-gray-500 dark:text-lynch text-sm mt-1">Fill in the details to launch your event</p>
                </div>
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 text-xl">
                ✨
                </div>
            </div>
            
            <div className="p-8">
                {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 border border-red-100 dark:border-red-900/30">
                    ⚠️ {error}
                </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Title & Privacy */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Event Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g. Summer Music Festival"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 border border-gray-200 dark:border-fiord rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 dark:bg-mirage hover:bg-white dark:hover:bg-mirage/80 dark:text-white dark:placeholder-lynch"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Privacy</label>
                    <select
                        name="privacy"
                        value={formData.privacy}
                        onChange={handleChange}
                        className="w-full px-5 py-3 border border-gray-200 dark:border-fiord rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 dark:bg-mirage hover:bg-white dark:hover:bg-mirage/80 dark:text-white cursor-pointer"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="rsvp">RSVP Only</option>
                    </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Description</label>
                    <textarea
                    name="description"
                    placeholder="Tell people what your event is about..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-5 py-3 border border-gray-200 dark:border-fiord rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 dark:bg-mirage hover:bg-white dark:hover:bg-mirage/80 dark:text-white dark:placeholder-lynch resize-none"
                    ></textarea>
                </div>

                {/* Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Start Time</label>
                    <input
                        type="datetime-local"
                        name="start"
                        value={formData.start}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 border border-gray-200 dark:border-fiord rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 dark:bg-mirage hover:bg-white dark:hover:bg-mirage/80 dark:text-white light-calendar-icon"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">End Time</label>
                    <input
                        type="datetime-local"
                        name="end"
                        value={formData.end}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 border border-gray-200 dark:border-fiord rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 dark:bg-mirage hover:bg-white dark:hover:bg-mirage/80 dark:text-white light-calendar-icon"
                    />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Location</label>
                    <div className="space-y-4">
                        <input
                        type="text"
                        name="address"
                        placeholder="Venue Name or Address"
                        value={formData.location.address}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3 border border-gray-200 dark:border-fiord rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 dark:bg-mirage hover:bg-white dark:hover:bg-mirage/80 dark:text-white dark:placeholder-lynch"
                        />
                        <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            step="any"
                            name="lat"
                            placeholder="Latitude (Optional)"
                            value={formData.location.lat}
                            onChange={handleChange}
                            className="w-full px-5 py-3 border border-gray-200 dark:border-fiord rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 dark:bg-mirage hover:bg-white dark:hover:bg-mirage/80 dark:text-white dark:placeholder-lynch"
                        />
                        <input
                            type="number"
                            step="any"
                            name="lng"
                            placeholder="Longitude (Optional)"
                            value={formData.location.lng}
                            onChange={handleChange}
                            className="w-full px-5 py-3 border border-gray-200 dark:border-fiord rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 dark:bg-mirage hover:bg-white dark:hover:bg-mirage/80 dark:text-white dark:placeholder-lynch"
                        />
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Tags</label>
                    <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag..."
                        className="flex-1 px-5 py-3 border border-gray-200 dark:border-fiord rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 dark:bg-mirage hover:bg-white dark:hover:bg-mirage/80 dark:text-white dark:placeholder-lynch"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="bg-gray-900 dark:bg-teal-600 text-white px-6 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-teal-700 transition-colors"
                    >
                        Add
                    </button>
                    </div>
                    <div className="flex gap-2 flex-wrap min-h-[32px]">
                    {formData.tags.map((tag) => (
                        <span
                        key={tag}
                        className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-lg border border-teal-100 dark:border-teal-800 flex items-center gap-2 text-sm font-medium"
                        >
                        #{tag}
                        <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-teal-400 hover:text-teal-600 dark:hover:text-teal-200 font-bold"
                        >
                            ×
                        </button>
                        </span>
                    ))}
                    {formData.tags.length === 0 && <span className="text-gray-400 dark:text-lynch text-sm italic py-1">No tags added yet</span>}
                    </div>
                </div>
                
                <div className="pt-4 border-t border-gray-50 dark:border-fiord">
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 text-white text-lg font-bold py-4 rounded-xl hover:shadow-xl hover:shadow-teal-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform"
                    >
                    {loading
                        ? eventId
                        ? "Updating Event..."
                        : "Creating Event..."
                        : eventId
                        ? "Update Event"
                        : "Create Event"}
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
