import { useState, useEffect, useRef } from "react";
import { FaBell, FaCheckDouble } from "react-icons/fa";
import axios from "axios";

export default function NotificationDropdown({ user }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown on click outside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowNotifs(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    if (window.io) {
        const socket = window.io(window.API_BASE_URL + ""); // Ensure this matches backend URL
        socket.emit('join', { userId: user.id || user._id }); // Ensure we join user room logic if needed, though 'notification:userId' might be global
        
        // Listen format: notification:<userId>
        const userId = user.id || user._id;
        socket.on(`notification:${userId}`, (newNotif) => {
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);
            // Optional: Play sound?
        });
        
        return () => socket.disconnect();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get(window.API_BASE_URL + "/api/notifications", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
        console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
        const token = localStorage.getItem("userToken");
        await axios.put(`${window.API_BASE_URL}/api/notifications/${id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
        console.error("Failed to mark read", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
        <button 
           onClick={() => setShowNotifs(!showNotifs)}
           className="p-2 text-gray-400 hover:text-teal-600 transition-colors relative"
        >
            <FaBell className="text-xl" />
            {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
        </button>

        {showNotifs && (
            <div className="absolute right-0 top-full mt-4 w-80 bg-white dark:bg-mirage border border-gray-100 dark:border-fiord rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                <div className="px-4 py-3 border-b border-gray-50 dark:border-fiord flex justify-between items-center bg-gray-50 dark:bg-fiord/30">
                    <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-full">{unreadCount} New</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 dark:text-lynch text-sm">No notifications yet</div>
                    ) : (
                        notifications.map(notif => (
                            <div key={notif._id} className={`p-4 border-b border-gray-50 dark:border-fiord hover:bg-gray-50 dark:hover:bg-fiord/30 transition flex gap-3 ${notif.read ? 'opacity-60' : 'bg-teal-50/10 dark:bg-teal-900/10'}`}>
                                <div className="mt-1 text-teal-500 dark:text-teal-400">
                                    <FaBell />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{notif.message}</p>
                                    <p className="text-[10px] text-gray-400 dark:text-lynch mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                                </div>
                                {!notif.read && (
                                    <button onClick={() => markAsRead(notif._id)} title="Mark as read" className="text-gray-400 hover:text-teal-600 self-center">
                                        <FaCheckDouble />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
                <div className="p-2 border-t border-gray-50 dark:border-fiord text-center">
                    <button onClick={() => setShowNotifs(false)} className="text-xs font-bold text-gray-500 dark:text-lynch hover:text-gray-800 dark:hover:text-white">Close</button>
                </div>
            </div>
        )}
    </div>
  );
}
