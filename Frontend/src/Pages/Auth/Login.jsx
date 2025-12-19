import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("userToken", data.accessToken);

      const payload = jwtDecode(data.accessToken);
      const userObj = {
        _id: payload.id || null,
        email: payload.email || formData.email,
        name: data.name || formData.email || "User",
        role: payload.role || "user" // Extract role from token
      };

      localStorage.setItem("userData", JSON.stringify(userObj));
      localStorage.setItem("user", JSON.stringify(userObj));

      if (setUser) setUser(userObj);

      // Role-Based Redirect
      if (userObj.role === 'organizer') {
        navigate("/organizer-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDF7] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md border border-gray-100 relative z-10 mx-4">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg mx-auto mb-4">
            E
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500">Sign in to access your events</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm flex items-center gap-2 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 hover:bg-white"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-xs text-teal-600 hover:text-teal-700 font-medium">Forgot Password?</a>
            </div>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/50 hover:bg-white"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-teal-500/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal-600 font-bold hover:text-teal-700 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
