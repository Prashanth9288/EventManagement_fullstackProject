import React from 'react';
import Footer from '../../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDF7] dark:bg-mirage transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-bluewood rounded-full shadow-sm border border-gray-100 dark:border-fiord mb-8">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Our Story</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight max-w-4xl">
          Revolutionizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">Event</span> Management
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-500 dark:text-lynch mb-10 max-w-2xl leading-relaxed">
          We believe in bringing people together through seamless, memorable, and impactful experiences.
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-white dark:bg-bluewood transition-colors flex-[1]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-3xl transform rotate-3 opacity-20"></div>
                <div className="relative bg-gray-50 dark:bg-mirage rounded-3xl p-10 h-80 flex items-center justify-center border border-gray-100 dark:border-fiord">
                    <span className="text-9xl">🚀</span>
                </div>
            </div>
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 dark:text-lynch mb-6 leading-relaxed">
                    EventHub was born from a simple idea: organizing events shouldn't be stressful. Whether it's a small meetup or a large conference, the process should be intuitive, powerful, and fun.
                </p>
                <p className="text-lg text-gray-600 dark:text-lynch leading-relaxed">
                    Our platform empowers organizers with tools to manage everything from RSVPs to ticketing, while giving attendees a delightful discovery experience.
                </p>
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[ 
                { label: 'Events Hosted', value: '10K+' },
                { label: 'Active Users', value: '50K+' },
                { label: 'Countries', value: '20+' },
                { label: 'Happiness Score', value: '4.9/5' }
            ].map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-bluewood p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-fiord">
                    <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">{stat.value}</div>
                    <div className="text-gray-500 dark:text-lynch font-medium">{stat.label}</div>
                </div>
            ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
