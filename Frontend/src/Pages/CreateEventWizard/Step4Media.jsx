import React, { useState } from 'react';
import { FaImage, FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';
import axios from 'axios';

const Step4Media = ({ formData, updateFormData, handleFinalSubmit }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Mock upload or simple handle
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // In a real app, upload to S3/Cloudinary here.
    // For now, create a local object URL for preview.
    const url = URL.createObjectURL(file);
    setPreview(url);
    
    // Simulate upload delay
    setUploading(true);
    setTimeout(() => {
        setUploading(false);
        // Assuming string based media array in backend for now or URL
        updateFormData({ 
            media: { ...formData.media, banners: [url] } // This is a temp URL, won't persist well in real BE without upload logic
        });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Make it pop!</h2>
        <p className="text-gray-500 mt-2">Add visuals to attract attendees.</p>
      </div>

      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-white transition-colors">
          {preview ? (
            <div className="relative w-full h-64">
              <img src={preview} alt="Banner Preview" className="w-full h-full object-cover rounded-lg shadow-md" />
              <button 
                onClick={() => setPreview(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ) : (
             <>
               <FaCloudUploadAlt size={48} className="text-indigo-400 mb-4" />
               <p className="text-lg font-medium text-gray-700">Drag & Drop or Click to Upload Banner</p>
               <input 
                 type="file" 
                 accept="image/*"
                 onChange={handleFileChange}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               />
               <p className="text-sm text-gray-400 mt-2">Recommended: 1200x600px</p>
             </>
          )}
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
           <textarea
             value={formData.description}
             onChange={(e) => updateFormData({ description: e.target.value })}
             placeholder="Tell people what your event is about..."
             rows={4}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
           <input
             type="text"
             value={formData.title}
             onChange={(e) => updateFormData({ title: e.target.value })}
             placeholder="Event Name"
             className="w-full px-4 py-3 text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
           />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleFinalSubmit}
          disabled={!formData.title || uploading}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
           {uploading ? 'Uploading...' : <><FaCheckCircle /> Launch Event</>}
        </button>
      </div>
    </div>
  );
};

export default Step4Media;
