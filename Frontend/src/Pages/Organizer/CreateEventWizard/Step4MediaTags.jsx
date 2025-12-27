import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const Step4MediaTags = ({ formData, updateFormData, handleFinalSubmit, prevStep }) => {
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const banners = formData.media?.banners || [];
  const tags = formData.tags || [];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('userToken');
            const res = await fetch(`${window.API_BASE_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                updateFormData({ 
                    media: { ...formData.media, banners: [data.url] } 
                });
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    }
  };

  const removeBanner = () => {
    updateFormData({ 
        media: { ...formData.media, banners: [] } 
    });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            updateFormData({ tags: [...tags, tagInput.trim()] });
            setTagInput('');
        }
    }
  };

  const removeTag = (tagToRemove) => {
    updateFormData({ tags: tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Banner Section */}
      <div>
         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Event Banner (Optional)</label>
         
         {banners.length > 0 ? (
             <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-fiord group">
                 <img src={banners[0]} alt="Event Banner" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                        onClick={removeBanner}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
                     >
                         Remove Image
                     </button>
                 </div>
             </div>
         ) : (
             <div className="border-2 border-dashed border-gray-300 dark:border-fiord rounded-xl p-10 flex flex-col items-center justify-center bg-[var(--color-bg-base)] dark:bg-bluewood hover:bg-white dark:hover:bg-mirage transition-colors relative cursor-pointer">
                 <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 />
                 <div className="bg-teal-100 dark:bg-teal-900/30 p-4 rounded-full mb-4">
                    <FaCloudUploadAlt className="text-teal-600 dark:text-teal-400 text-2xl" />
                 </div>
                 <p className="text-gray-700 dark:text-gray-300 font-medium">Click or Drag to Upload Banner</p>
                 <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Recommended size: 1200x600px</p>
                 {uploading && <p className="text-teal-600 dark:text-teal-400 mt-2 font-medium animate-pulse">Uploading...</p>}
             </div>
         )}
      </div>

      {/* Tags Section */}
      <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags (Optional)</label>
          <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tags (press Enter to add)..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-fiord rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white dark:bg-bluewood text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button 
                onClick={() => {
                    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                        updateFormData({ tags: [...tags, tagInput.trim()] });
                        setTagInput('');
                    }
                }}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700"
              >
                  Add
              </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, idx) => (
                  <span key={idx} className="bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-teal-900 dark:hover:text-teal-100"><FaTimes size={12} /></button>
                  </span>
              ))}
          </div>
      </div>

      <div className="flex justify-between pt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 border border-gray-300 dark:border-fiord text-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-mirage transition-all flex items-center gap-2"
        >
          <span className="text-lg">‹</span> Previous
        </button>
        <button
          onClick={handleFinalSubmit}
          className="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all shadow-md flex items-center gap-2"
        >
          Create Event
        </button>
      </div>
    </div>
  );
};

export default Step4MediaTags;
