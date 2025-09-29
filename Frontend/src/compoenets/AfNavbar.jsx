import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaPlusCircle, FaStar, FaEnvelope } from "react-icons/fa";

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
    { name: "Create Event", path: "/create-event", icon: <FaPlusCircle /> },
    { name: "Features", path: "/features", icon: <FaStar /> },
    { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
              EventPlatform
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium transition"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Profile */}
          <div className="hidden md:flex items-center relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-md border-2 border-white transition-transform transform group-hover:scale-110">
                {user.name[0].toUpperCase()}
              </div>
              <span className="text-gray-700 hover:text-indigo-600 font-medium">{user.name}</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center gap-3">
            {/* Profile */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-md border-2 border-white">
                {user.name[0].toUpperCase()}
              </div>
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none text-2xl"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col space-y-3 p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Profile */}
      {profileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col p-4">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-indigo-600 mb-2"
              onClick={() => setProfileOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setProfileOpen(false);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
