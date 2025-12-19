
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              E
            </div>
            <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
              EventHub
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
              About
            </Link>
            <div className="flex items-center gap-4 ml-4">
              <Link
                to="/login"
                className="px-5 py-2.5 text-gray-700 font-semibold hover:text-teal-600 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-900/20"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none p-2"
            >
              {menuOpen ? (
                <span className="text-2xl">&times;</span>
              ) : (
                <span className="text-2xl">&#9776;</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          <div className="flex flex-col space-y-2 p-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-teal-600 font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-teal-600 font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <hr className="border-gray-100 my-2" />
            <Link
              to="/login"
              className="w-full text-center px-4 py-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              onClick={() => setMenuOpen(false)}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="w-full text-center px-4 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition shadow-lg shadow-teal-500/20"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

