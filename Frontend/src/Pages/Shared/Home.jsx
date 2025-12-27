// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Hero Section */}
//       <section className="flex-1 flex flex-col items-center justify-center text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6">
//         <h1 className="text-4xl md:text-6xl font-bold mb-4">
//           Welcome to EventPlatform 🎉
//         </h1>
//         <p className="text-lg md:text-xl mb-6 max-w-2xl">
//           Discover, create, and join amazing events around you. Manage
//           everything in one place with ease.
//         </p>
//         <div className="flex gap-4">
//           <Link
//             to="/events"
//             className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
//           >
//             Explore Events
//           </Link>
//           <Link
//             to="/signup"
//             className="px-6 py-3 bg-indigo-700 font-semibold rounded-lg shadow-lg hover:bg-indigo-800 transition"
//           >
//             Get Started
//           </Link>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-16 bg-gray-50">
//         <div className="max-w-6xl mx-auto px-6">
//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
//             Why Choose EventPlatform?
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="p-6 bg-white shadow-md rounded-lg text-center">
//               <span className="text-4xl">📅</span>
//               <h3 className="text-xl font-semibold mt-4">Easy Scheduling</h3>
//               <p className="text-gray-600 mt-2">
//                 Create and manage events effortlessly with our intuitive tools.
//               </p>
//             </div>
//             <div className="p-6 bg-white shadow-md rounded-lg text-center">
//               <span className="text-4xl">🤝</span>
//               <h3 className="text-xl font-semibold mt-4">Engage Attendees</h3>
//               <p className="text-gray-600 mt-2">
//                 RSVP system, comments, and updates keep your audience connected.
//               </p>
//             </div>
//             <div className="p-6 bg-white shadow-md rounded-lg text-center">
//               <span className="text-4xl">🌍</span>
//               <h3 className="text-xl font-semibold mt-4">Discover Events</h3>
//               <p className="text-gray-600 mt-2">
//                 Explore nearby or trending events tailored to your interests.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-white border-t border-slate-200">
//         <div className="container mx-auto px-6 py-16">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
//             <div>
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-lg">
//                   📅
//                 </div>
//                 <h3 className="font-semibold text-xl text-gray-800">
//                   EventHub
//                 </h3>
//               </div>
//               <p className="text-gray-600 leading-relaxed">
//                 Creating amazing event experiences through innovative design and
//                 technology.
//               </p>
//             </div>

//             <div>
//               <h4 className="font-bold text-gray-800 mb-6 text-lg">Product</h4>
//               <ul className="space-y-3">
//                 <li>
//                   <a
//                     href="#"
//                     className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//                   >
//                     Event Manager
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//                   >
//                     Pricing
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//                   >
//                     Templates
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//                   >
//                     Integrations
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-bold text-gray-800 mb-6 text-lg">Company</h4>
//               <ul className="space-y-3">
//                 <li>
//                   <a
//                     href="#"
//                     className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//                   >
//                     About
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//                   >
//                     Blog
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//                   >
//                     Careers
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//                   >
//                     Contact
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-bold text-gray-800 mb-6 text-lg">Support</h4>
//               <ul className="space-y-3">
//                 <li>
//                   <a
//                     href="#"
//                     className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//                   >
//                     Help Center
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//                   >
//                     Documentation
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//                   >
//                     Community
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//                   >
//                     Status
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
//             <div className="text-gray-600">
//               © 2025 EventHub. All rights reserved.
//             </div>
//             <div className="flex gap-8 mt-4 md:mt-0">
//               <a
//                 href="#"
//                 className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//               >
//                 Privacy
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//               >
//                 Terms
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
//               >
//                 Cookies
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import SolutionFinder from "../../components/SolutionFinder";

