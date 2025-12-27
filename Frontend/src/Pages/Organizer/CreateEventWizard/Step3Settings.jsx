import React from 'react';
import { FaGlobe, FaLock, FaEnvelopeOpenText } from 'react-icons/fa';

const Step3Settings = ({ formData, updateFormData, nextStep, prevStep }) => {
  const { privacy } = formData;
  const capacity = formData.ticketing?.tiers?.[0]?.capacity || '';

  const handlePrivacyChange = (val) => {
    updateFormData({ privacy: val });
  };

  const handleCapacityChange = (e) => {
    const val = e.target.value;
    // Update ticketing tier 0 capacity
    const currentTiers = formData.ticketing?.tiers?.length ? [...formData.ticketing.tiers] : [{ name: 'General Admission', price: 0, capacity: 0 }];
    currentTiers[0].capacity = val ? parseInt(val) : 0;
    
    updateFormData({ 
        ticketing: { 
            ...formData.ticketing, 
            type: 'free', 
            tiers: currentTiers 
        } 
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Privacy Section */}
      <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-800 dark:text-white">Event Privacy</label>
          
          <div className="space-y-3">
              {/* Public */}
              <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${privacy === 'public' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-fiord dark:bg-mirage hover:border-teal-200 dark:hover:border-teal-500'}`}>
                  <input 
                    type="radio" 
                    name="privacy" 
                    value="public" 
                    checked={privacy === 'public'} 
                    onChange={() => handlePrivacyChange('public')}
                    className="mt-1 w-5 h-5 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                      <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                          <FaGlobe className="text-gray-500 dark:text-gray-400" /> Public
                      </div>
                      <p className="text-sm text-gray-500 dark:text-lynch mt-1">Anyone can see and join this event</p>
                  </div>
              </label>

              {/* Private */}
              <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${privacy === 'private' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-fiord dark:bg-mirage hover:border-teal-200 dark:hover:border-teal-500'}`}>
                  <input 
                    type="radio" 
                    name="privacy" 
                    value="private" 
                    checked={privacy === 'private'} 
                    onChange={() => handlePrivacyChange('private')}
                    className="mt-1 w-5 h-5 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                      <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                          <FaLock className="text-gray-500 dark:text-gray-400" /> Private
                      </div>
                      <p className="text-sm text-gray-500 dark:text-lynch mt-1">Only invited people can see this event</p>
                  </div>
              </label>

              {/* RSVP Only */}
              <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${privacy === 'rsvp' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-fiord dark:bg-mirage hover:border-teal-200 dark:hover:border-teal-500'}`}>
                  <input 
                    type="radio" 
                    name="privacy" 
                    value="rsvp" 
                    checked={privacy === 'rsvp'} 
                    onChange={() => handlePrivacyChange('rsvp')}
                    className="mt-1 w-5 h-5 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                      <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                          <FaEnvelopeOpenText className="text-gray-500 dark:text-gray-400" /> RSVP Only
                      </div>
                      <p className="text-sm text-gray-500 dark:text-lynch mt-1">Anyone can see, but must RSVP to attend</p>
                  </div>
              </label>
          </div>
      </div>

      {/* Capacity Section */}
      <div className="pt-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Maximum Attendees (Optional)</label>
          <input 
            type="number" 
            value={capacity || ''}
            onChange={handleCapacityChange}
            placeholder="Leave empty for unlimited"
            className="w-full px-4 py-3 border border-gray-300 dark:border-fiord rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-bluewood text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
      </div>

      <div className="flex justify-between pt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 border border-gray-300 dark:border-fiord text-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-mirage transition-all flex items-center gap-2"
        >
          <span className="text-lg">‹</span> Previous
        </button>
        <button
          onClick={nextStep}
          className="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all shadow-md flex items-center gap-2"
        >
          Next <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  );
};

export default Step3Settings;
