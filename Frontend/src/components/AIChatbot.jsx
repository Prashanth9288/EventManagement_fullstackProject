import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaTimes, FaCircle } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", content: "Hello! I am your Event Management AI Assistant. How can I help you regarding your project?" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const { user } = useTheme(); 

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Socket Connection
  useEffect(() => {
     if (window.io) {
         socketRef.current = window.io(window.API_BASE_URL || "http://localhost:5000");
         
         socketRef.current.on('connect', () => {
             console.log("AI Chatbot connected");
         });

         socketRef.current.on('ai:response', (data) => {
             setIsTyping(false);
             setMessages(prev => [...prev, { sender: "ai", content: data.content }]);
         });
     }
     
     return () => {
         if(socketRef.current) socketRef.current.disconnect();
     }
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add User Message
    const userMsg = { sender: "user", content: newMessage };
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");
    setIsTyping(true);

    // Emit to Backend
    if (socketRef.current) {
        socketRef.current.emit('ai:ask', { 
            userId: "guest", // or actual user ID if available
            query: userMsg.content 
        });
    } else {
        // Fallback if socket fails
        setTimeout(() => {
             setMessages((prev) => [...prev, { sender: "ai", content: "Connection lost. Please try again." }]);
             setIsTyping(false);
        }, 1000);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-110 transition-all z-50 animate-bounce-slow"
        title="AI Assistant"
      >
        <FaRobot size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white dark:bg-bluewood rounded-2xl shadow-2xl border border-gray-200 dark:border-fiord flex flex-col z-50 overflow-hidden animate-slide-up font-sans">
      {/* Header */}
      <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-xl border-2 border-indigo-200">
              <FaRobot />
            </div>
            <div className="absolute bottom-0 right-0 text-green-400 text-xs bg-white rounded-full border border-white">
              <FaCircle />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm">Project Assistant</h3>
            <p className="text-xs opacity-80">Online & Ready</p>
          </div>
        </div>
        <button onClick={toggleChat} className="p-2 hover:bg-white/20 rounded-full transition">
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto h-96 bg-gray-50 dark:bg-mirage space-y-4">
        {messages.map((msg, idx) => {
          const isAi = msg.sender === "ai";
          return (
            <div key={idx} className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
                  isAi
                    ? "bg-white dark:bg-fiord text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-bluewood rounded-bl-none"
                    : "bg-indigo-600 text-white rounded-br-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        {isTyping && (
             <div className="flex justify-start animate-pulse">
                <div className="bg-gray-200 dark:bg-fiord text-gray-400 px-4 py-2 rounded-2xl rounded-bl-none text-xs italic">
                    AI is typing...
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-bluewood border-t border-gray-100 dark:border-fiord flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 bg-gray-100 dark:bg-mirage border-none rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}
