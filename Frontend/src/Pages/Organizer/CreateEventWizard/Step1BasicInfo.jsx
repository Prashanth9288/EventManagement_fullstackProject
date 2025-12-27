import React, { useState } from 'react';

const Step1BasicInfo = ({ formData, updateFormData, nextStep }) => {
  const { title, description } = formData;

  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const isValid = () => title?.trim() && description?.trim() && formData.type;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div className="space-y-4">
        <div>
           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Event Title *</label>
           <input
             type="text"
             name="title"
             value={title}
             onChange={handleChange}
             placeholder="Enter your event title..."
             className="w-full px-4 py-3 border border-gray-300 dark:border-fiord rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-white dark:bg-bluewood text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
           />
        </div>

        <div>
           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description *</label>
           <textarea
             name="description"
             value={description}
             onChange={handleChange}
             placeholder="Describe your event..."
             rows={6}
             className="w-full px-4 py-3 border border-gray-300 dark:border-fiord rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none bg-white dark:bg-bluewood text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
           />
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Event Category *</label>
            <select
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-fiord rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-white dark:bg-bluewood text-gray-900 dark:text-white"
            >
                <option value="" disabled>Select a category</option>
                {['Social', 'Corporate', 'Workshop', 'Conference', 'Concert', 'Exhibition'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="flex justify-end pt-4">
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

export default Step1BasicInfo;