// A new component to display each event card
function EventCard({ event }) {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="bg-white dark:bg-bluewood rounded-2xl shadow-sm border border-orange-100/50 dark:border-fiord overflow-hidden cursor-pointer transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group"
      onClick={() => navigate(`/events/${event._id}`)}
    >
      <div className="p-6 relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-400 via-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600 mb-2 tracking-wide uppercase">{formatDate(event.start)}</p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{event.title}</h3>
        <p className="text-gray-500 dark:text-lynch leading-relaxed line-clamp-2">{event.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full border border-orange-100 uppercase tracking-wider">
            {event.privacy}
          </span>
          <span className="text-gray-300 group-hover:text-teal-500 transition-colors">→</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSolutionFinder, setShowSolutionFinder] = useState(false);

  useEffect(() => {
    const fetchPopularEvents = async () => {
      try {
        const response = await fetch(window.API_BASE_URL + "/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching popular events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularEvents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-base)] dark:bg-mirage transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-20 flex flex-col items-center text-center overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl -z-10"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-bluewood rounded-full shadow-sm border border-gray-100 dark:border-fiord mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-teal-500"></span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">The Ultimate Event Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight max-w-5xl">
          Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">Amazing</span> Events
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-500 dark:text-lynch mb-10 max-w-2xl leading-relaxed">
          The complete event management platform to create, organize, and manage unforgettable experiences.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            to="/create-event"
            className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Create Your First Event <span>→</span>
          </Link>
          <button
            onClick={() => setShowSolutionFinder(true)}
            className="px-8 py-4 bg-white text-gray-700 font-bold text-lg rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
          >
            Find Your Solution
          </button>
        </div>
      </section>

      <SolutionFinder isOpen={showSolutionFinder} onClose={() => setShowSolutionFinder(false)} />

      {/* Features Grid - As per mockup */}
      <section id="features" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Card 1: Event Creation */}
            <div className="bg-white dark:bg-bluewood p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-fiord hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-blue-500/30">
                📅
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Event Creation</h3>
              <p className="text-gray-500 dark:text-lynch leading-relaxed">
                Create and manage amazing events with our powerful wizard.
              </p>
            </div>

            {/* Card 2: RSVP Management */}
            <div className="bg-white dark:bg-bluewood p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-fiord hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-emerald-500/30">
                👥
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">RSVP Management</h3>
              <p className="text-gray-500 dark:text-lynch leading-relaxed">
                Track attendees and manage registrations effortlessly.
              </p>
            </div>

            {/* Card 3: Lightning Fast */}
            <div className="bg-white dark:bg-bluewood p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-fiord hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-amber-500/30">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-500 dark:text-lynch leading-relaxed">
                Experience blazing speed with our optimized platform.
              </p>
            </div>

            {/* Card 4: Made with Love */}
            <div className="bg-white dark:bg-bluewood p-8 rounded-3xl shadow-sm border-2 border-blue-500/10 dark:border-blue-500/20 hover:border-blue-500 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-pink-500 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-pink-500/30">
                  ❤️
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Made with Love</h3>
                <p className="text-gray-500 dark:text-lynch leading-relaxed">
                  Crafted with passion and attention to every detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Large Feature Highlights */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Features</span>
            </h2>
             <p className="text-xl text-gray-500">Everything you need to create, manage, and track successful events</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-8">
                {[
                  { icon: '📅', title: 'Event Creation Wizard', desc: 'Step-by-step wizard to create professional events.', color: 'blue' },
                  { icon: '👥', title: 'RSVP Management', desc: 'Track attendees, manage registrations, and handle waitlists.', color: 'emerald' },
                  { icon: '⭐', title: 'Timeline & Analytics', desc: 'Visualize your events on a timeline and get insights.', color: 'amber' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-6 p-4 rounded-2xl hover:bg-white dark:hover:bg-bluewood hover:shadow-lg transition-all duration-300 cursor-default">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl bg-${feature.color}-100 text-${feature.color}-600`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                      <p className="text-gray-500 dark:text-lynch">{feature.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-12 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center text-4xl shadow-xl shadow-teal-500/20 mb-8 text-white">
                    📅
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Try Event Manager</h3>
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto">Click to explore our event management platform</p>
                  <Link to="/events" className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg">
                    Explore Platform
                  </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Popular Events Section */}
      <section className="py-12 px-6 bg-white dark:bg-mirage transition-colors">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Popular Events</h2>
              <p className="text-gray-500 dark:text-lynch text-lg">Don't miss out on these trending experiences</p>
            </div>
            <Link to="/events" className="hidden md:inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700">
              View All Events <span>→</span>
            </Link>
          </div>
          
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <div className="col-span-1 md:col-span-4 text-center py-20">
                <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading events...</p>
              </div>
            ) : events.length > 0 ? (
              events.slice(0, 4).map(e => <EventCard key={e._id} event={e} />)
            ) : (
              <div className="col-span-1 md:col-span-4 text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                  📅
                </div>
                <p className="text-gray-500 font-medium">No events found momentarily.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Events?</span>
            </h2>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of event organizers who trust our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/create-event" className="px-10 py-4 bg-teal-500 text-white font-bold text-lg rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/25">
                Start Creating Events
              </Link>
              <Link to="/pricing" className="px-10 py-4 bg-white/10 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all border border-white/10 backdrop-blur-sm">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
