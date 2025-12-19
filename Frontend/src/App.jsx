import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";

import Navbar from "./components/BeNavbar";
import NavbarAfterLogin from "./components/AfNavbar";

// import TourGuide from "./components/TourGuide";
import VirtualLobby from "./Pages/Shared/VirtualLobby";
import NetworkingHub from "./Pages/Shared/NetworkingHub";
import Home from "./Pages/Shared/Home";
import MyEvents from "./Pages/Attendee/MyEvents";
import EventDetails from "./Pages/Shared/EventDetails";
// import CreateEvent from "./Pages/CreateEvent"; // Legacy removed

import CreateEventWizard from "./Pages/Organizer/CreateEventWizard";
import RSVPDashboard from "./Pages/Attendee/RSVPDashboard";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import OrganizerDashboard from "./Pages/Organizer/OrganizerDashboard";
import OrganizerEventDetails from "./Pages/Organizer/OrganizerEventDetails";
import OrganizerEventHub from "./Pages/Organizer/OrganizerEventHub";
import AttendeeDashboard from "./Pages/Attendee/AttendeeDashboard";
import Features from "./Pages/Shared/Features";
import Contact from "./Pages/Shared/Contact";
import { ThemeProvider } from "./context/ThemeContext";
import BrandingSettings from "./components/BrandingSettings";

// Internal Layout Component to handle conditional rendering based on route
function Layout({ children, user, setUser }) {
  const location = useLocation();
  const organizerRoutes = ["/organizer-dashboard", "/create-event", "/create-event-wizard", "/organizer/event"];
  const isOrganizerRoute = organizerRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      <BrandingSettings />
      {!isOrganizerRoute && (
        user ? <NavbarAfterLogin user={user} setUser={setUser} /> : <Navbar />
      )}
      
      {/* If Organizer Route, don't add padding. Else add pt-20 */}
      <div className={isOrganizerRoute ? "" : "pt-20"}>
        {children}
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if token expiration time (in seconds) is in the past
        const decoded = jwtDecode(token);
        // Check expiry
        if (decoded.exp * 1000 < Date.now()) {
          // Token is expired, so clear it
          localStorage.removeItem("userToken");
          localStorage.removeItem("userData");
          setUser(null);
        } else {
          // Token is still valid
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        // If token is malformed, clear it
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        setUser(null);
      }
    }
    setLoading(false); // Done checking, stop loading
  }, []);

  // Show a loading indicator while we check the token
  if (loading) {
    return <div>Loading application...</div>;
  }

  return (
    <ThemeProvider>
      <Router>
{/* <TourGuide /> */}
        <Layout user={user} setUser={setUser}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/events"
              element={<AttendeeDashboard user={user} />}
            />
            <Route
              path="/my-events"
              element={user ? <MyEvents user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/events/:id"
              element={
                user ? <EventDetails user={user} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/event/:id/lobby"
              element={
                user ? <VirtualLobby /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/networking"
              element={
                user ? <NetworkingHub /> : <Navigate to="/login" />
              }
            />
              <Route
                path="/create-event"
                element={
                  user ? <CreateEventWizard /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/edit-event/:id"
                element={
                  user ? <CreateEventWizard /> : <Navigate to="/login" />
                }
              />
            <Route
              path="/create-event-wizard"
              element={
                user ? <CreateEventWizard /> : <Navigate to="/login" />
              }
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            
            {/* Role-Based Dashboards */}
            <Route
              path="/dashboard"
              element={
                user ? <AttendeeDashboard user={user} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/organizer-dashboard"
              element={
                user ? <OrganizerDashboard user={user} /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/organizer/event/:id"
              element={
                user ? <OrganizerEventDetails /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/organizer/event/:id/hub"
              element={
                  user ? <OrganizerEventHub /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/protected-events"
              element={user ? <MyEvents user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-tickets"
              element={user ? <RSVPDashboard /> : <Navigate to="/login" />}
            />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
