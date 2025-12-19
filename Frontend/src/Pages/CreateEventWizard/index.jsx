import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import WizardLayout from '../../layouts/WizardLayout';
import Step1BasicInfo from './Step1BasicInfo';
import Step2DetailsLocation from './Step2DetailsLocation';
import Step3Settings from './Step3Settings';
import Step4MediaTags from './Step4MediaTags';

const CreateEventWizard = () => {
  const { id } = useParams(); // Get event ID for edit mode
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'social',
    privacy: 'public',
    format: 'physical',
    start: '',
    end: '',
    location: {
      address: '',
      lat: null,
      lng: null,
      placeId: ''
    },
    virtualVenue: { link: '', platform: '' },
    media: { banners: [], logos: [] },
    ticketing: { type: 'free', tiers: [] },
    tags: [],
    settings: {}, // Extra settings
    agenda: []
  });

  useEffect(() => {
    if (id) {
       const fetchEvent = async () => {
           try {
               const token = localStorage.getItem('userToken');
               const res = await axios.get(`http://localhost:5000/api/events/${id}`, {
                   headers: { Authorization: `Bearer ${token}` }
               });
               const data = res.data;
               setFormData({
                   ...data,
                   location: data.location || { address: '', lat: null, lng: null, placeId: '' },
                   virtualVenue: data.virtualVenue || { link: '', platform: '' },
                   media: data.media || { banners: [], logos: [] },
                   ticketing: data.ticketing || { type: 'free', tiers: [] },
                   tags: data.tags || [],
                   agenda: data.agenda || []
               });
           } catch (err) {
               console.error("Failed to fetch event for edit", err);
               alert("Failed to load event details.");
               navigate('/organizer-dashboard');
           }
       };
       fetchEvent();
    }
  }, [id, navigate]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      
      // Validation: Ensure mandatory fields are present
      if (!formData.title || !formData.start) {
        alert("Please fill in all required fields (Title, Start Date).");
        setLoading(false);
        return;
      }

      // Construct payload to match backend schema
      const payload = {
        ...formData,
        // Ensure Dates are legit objects or ISO strings (Components preserve ISO strings mostly)
        start: new Date(formData.start),
        end: formData.end ? new Date(formData.end) : new Date(new Date(formData.start).getTime() + 3600000) // Default 1 hour duration if no end
      };

      // Remove system fields that shouldn't be sent or cause validation errors
      delete payload._id;
      delete payload.host;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;
      delete payload.attendees;

      if (id) {
          // Update
          await axios.put(`http://localhost:5000/api/events/${id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert("Event updated successfully!");
      } else {
          // Create
          await axios.post('http://localhost:5000/api/events', payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert("Event created successfully!");
      }
      
      // Navigate to dashboard
      navigate('/organizer-dashboard');
    } catch (error) {
      console.error("Failed to save event:", error);
      const errorMsg = error.response?.data?.error || error.message || "Unknown error";
      alert(`Failed to save event: ${errorMsg}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <WizardLayout step={step} totalSteps={4} title={id ? "Edit Event" : "Create New Event"}>
      {step === 1 && (
        <Step1BasicInfo 
          formData={formData} 
          updateFormData={updateFormData} 
          nextStep={nextStep} 
        />
      )}
      {step === 2 && (
        <Step2DetailsLocation 
          formData={formData} 
          updateFormData={updateFormData} 
          nextStep={nextStep} 
          prevStep={prevStep}
        />
      )}
      {step === 3 && (
        <Step3Settings 
          formData={formData} 
          updateFormData={updateFormData} 
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 4 && (
        <Step4MediaTags 
          formData={formData} 
          updateFormData={updateFormData} 
          handleFinalSubmit={handleFinalSubmit}
          prevStep={prevStep}
        />
      )}
    </WizardLayout>
  );
};

export default CreateEventWizard;
