import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const BrandingSettings = () => {
  const { theme, updateTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (e) => {
    updateTheme({ [e.target.name]: e.target.value });
  };

  const handleFontChange = (e) => {
    updateTheme({ fontFamily: e.target.value });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 z-50"
        title="Customize Theme"
      >
        🎨
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-xl border border-gray-200 w-80 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800">Brand Customization</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              name="primaryColor"
              value={theme.primaryColor}
              onChange={handleColorChange}
              className="h-8 w-12 rounded border cursor-pointer"
            />
            <span className="text-xs text-gray-500">{theme.primaryColor}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              name="secondaryColor"
              value={theme.secondaryColor}
              onChange={handleColorChange}
              className="h-8 w-12 rounded border cursor-pointer"
            />
            <span className="text-xs text-gray-500">{theme.secondaryColor}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
          <select
            value={theme.fontFamily}
            onChange={handleFontChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 border"
          >
            <option value="'Inter', sans-serif">Inter</option>
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Playfair Display', serif">Playfair Display</option>
          </select>
        </div>
        
        <div className="pt-2 border-t mt-2">
             <p className="text-xs text-gray-400">Preview changes live across the app.</p>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
