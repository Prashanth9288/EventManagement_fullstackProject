import { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function CreatePollModal({ eventId, onClose, onSuccess }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  
  // Socket Management
  const [socket, setSocket] = useState(null);

  useEffect(() => {
      const s = io(window.API_BASE_URL || "http://localhost:5000");
      setSocket(s);
      return () => s.disconnect();
  }, []);

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
          if (socket) {
             socket.emit('poll:create', { eventId, question, options });
          }
          
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
        <div className="bg-white dark:bg-bluewood rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-scale-in">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-lynch hover:text-gray-600 dark:hover:text-white transition-colors">
                <FaTimes />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create Live Poll</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Question</label>
                    <input 
                        type="text" 
                        value={question} 
                        onChange={e => setQuestion(e.target.value)}
                        placeholder="e.g. What session did you like most?"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-mirage border border-gray-200 dark:border-fiord rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white dark:placeholder-lynch transition-colors"
                    />
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Options</label>
                    {options.map((opt, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input 
                                type="text"
                                value={opt}
                                onChange={e => handleOptionChange(idx, e.target.value)}
                                placeholder={`Option ${idx + 1}`}
                                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-mirage border border-gray-200 dark:border-fiord rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white dark:placeholder-lynch transition-colors"
                            />
                            {options.length > 2 && (
                                <button type="button" onClick={() => removeOption(idx)} className="text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 px-2 transition-colors">
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addOption} className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1 hover:underline">
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
