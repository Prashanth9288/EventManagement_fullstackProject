import React, { useState } from 'react';
import { FaMapMarkerAlt, FaVideo, FaGlobe } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Step2Logistics = ({ formData, updateFormData, nextStep }) => {
  const { format, location, virtualVenue, type } = formData;

  const handleFormatChange = (newFormat) => {
    updateFormData({ format: newFormat });
  };

  const handleLocationChange = (e) => {
    updateFormData({ location: { ...location, [e.target.name]: e.target.value } });
  };

  const handleVirtualChange = (e) => {
    updateFormData({ virtualVenue: { ...virtualVenue, [e.target.name]: e.target.value } });
  };

  const isFormatSelected = (f) => format === f;

  const isValid = () => {
    if (format === 'virtual') return virtualVenue.link;
    if (format === 'physical') return location.address || (location.lat && location.lng);
    if (format === 'hybrid') return (location.address || (location.lat && location.lng)) && virtualVenue.link;
    return false;
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        updateFormData({ 
            location: {
                ...location, 
                lat: e.latlng.lat, 
                lng: e.latlng.lng,
                // In real app, reverse geocode here to get address
                address: location.address || `Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`
            } 
        });
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return location.lat === null ? null : (
      <Marker position={[location.lat, location.lng]}></Marker>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Where is it happening?</h2>
        <p className="text-gray-500 mt-2">Set the location for your {type} event.</p>
      </div>

      {/* Format Selection */}
      <div className="flex justify-center gap-4">
        {['physical', 'virtual', 'hybrid'].map((f) => (
          <button
            key={f}
            onClick={() => handleFormatChange(f)}
            className={`px-6 py-3 rounded-full font-medium capitalize border transition-colors
              ${isFormatSelected(f) 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Physical Section */}
        {(format === 'physical' || format === 'hybrid') && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-semibold flex items-center gap-2 text-gray-800">
              <FaMapMarkerAlt className="text-red-500" /> Physical Venue
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name / Address</label>
                <input
                  type="text"
                  name="address"
                  value={location.address}
                  onChange={handleLocationChange}
                  placeholder="e.g. Grand Convention Center, NY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              
            {/* Leaflet Map Integration */}
            <div className="h-64 rounded-xl overflow-hidden border border-gray-300 z-0 relative">
               <MapContainer 
                 center={location.lat ? [location.lat, location.lng] : [40.7128, -74.0060]} 
                 zoom={13} 
                 style={{ height: '100%', width: '100%' }}
                 whenCreated={(map) => {
                    // In a real app with search, we'd flyTo() the new coords
                    if(location.lat) map.flyTo([location.lat, location.lng], 13);
                 }}
               >
                 <TileLayer
                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                 />
                 <LocationMarker />
               </MapContainer>
               {!location.lat && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white pointer-events-none z-[1000]">
                     <p className="font-semibold bg-black/60 px-4 py-2 rounded">Click on map to select location</p>
                  </div>
               )}
            </div>
            </div>
          </div>
        )}

        {/* Virtual Section */}
        {(format === 'virtual' || format === 'hybrid') && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-semibold flex items-center gap-2 text-gray-800">
              <FaVideo className="text-blue-500" /> Virtual Venue
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Streaming Link</label>
                <input
                  type="text"
                  name="link"
                  value={virtualVenue.link}
                  onChange={handleVirtualChange}
                  placeholder="e.g. Zoom, YouTube Live, or Internal Stream"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  name="platform"
                  value={virtualVenue.platform}
                  onChange={handleVirtualChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="">Select Platform</option>
                  <option value="zoom">Zoom</option>
                  <option value="youtube">YouTube</option>
                  <option value="meet">Google Meet</option>
                  <option value="custom">Custom / Internal</option>
                </select>
              </div>
            </div>
          </div>
        )}
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

export default Step2Logistics;
