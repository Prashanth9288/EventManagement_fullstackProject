
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import OrganizerDashboard from "../Organizer/OrganizerDashboard";
import AttendeeDashboard from "./AttendeeDashboard";

export default function Dashboard() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role || 'user'); // Default to user if no role
      } catch (e) {
        console.error("Token decode error", e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen pt-20 flex justify-center items-center">Loading Dashboard...</div>;

  if (role === 'organizer' || role === 'admin') {
    return <OrganizerDashboard />;
  }

  return <AttendeeDashboard />;
}
