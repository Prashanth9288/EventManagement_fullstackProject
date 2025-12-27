import React from 'react';

const EventTypeCard = ({ type, title, description, icon, selected, onClick }) => (
  <div 
    onClick={() => onClick(type)}
    className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-4 hover:shadow-lg
      ${selected 
        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' 
        : 'border-gray-200 dark:border-fiord hover:border-indigo-300 bg-white dark:bg-bluewood'
      }`}
  >
    <div className={`text-4xl ${selected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
      {icon}
    </div>
    <div>
      <h3 className={`font-semibold text-lg ${selected ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-800 dark:text-white'}`}>
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-lynch mt-2">{description}</p>
    </div>
  </div>
);

const Step1Type = ({ formData, updateFormData, nextStep }) => {
  const handleSelect = (type) => {
    updateFormData({ type });
  };

  const handleNext = () => {
    if (formData.type) {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What kind of event are you hosting?</h2>
        <p className="text-gray-500 dark:text-lynch mt-2">This helps us tailor the experience for your needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EventTypeCard 
          type="corporate"
          title="Corporate Conference"
          description="Formal setup, ticketing, detailed agenda, sponsors."
          icon="🏢"
          selected={formData.type === 'corporate'}
          onClick={handleSelect}
        />
        <EventTypeCard 
          type="social"
          title="Social Gathering"
          description="Casual, RSVP tracking, visual invites, easy sharing."
          icon="🎉"
          selected={formData.type === 'social'}
          onClick={handleSelect}
        />
        <EventTypeCard 
          type="workshop"
          title="Workshop / Class"
          description="Educational, small groups, breakout sessions."
          icon="🎓"
          selected={formData.type === 'workshop'}
          onClick={handleSelect}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!formData.type}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step1Type;
