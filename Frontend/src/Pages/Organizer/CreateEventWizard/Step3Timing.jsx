import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaPlus, FaTrash } from 'react-icons/fa';

const Step3Timing = ({ formData, updateFormData, nextStep }) => {
  const { start, end, agenda } = formData;
  const [sessions, setSessions] = useState(agenda || []);
  const [newSession, setNewSession] = useState({ title: '', startTime: '', type: 'keynote' });

  const handleDateChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const addSession = () => {
    if (newSession.title && newSession.startTime) {
      const updatedSessions = [...sessions, newSession];
      setSessions(updatedSessions);
      updateFormData({ agenda: updatedSessions }); // Note: Logic in index.jsx needs to handle this or ignore if using separate model
      setNewSession({ title: '', startTime: '', type: 'keynote' });
    }
  };

  const removeSession = (index) => {
    const updated = sessions.filter((_, i) => i !== index);
    setSessions(updated);
    updateFormData({ agenda: updated });
  };

  const isValid = () => start && end && new Date(start) < new Date(end);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">When is it happening?</h2>
        <p className="text-gray-500 mt-2">Set the dates and build your agenda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Event Start</label>
          <div className="relative">
            <input
              type="datetime-local"
              name="start"
              value={start}
              onChange={handleDateChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Event End</label>
          <div className="relative">
            <input
              type="datetime-local"
              name="end"
              value={end}
              min={start}
              onChange={handleDateChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
             <FaClock className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mini Agenda Builder */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Quick Agenda Builder</h3>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
          <div className="flex-1">
            <label className="text-xs text-gray-500">Session Title</label>
            <input 
              type="text" 
              value={newSession.title}
              onChange={(e) => setNewSession({...newSession, title: e.target.value})}
              placeholder="e.g. Opening Keynote"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="w-40">
            <label className="text-xs text-gray-500">Time</label>
            <input 
              type="time" 
              value={newSession.startTime}
              onChange={(e) => setNewSession({...newSession, startTime: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="w-32">
             <label className="text-xs text-gray-500">Type</label>
             <select
               value={newSession.type}
               onChange={(e) => setNewSession({...newSession, type: e.target.value})}
               className="w-full px-3 py-2 border rounded-md bg-white"
             >
               <option value="keynote">Keynote</option>
               <option value="workshop">Workshop</option>
               <option value="social">Social</option>
             </select>
          </div>
          <button 
            onClick={addSession}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>

        <div className="space-y-2 bg-gray-50 p-4 rounded-lg min-h-[100px]">
          {sessions.length === 0 && <p className="text-gray-400 text-center text-sm py-4">No sessions added yet.</p>}
          {sessions.map((s, idx) => (
            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">{s.startTime}</span>
                <span className="font-medium">{s.title}</span>
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full capitalize">{s.type}</span>
              </div>
              <button 
                onClick={() => removeSession(idx)}
                className="text-red-400 hover:text-red-600"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={nextStep}
          disabled={!isValid()}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step3Timing;
