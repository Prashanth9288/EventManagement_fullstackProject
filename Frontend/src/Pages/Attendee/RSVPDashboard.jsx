import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTicketAlt, FaCalendarCheck, FaMapMarkerAlt, FaClock, FaDownload, FaQrcode, FaHistory } from 'react-icons/fa';

const RSVPDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past'

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const res = await axios.get(window.API_BASE_URL + '/api/tickets/my-tickets', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTickets(res.data.tickets);
            } catch (err) {
                console.error("Error fetching tickets:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter(ticket => {
        const eventDate = new Date(ticket.event.start);
        const now = new Date();
        return filter === 'upcoming' ? eventDate >= now : eventDate < now;
    });

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Wallet</h1>
                        <p className="text-gray-500 mt-2">Manage your event passes and tickets</p>
                    </div>
                    
                    {/* Toggle Switch */}
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
                        <button 
                            onClick={() => setFilter('upcoming')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${filter === 'upcoming' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Upcoming
                        </button>
                        <button 
                            onClick={() => setFilter('past')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${filter === 'past' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            <FaHistory /> Past
                        </button>
                    </div>
                </div>

                {/* Tickets Grid */}
                {filteredTickets.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            <FaTicketAlt />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No {filter} tickets found</h3>
                        <p className="text-gray-500">
                            {filter === 'upcoming' ? "You haven't booked any upcoming events." : "You have no past event history."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredTickets.map(ticket => (
                            <TicketCard key={ticket._id} ticket={ticket} isPast={filter === 'past'} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const TicketCard = ({ ticket, isPast }) => {
    return (
        <div className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row border border-gray-100 ${isPast ? 'opacity-75 grayscale hover:grayscale-0' : ''}`}>
            
            {/* Left Side: Event Details */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

                <div>
                    <div className="flex justify-between items-start mb-4">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ticket.type === 'vip' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
                            {ticket.type} Access
                        </span>
                        <div className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded">
                            #{ticket._id.substr(-6).toUpperCase()}
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                        {ticket.event.title}
                    </h3>
                    
                    <div className="space-y-3 mt-4">
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mr-3">
                                <FaCalendarCheck />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-gray-400 font-bold">Date</p>
                                <p className="font-semibold">{new Date(ticket.event.start).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                             <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 mr-3">
                                <FaClock />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-gray-400 font-bold">Time</p>
                                <p className="font-semibold">{new Date(ticket.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                         <div className="flex items-center text-sm text-gray-600">
                             <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mr-3">
                                <FaMapMarkerAlt />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-gray-400 font-bold">Location</p>
                                <p className="font-semibold truncate max-w-[200px]">{ticket.event.location || 'Online'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-dashed border-gray-200 flex justify-between items-center">
                    <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                        <FaDownload /> Download PDF
                    </button>
                </div>
            </div>

            {/* Divider (CSS Perforation) */}
            <div className="relative w-full h-8 md:w-8 md:h-auto bg-gray-50 md:bg-white flex items-center justify-center">
                <div className="absolute left-0 w-4 h-8 bg-gray-50 rounded-r-full -ml-2 md:top-0 md:left-1/2 md:w-8 md:h-4 md:bg-gray-50 md:rounded-b-full md:-ml-4 md:-mt-2"></div>
                <div className="absolute right-0 w-4 h-8 bg-gray-50 rounded-l-full -mr-2 md:bottom-0 md:left-1/2 md:w-8 md:h-4 md:bg-gray-50 md:rounded-t-full md:-ml-4 md:-mb-2"></div>
                <div className="hidden md:block border-l-2 border-dashed border-gray-200 h-full mx-auto"></div>
                <div className="md:hidden border-t-2 border-dashed border-gray-200 w-full my-auto"></div>
            </div>

            {/* Right Side: QR Code */}
            <div className="bg-gray-50 p-6 md:p-8 flex flex-col items-center justify-center text-center w-full md:w-48 border-l border-dashed border-gray-200 md:border-l-0">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-3">
                    <FaQrcode className="text-6xl text-gray-800" />
                </div>
                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-1">Scan to Entry</p>
                <p className="text-xs font-bold text-gray-900">{ticket.status.toUpperCase()}</p>
            </div>
        </div>
    );
};

export default RSVPDashboard;
