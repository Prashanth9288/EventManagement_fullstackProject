import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaPlusCircle, FaStar, FaEnvelope, FaBell, FaCheckDouble } from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown";

export default function NavbarAfterLogin({ user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    if (setUser) setUser(null);
    navigate("/login");
  };

  if (!user) return null;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Events", path: "/events", icon: <FaCalendarAlt /> },
    { name: "Features", path: "/features", icon: <FaStar /> },
    { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 fixed w-full top-0 left-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              E
            </div>
            <Link to="/dashboard" className="text-2xl font-bold text-gray-900 tracking-tight">
              EventHub
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl font-medium transition-all"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Section: Notifications & Profile */}
          <div className="hidden md:flex items-center gap-4 relative">
             
             {/* Notification Bell */}
             <NotificationDropdown user={user} />

             {/* Profile Dropdown */}
            <div className="relative">
                <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 focus:outline-none group px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                >
                <span className="text-gray-700 font-medium group-hover:text-teal-600 transition-colors">{user.name}</span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold shadow-md border-2 border-white ring-2 ring-gray-50 group-hover:ring-teal-100 transition-all">
                    {user.name && user.name[0] ? user.name[0].toUpperCase() : 'U'}
                </div>
                </button>
                {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in-down">
                    <div className="px-4 py-3 border-b border-gray-50 mb-2">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user.email || user.name}</p>
                    </div>
                    <Link
                    to="/dashboard"
                    className="block px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 mx-2 rounded-xl transition-colors"
                    onClick={() => setProfileOpen(false)}
                    >
                    <FaHome className="text-gray-400" /> Dashboard
                    </Link>
                    <Link
                    to="/my-tickets"
                    className="block px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 mx-2 rounded-xl transition-colors"
                    onClick={() => setProfileOpen(false)}
                    >
                    <FaStar className="text-gray-400" /> My Tickets
                    </Link>
                    <div className="border-t border-gray-50 my-2"></div>
                    <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-2 mx-2 rounded-xl transition-colors max-w-[calc(100%-16px)]"
                    >
                    Logout
                    </button>
                </div>
                )}
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center gap-3">
             <NotificationDropdown user={user} />
            
            {/* Profile */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold shadow-md">
                {user.name && user.name[0] ? user.name[0].toUpperCase() : 'U'}
              </div>
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none text-2xl p-2"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl h-screen">
          <div className="flex flex-col space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-teal-50 hover:text-teal-700 rounded-xl font-medium"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-lg text-teal-500">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Mobile Profile logic remains same, Mobile Notifications overlay removed as Dropdown handles it */}
      {profileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl top-[65px] z-40">
          <div className="flex flex-col p-4">
             <div className="px-4 py-2 border-b border-gray-50 mb-2">
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
             </div>
            <Link
              to="/dashboard"
              className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
              onClick={() => setProfileOpen(false)}
            >
              Dashboard
            </Link>
             <Link
              to="/my-tickets"
              className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
              onClick={() => setProfileOpen(false)}
            >
              My Tickets
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setProfileOpen(false);
              }}
              className="mt-2 w-full text-left px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-xl"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
