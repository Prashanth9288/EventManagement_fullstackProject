import Footer from "../components/Footer";
import { FaBolt, FaShieldAlt, FaChartLine, FaUsers, FaMagic, FaMobileAlt } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: <FaBolt />,
      title: "Lightning Fast Event Creation",
      desc: "Create and publish events in seconds with our intuitive, streamline interface designed for speed and simplicity."
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Payments & Data",
      desc: "Enterprise-grade security for all transactions and user data. We prioritize safety so you can focus on hosting."
    },
    {
      icon: <FaChartLine />,
      title: "Real-time Analytics",
      desc: "Track views, RSVPs, and engagement in real-time. Make data-driven decisions to optimize your event's reach."
    },
    {
      icon: <FaUsers />,
      title: "Community Growth Tools",
      desc: "Built-in networking features to help attendees connect. Foster a thriving community around your events."
    },
    {
      icon: <FaMagic />,
      title: "AI-Powered Recommendations",
      desc: "Our smart engine suggests events to users based on their interests, increasing attendance and relevance."
    },
    {
      icon: <FaMobileAlt />,
      title: "Fully Responsive Design",
      desc: "Manage your events on the go. Our platform looks and works perfectly on mobile, tablet, and desktop."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDF7] flex flex-col pt-20">
      
      {/* Hero Section */}
      <div className="bg-gray-900 border-b border-gray-100 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 to-gray-900 z-0"></div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 font-bold text-sm mb-6 uppercase tracking-wider">
            Premium Features
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-tight">
            Everything you need to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Host World-Class Events</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            From powerful analytics to seamless ticketing, EventHub gives you the tools to create unforgettable experiences.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20 flex-1">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-50 to-emerald-100 rounded-2xl flex items-center justify-center text-2xl text-teal-600 mb-6 group-hover:scale-110 transition-transform shadow-inner border border-teal-100/50">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-12 text-center shadow-xl shadow-teal-500/20 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/qv-stripes.png')] opacity-10"></div>
           <div className="relative z-10">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to see it in action?</h2>
             <p className="text-teal-50 text-lg mb-8 max-w-xl mx-auto">Join thousands of event organizers who trust EventHub to power their communities.</p>
             <button className="bg-white text-teal-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-lg hover:scale-105 transform duration-200">
               Get Started for Free
             </button>
           </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
