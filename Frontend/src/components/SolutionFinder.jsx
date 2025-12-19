import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaBuilding, FaGlobe, FaCheckCircle, FaArrowRight, FaTimes } from "react-icons/fa";

export default function SolutionFinder({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    role: "",
    industry: "",
    format: ""
  });

  if (!isOpen) return null;

  const handleSelect = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const finish = () => {
    // Save preferences
    console.log("User Solution:", selections);
    localStorage.setItem("userPreferences", JSON.stringify(selections));
    
    onClose();
    if (selections.role === 'Event Planner') {
        navigate('/create-event'); // Direct to creation for planners
    } else {
        navigate('/events'); // Direct to discovery for others
    }
  };

  const steps = [
    {
      id: 1,
      title: "What is your primary role?",
      key: "role",
      options: [
        { label: "Event Planner", icon: <FaUserTie />, desc: "I organize and manage events." },
        { label: "Marketer", icon: <FaBuilding />, desc: "I use events for brand growth." },
        { label: "Attendee", icon: <FaGlobe />, desc: "I am looking for events to join." },
      ]
    },
    {
      id: 2,
      title: "What is your industry?",
      key: "industry",
      options: [
        { label: "Technology", icon: "💻" },
        { label: "Education", icon: "🎓" },
        { label: "Healthcare", icon: "🏥" },
        { label: "Finance", icon: "💰" },
        { label: "Non-Profit", icon: "🤝" },
        { label: "Other", icon: "✨" },
      ]
    },
    {
      id: 3,
      title: "What event format do you prefer?",
      key: "format",
      options: [
        { label: "In-Person", icon: "🏟️" },
        { label: "Virtual", icon: "💻" },
        { label: "Hybrid", icon: "🌐" },
      ]
    }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-8 text-white relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white transition">
                <FaTimes size={24} />
            </button>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">Solution Finder</span>
            <h2 className="text-3xl font-bold">Let's find your perfect solution.</h2>
            <p className="text-blue-200 mt-2 text-lg">Tell us a bit about yourself so we can tailor the platform for you.</p>
            
            {/* Progress Bar */}
            <div className="flex gap-2 mt-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-white' : 'bg-white/20'}`}></div>
                ))}
            </div>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{currentStepData.title}</h3>
            
            <div className={`grid gap-4 ${step === 1 ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
                {currentStepData.options.map((opt) => (
                    <div 
                        key={opt.label}
                        onClick={() => handleSelect(currentStepData.key, opt.label)}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 group hover:shadow-lg
                            ${selections[currentStepData.key] === opt.label 
                                ? 'border-indigo-600 bg-indigo-50 shadow-indigo-200' 
                                : 'border-gray-100 hover:border-indigo-300'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors
                             ${selections[currentStepData.key] === opt.label ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}
                        `}>
                            {opt.icon}
                        </div>
                        <div>
                            <h4 className={`font-bold text-lg ${selections[currentStepData.key] === opt.label ? 'text-indigo-900' : 'text-gray-900'}`}>{opt.label}</h4>
                            {opt.desc && <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>}
                        </div>
                        {selections[currentStepData.key] === opt.label && (
                            <div className="ml-auto text-indigo-600">
                                <FaCheckCircle size={24} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            {step > 1 ? (
                <button onClick={prevStep} className="text-gray-500 font-bold hover:text-gray-900 px-4 py-2">
                    Back
                </button>
            ) : (
                <div></div>
            )}

            <button 
                onClick={step === 3 ? finish : nextStep}
                disabled={!selections[currentStepData.key]}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg
                    ${!selections[currentStepData.key] 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30 hover:scale-105'
                    }`}
            >
                {step === 3 ? 'View My Solutions' : 'Next Step'} <FaArrowRight />
            </button>
        </div>

      </div>
    </div>
  );
}
