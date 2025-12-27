import { useState, useEffect, useRef } from 'react';
// import { io } from "socket.io-client"; // Removed due to install issues
import axios from 'axios';

// Fallback to global io from CDN if package is missing
const io = window.io;
import { jwtDecode } from "jwt-decode";
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';

export default function EventDiscuss({ eventId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    // 1. Auth & Socket Setup
    const token = localStorage.getItem("userToken");
    if (token) {
        setUser(jwtDecode(token));
    }

    // Connect to Socket
    socketRef.current = io(window.API_BASE_URL + "");
    
    // Join Event Room
    socketRef.current.emit("join", { eventId });

    // Listen for incoming comments
    socketRef.current.on("comment:new", (comment) => {
        setComments(prev => [comment, ...prev]);
    });

    return () => socketRef.current.disconnect();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
        alert("Please login to comment");
        return;
    }

    const commentData = {
        content: newComment,
        user: { name: user.name || "User", _id: user.id }, // Optimistic update structure
        createdAt: new Date().toISOString()
    };

    // Optimistic UI Update (Optional, waiting for socket mostly)
    // setComments(prev => [commentData, ...prev]); 

    // Emit to Socket (Server should save to DB and broadcast)
    socketRef.current.emit("comment:new", { ...commentData, eventId });
    setNewComment("");
  };

  return (
    <div className="bg-white dark:bg-bluewood rounded-2xl shadow-sm border border-gray-200 dark:border-fiord p-6 transition-colors duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Discussion ({comments.length})</h3>
        
        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
            <div className="flex-1 relative">
                <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..." 
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-mirage border border-gray-200 dark:border-fiord rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-mirage/80 dark:text-white dark:placeholder-lynch transition"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" disabled={!newComment}>
                    <FaPaperPlane />
                </button>
            </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {comments.length === 0 ? (
                <p className="text-center text-gray-400 dark:text-lynch">Be the first to say something!</p>
            ) : (
                comments.map((comment, idx) => (
                    <div key={idx} className="flex gap-4 animate-fade-in-up">
                        <div className="mt-1 text-gray-300 dark:text-fiord text-3xl">
                             <FaUserCircle />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-900 dark:text-white">{comment.user?.name || "User"}</span>
                                <span className="text-xs text-gray-400 dark:text-casper">{new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="text-gray-600 dark:text-lynch leading-relaxed bg-gray-50 dark:bg-fiord/30 px-4 py-2 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl inline-block">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
}
