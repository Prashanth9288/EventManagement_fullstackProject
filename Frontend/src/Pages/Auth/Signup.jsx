// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      // Signup success, navigate to login
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFDF7] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl -z-10 -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl -z-10 translate-x-1/3 translate-y-1/3"></div>

      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md border border-gray-100 relative z-10 mx-4">
        <div className="text-center mb-8">
           <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg mx-auto mb-4">
            E
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500">Join thousands of event enthusiasts</p>
        </div>

        {/* Role Selector */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button 
                type="button"
                onClick={() => handleRoleChange('user')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.role === 'user' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Attendee
            </button>
            <button 
                type="button"
                onClick={() => handleRoleChange('organizer')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.role === 'organizer' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Organizer
            </button>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm flex items-center gap-2 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full Name</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 hover:bg-white"
            />
          </div>
            
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 hover:bg-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 hover:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-2 ${formData.role === 'organizer' ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/30' : 'bg-gray-900 hover:bg-gray-800'}`}
          >
            {loading ? "Creating Account..." : `Sign Up as ${formData.role === 'organizer' ? 'Organizer' : 'Attendee'}`}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 font-bold hover:text-teal-700 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
