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
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
      onClick={() => navigate(`/events/${event._id}`)}
    >
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-2">{formatDate(event.start)}</p>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        <p className="text-gray-600 truncate">{event.description}</p>
        <div className="mt-4">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {event.privacy}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularEvents = async () => {
      try {
        // We fetch from the public events endpoint
        const response = await fetch("http://localhost:5000/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        // Assuming the API returns an object with an 'events' array
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
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to EventPlatform 🎉
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl">
          Discover, create, and join amazing events around you. Manage
          everything in one place with ease.
        </p>
        <div className="flex gap-4">
          <Link
            to="/events"
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Explore Events
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 bg-indigo-700 font-semibold rounded-lg shadow-lg hover:bg-indigo-800 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose EventPlatform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white shadow-md rounded-lg text-center">
              <span className="text-4xl">📅</span>
              <h3 className="text-xl font-semibold mt-4">Easy Scheduling</h3>
              <p className="text-gray-600 mt-2">
                Create and manage events effortlessly with our intuitive tools.
              </p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg text-center">
              <span className="text-4xl">🤝</span>
              <h3 className="text-xl font-semibold mt-4">Engage Attendees</h3>
              <p className="text-gray-600 mt-2">
                RSVP system, comments, and updates keep your audience connected.
              </p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg text-center">
              <span className="text-4xl">🌍</span>
              <h3 className="text-xl font-semibold mt-4">Discover Events</h3>
              <p className="text-gray-600 mt-2">
                Explore nearby or trending events tailored to your interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Powerful <span className="gradient-text-features">Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Everything you need to create, manage, and track successful events
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="flex items-start gap-6 group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Event Creation Wizard
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Step-by-step wizard to create professional events with all
                    the details you need.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
                    RSVP Management
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Track attendees, manage registrations, and handle waitlists
                    seamlessly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                    Timeline & Analytics
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Visualize your events on a timeline and get insights with
                    detailed analytics.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 via-blue-50 to-orange-100 rounded-3xl p-12 text-center shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 cursor-pointer group">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <span className="text-white text-4xl">📅</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                  Try Event Manager
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Click to explore our event management platform
                </p>
                <button className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Events Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold text-gray-800 mb-12 text-center">
            Popular Events
          </h3>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <div className="col-span-1 md:col-span-4 text-center py-20">
                <p className="text-gray-500 text-xl">Loading events...</p>
              </div>
            ) : events.length > 0 ? (
              events.slice(0, 4).map(
                (
                  e // Show only the first 4 events
                ) => <EventCard key={e._id} event={e} />
              )
            ) : (
              <div className="col-span-1 md:col-span-4 text-center py-20">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-gray-400 text-3xl">📅</span>
                </div>
                <p className="text-gray-500 text-xl">
                  No popular events to show right now.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 px-6 py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-2xl">
              Ready to Create{" "}
              <span className="gradient-text-events-white">Events</span>?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              Join thousands of event organizers who trust our platform for
              their events
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="group px-10 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-2xl hover:shadow-green-500/25 relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative group-hover:translate-x-1 transition-transform duration-300">
                  Start Creating Events →
                </span>
              </button>
              <button className="group px-10 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
                <span className="group-hover:text-purple-100 transition-colors duration-300">
                  View Pricing
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-lg">
                  📅
                </div>
                <h3 className="font-semibold text-xl text-gray-800">
                  EventHub
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Creating amazing event experiences through innovative design and
                technology.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-6 text-lg">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Event Manager
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-6 text-lg">Company</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-6 text-lg">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600">
              © 2025 EventHub. All rights reserved.
            </div>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
