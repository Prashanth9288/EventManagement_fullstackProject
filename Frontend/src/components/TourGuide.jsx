import React, { useState, useEffect } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useTheme } from '../context/ThemeContext';

const TourGuide = () => {
  const { theme } = useTheme();
  const [run, setRun] = useState(false);
  
  const steps = [
    {
      target: 'body',
      content: 'Welcome to your Event Management Dashboard! Let us take a quick tour.',
      placement: 'center',
    },
    {
      target: '#dashboard-sidebar', // Assumes Sidebar has this ID
      content: 'Here you can navigate to My Events, Create Event, and more.',
    },
    {
      target: '#user-profile', // Assumes Profile section has this ID
      content: 'Manage your profile and settings here.',
    },
     {
      target: '#customize-theme-btn', // Assumes we add this button
      content: 'Corporate users can customize their brand colors here.',
    }
  ];

  useEffect(() => {
    // Check if user has taken the tour
    const tourTaken = localStorage.getItem('tourTaken');
    if (!tourTaken) {
      setRun(true);
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('tourTaken', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      styles={{
        options: {
          primaryColor: theme.primaryColor,
          textColor: '#333',
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default TourGuide;
