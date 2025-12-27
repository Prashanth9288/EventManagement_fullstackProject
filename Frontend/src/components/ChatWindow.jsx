import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaTimes, FaCircle } from "react-icons/fa";
import axios from "axios";

export default function ChatWindow({ currentUser, otherUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchHistory();
    
    // Socket Setup
    if (window.io) {
        socketRef.current = window.io(window.API_BASE_URL + "");
        
        // Join my user room to listen (already done in App typically, but ensuring here)
        socketRef.current.emit("join", { userId: currentUser._id || currentUser.id });

        socketRef.current.on("dm:receive", (msg) => {
            // Only add if it belongs to this conversation
            const currentId = currentUser._id || currentUser.id;
            if (msg.sender === otherUser._id || msg.sender === currentId) {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();
            }
        });
    }

    return () => {
        if(socketRef.current) socketRef.current.disconnect();
    };
  }, [currentUser, otherUser]);

  const fetchHistory = async () => {
      try {
          const token = localStorage.getItem("userToken");
          const res = await axios.get(`${window.API_BASE_URL}/api/chat/${otherUser._id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setMessages(res.data);
          scrollToBottom();
      } catch (err) {
          console.error("Failed to load chat history");
      }
  };

  const scrollToBottom = () => {
      setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
  };

  const handleSend = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      const msgData = {
          senderId: currentUser._id || currentUser.id,
          recipientId: otherUser._id,
          content: newMessage
      };

      // Emit to socket
      socketRef.current.emit("dm:send", msgData);
      setNewMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-teal-600 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white text-teal-600 flex items-center justify-center font-bold">
                        {otherUser.name[0]}
                    </div>
                    <div className="absolute bottom-0 right-0 text-green-400 text-xs bg-white rounded-full border border-white">
                        <FaCircle />
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-sm">{otherUser.name}</h3>
                    <p className="text-xs opacity-80 decoration-indigo-200">Online</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition"><FaTimes /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto h-80 bg-gray-50 space-y-3">
            {messages.length === 0 && (
                <div className="text-center text-xs text-gray-400 mt-10">Start the conversation!</div>
            )}
            {messages.map((msg, idx) => {
                const isMe = msg.sender === currentUser.id;
                return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                            {msg.content}
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 transition"
            />
            <button type="submit" className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition disabled:opacity-50" disabled={!newMessage.trim()}>
                <FaPaperPlane />
            </button>
        </form>
    </div>
  );
}
