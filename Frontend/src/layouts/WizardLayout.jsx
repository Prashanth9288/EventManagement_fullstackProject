import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaCogs, FaTags, FaCheck } from 'react-icons/fa';

const WizardLayout = ({ title = "Create New Event", step, totalSteps, children }) => {
  const navigate = useNavigate();

  const steps = [
    { id: 1, label: "Basic Info", icon: <FaCalendarAlt /> },
    { id: 2, label: "Details & Location", icon: <FaMapMarkerAlt /> },
    { id: 3, label: "Settings", icon: <FaCogs /> },
    { id: 4, label: "Media & Tags", icon: <FaTags /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header with Exit */}
      <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-100">
         <h1 className="text-xl font-bold text-gray-800">{title}</h1>
         <button 
            onClick={() => navigate('/organizer-dashboard')}
            className="text-gray-500 hover:text-red-600 font-medium transition-colors"
         >
            Exit
         </button>
      </div>

      {/* Stepper Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-10 py-6 mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto">
            <p className="text-gray-500 mb-6">Follow the steps below to create your event</p>
            <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                <div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 -z-10 transition-all duration-500"
                    style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>

                {steps.map((s) => {
                    const isActive = s.id === step;
                    const isCompleted = s.id < step;

                    return (
                        <div key={s.id} className="flex flex-col items-center bg-white px-2">
                            <div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300
                                ${isActive ? 'border-green-500 bg-green-500 text-white shadow-lg scale-110' : 
                                  isCompleted ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 bg-white text-gray-400'}
                                `}
                            >
                                {isCompleted ? <FaCheck /> : s.icon}
                            </div>
                            <span className={`mt-2 text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 pb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default WizardLayout;
