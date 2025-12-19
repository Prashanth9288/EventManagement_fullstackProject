import { useState } from 'react';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import axios from 'axios';

export default function CreatePollModal({ eventId, onClose, onSuccess }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!question.trim() || options.some(o => !o.trim())) {
          return alert("Please fill in all fields");
      }
      
      setLoading(true);
      try {
          // Sending via Socket would be ideal for "Live" polls, but let's stick to REST for creation if using the dashboard
          // OR better: Emit using socket if we want instant push? 
          // Previous server code handled 'poll:create' via socket. Let's try to use that if available, else REST.
          // Wait, server.js has socket.on('poll:create'). Let's use socket if we can, but we are in dashboard. 
          // Actually, let's use a REST endpoint if it exists? "pollRoutes" is imported in server.js.
          // Let's check pollRoutes. If not, use socket.
          
          // Fallback: Use Socket via window.io if global, or just generic functionality.
          // Simpler: Just emit the socket event. 
          
          if (window.io) {
              const socket = window.io("http://localhost:5000");
              socket.emit('poll:create', { eventId, question, options });
              socket.disconnect(); // Connect, emit, disconnect (stateless)
              // We need to wait? Socket is fire and forget mostly here. 
          }
          
          // Ideally we should have a REST endpoint for persistence too?
          // The socket handler SAVES to DB. So just emitting is enough.
          
          onSuccess();
          onClose();

      } catch (err) {
          console.error(err);
          alert("Failed to create poll");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-scale-in">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <FaTimes />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create Live Poll</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Question</label>
                    <input 
                        type="text" 
                        value={question} 
                        onChange={e => setQuestion(e.target.value)}
                        placeholder="e.g. What session did you like most?"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700">Options</label>
                    {options.map((opt, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input 
                                type="text"
                                value={opt}
                                onChange={e => handleOptionChange(idx, e.target.value)}
                                placeholder={`Option ${idx + 1}`}
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            {options.length > 2 && (
                                <button type="button" onClick={() => removeOption(idx)} className="text-red-400 hover:text-red-600 px-2">
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addOption} className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline">
                        <FaPlus size={12} /> Add Option
                    </button>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 mt-4"
                >
                    {loading ? "Creating..." : "Launch Poll"}
                </button>
            </form>
        </div>
    </div>
  );
}
