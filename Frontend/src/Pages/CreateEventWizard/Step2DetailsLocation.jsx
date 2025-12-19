import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const Step2DetailsLocation = ({ formData, updateFormData, nextStep, prevStep }) => {
  // Local state to handle split date/time inputs
  const [dateTime, setDateTime] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  });

  // Initialize local state from formData on mount
  useEffect(() => {
    if (formData.start) {
        const start = new Date(formData.start);
        const startDate = start.toISOString().split('T')[0];
        const startTime = start.toTimeString().slice(0, 5);
        setDateTime(prev => ({ ...prev, startDate, startTime }));
    }
    if (formData.end) {
        const end = new Date(formData.end);
        const endDate = end.toISOString().split('T')[0];
        const endTime = end.toTimeString().slice(0, 5);
        setDateTime(prev => ({ ...prev, endDate, endTime }));
    }
  }, []);

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    const newDT = { ...dateTime, [name]: value };
    setDateTime(newDT);

    // Update parent formData if we have valid pairs
    if (name.includes('start')) {
        if (newDT.startDate && newDT.startTime) {
            updateFormData({ start: `${newDT.startDate}T${newDT.startTime}` });
        }
    } else {
        if (newDT.endDate && newDT.endTime) {
            updateFormData({ end: `${newDT.endDate}T${newDT.endTime}` });
        }
    }
  };

  const handleLocationChange = (e) => {
    updateFormData({ 
        location: { ...formData.location, [e.target.name]: e.target.value } 
    });
  };

  const isValid = () => {
      const { startDate, startTime, endDate, endTime } = dateTime;
      const { address } = formData.location;
      return startDate && startTime && address; // End date is optional
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Date & Time Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start */}
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date *</label>
                  <div className="relative">
                    <input 
                        type="date" 
                        name="startDate"
                        value={dateTime.startDate}
                        onChange={handleDateTimeChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time *</label>
                  <div className="relative">
                    <input 
                        type="time" 
                        name="startTime"
                        value={dateTime.startTime}
                        onChange={handleDateTimeChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
              </div>
          </div>

          {/* End */}
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">End Date (Optional)</label>
                  <div className="relative">
                    <input 
                        type="date" 
                        name="endDate"
                        value={dateTime.endDate}
                        onChange={handleDateTimeChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">End Time (Optional)</label>
                  <div className="relative">
                    <input 
                        type="time" 
                        name="endTime"
                        value={dateTime.endTime}
                        onChange={handleDateTimeChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
              </div>
          </div>
      </div>

      {/* Location Section */}
      <div className="space-y-6 pt-4 border-t border-gray-100">
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Venue Name *</label>
              <input 
                type="text"
                name="placeId" // Using placeId temporarily for Venue Name to map to something, or just use address. Wait, schema has `address`. Let me use `address` for full address and maybe add a new field or just combine.
                // Schema location: { address, lat, lng, placeId }. 
                // Let's use `placeId` for Venue Name if not strictly ID, or better:
                // Let's stick to `address` as the main field shown in design as "Full Address". 
                // Design has "Venue Name" AND "Full Address". 
                // I'll map Venue Name to `location.placeId` (as a string name) for now or just ignore if schema doesn't support.
                // Schema `placeId` is string.
                value={formData.location.placeId || ''} 
                onChange={handleLocationChange}
                placeholder="e.g., Central Park, Community Center..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
          </div>

          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address *</label>
              <input 
                type="text"
                name="address"
                value={formData.location.address || ''}
                onChange={handleLocationChange}
                placeholder="Enter complete address..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
          </div>
      </div>

      <div className="flex justify-between pt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          <span className="text-lg">‹</span> Previous
        </button>
        <button
          onClick={nextStep}
          disabled={!isValid()}
          className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  );
};

export default Step2DetailsLocation;
