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
    <div className="min-h-screen bg-[var(--color-bg-base)] dark:bg-mirage flex flex-col font-sans transition-colors duration-300">
      {/* Header with Exit */}
      <div className="bg-white dark:bg-bluewood px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-fiord">
         <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>
         <button 
            onClick={() => navigate('/organizer-dashboard')}
            className="text-gray-500 dark:text-lynch hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
         >
            Exit
         </button>
      </div>

      {/* Stepper Header */}
      <div className="bg-white dark:bg-bluewood border-b border-gray-200 dark:border-fiord px-4 md:px-10 py-6 mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto">
            <p className="text-gray-500 dark:text-lynch mb-6">Follow the steps below to create your event</p>
            <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-fiord -z-10"></div>
                <div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-teal-500 -z-10 transition-all duration-500"
                    style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>

                {steps.map((s) => {
                    const isActive = s.id === step;
                    const isCompleted = s.id < step;

                    return (
                        <div key={s.id} className="flex flex-col items-center bg-white dark:bg-bluewood px-2">
                            <div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300
                                ${isActive ? 'border-teal-500 bg-teal-500 text-white shadow-lg scale-110' : 
                                  isCompleted ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300 dark:border-fiord bg-white dark:bg-mirage text-gray-400 dark:text-gray-500'}
                                `}
                            >
                                {isCompleted ? <FaCheck /> : s.icon}
                            </div>
                            <span className={`mt-2 text-sm font-medium ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-lynch'}`}>
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
        <div className="bg-white dark:bg-bluewood rounded-xl shadow-sm border border-gray-100 dark:border-fiord p-8 min-h-[400px]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default WizardLayout;
