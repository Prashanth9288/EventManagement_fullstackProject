import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import EventDiscuss from "../../components/EventDiscuss";
import CreatePollModal from "../../components/CreatePollModal";

const OrganizerEventHub = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const res = await axios.get(`${window.API_BASE_URL}/api/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvent(res.data);
            } catch (err) {
                console.error("Failed to fetch event", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading Hub...</div>;
    if (!event) return <div className="p-8 text-center">Event not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-8">
            <div className="max-w-4xl mx-auto">
                <button 
                  onClick={() => navigate(`/organizer/event/${id}`)}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-6 transition"
                >
                    <FaArrowLeft /> Back to Details
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                                <div className="flex items-center gap-4 text-gray-500 text-sm">
                                    <span className="flex items-center gap-2"><FaCalendarAlt /> {new Date(event.start).toLocaleString()}</span>
                                    <span className="flex items-center gap-2"><FaMapMarkerAlt /> {event.location?.address || "Online"}</span>
                                </div>
                            </div>
                            <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                                Organizer Hub
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Chat Section */}
                    <div>
                         {/* Reusing existing component to ensure synchronization with Attendees */}
                        <div className="bg-indigo-600 text-white p-6 rounded-t-3xl">
                            <h2 className="text-xl font-bold">Event Discussion</h2>
                            <p className="opacity-80">Chat directly with your attendees here.</p>
                        </div>
                         {/* Passing props and styling to fit container */}
                        <div className="bg-white rounded-b-3xl shadow-sm border border-gray-200 border-t-0 overflow-hidden">
                            <EventDiscuss eventId={id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerEventHub;
