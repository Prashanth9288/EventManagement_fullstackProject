// import { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import "./App.css";

// import Navbar from "./compoenets/BeNavbar";
// import NavbarAfterLogin from "./compoenets/AfNavbar";

// import Home from "./Pages/Home";
// import MyEvents from "./Pages/MyEvents"; // Correctly import MyEvents
// import EventDetails from "./Pages/EventDetails";
// import CreateEvent from "./Pages/CreateEvent";
// import Login from "./Pages/Login";
// import Signup from "./Pages/Signup";
// import Dashboard from "./Pages/Dashboard";

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("userToken");
//     const userData = localStorage.getItem("userData");
//     if (token && userData) {
//       setUser(JSON.parse(userData));
//     }
//   }, []);

//   return (
//     <Router>
//       {user ? <NavbarAfterLogin user={user} setUser={setUser} /> : <Navbar />}
//       <div className="pt-20">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           {/* This route should now use MyEvents */}
//           <Route
//             path="/events"
//             element={user ? <MyEvents user={user} /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/events/:id"
//             element={user ? <EventDetails user={user} /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/create-event"
//             element={
//               user ? <CreateEvent user={user} /> : <Navigate to="/login" />
//             }
//           />
//           <Route path="/login" element={<Login setUser={setUser} />} />
//           <Route path="/signup" element={<Signup setUser={setUser} />} />
//           <Route
//             path="/dashboard"
//             element={
//               user ? <Dashboard user={user} /> : <Navigate to="/login" />
//             }
//           />
//           {/* This route was also causing the error. Update it to use MyEvents */}
//           <Route
//             path="/protected-events"
//             element={user ? <MyEvents user={user} /> : <Navigate to="/login" />}
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import "./App.css";

// import Navbar from "./compoenets/BeNavbar";
// import NavbarAfterLogin from "./compoenets/AfNavbar";

// import Home from "./Pages/Home";
// import MyEvents from "./Pages/MyEvents";
// import EventDetails from "./Pages/EventDetails";
// import CreateEvent from "./Pages/CreateEvent";
// import Login from "./Pages/Login";
// import Signup from "./Pages/Signup";
// import Dashboard from "./Pages/Dashboard";

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // Add a loading state

//   useEffect(() => {
//     const token = localStorage.getItem("userToken");
//     const userData = localStorage.getItem("userData");
//     if (token && userData) {
//       setUser(JSON.parse(userData));
//     }
//     setLoading(false); // Set loading to false after checking for token
//   }, []);

//   // If the app is still loading, show a loading message or spinner
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Router>
//       {user ? <NavbarAfterLogin user={user} setUser={setUser} /> : <Navbar />}
//       <div className="pt-20">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route
//             path="/events"
//             element={user ? <MyEvents user={user} /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/events/:id"
//             element={
//               user ? <EventDetails user={user} /> : <Navigate to="/login" />
//             }
//           />
//           <Route
//             path="/create-event"
//             element={
//               user ? <CreateEvent user={user} /> : <Navigate to="/login" />
//             }
//           />
//           <Route path="/login" element={<Login setUser={setUser} />} />
//           <Route path="/signup" element={<Signup setUser={setUser} />} />
//           <Route
//             path="/dashboard"
//             element={
//               user ? <Dashboard user={user} /> : <Navigate to="/login" />
//             }
//           />
//           <Route
//             path="/protected-events"
//             element={user ? <MyEvents user={user} /> : <Navigate to="/login" />}
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // <-- Make sure to import this
import "./App.css";

import Navbar from "./compoenets/BeNavbar";
import NavbarAfterLogin from "./compoenets/AfNavbar";

import Home from "./Pages/Home";
import MyEvents from "./Pages/MyEvents";
import EventDetails from "./Pages/EventDetails";
import CreateEvent from "./Pages/CreateEvent";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";

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
        if (decodedToken.exp * 1000 < Date.now()) {
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
    <Router>
      {user ? <NavbarAfterLogin user={user} setUser={setUser} /> : <Navbar />}
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/events"
            element={user ? <MyEvents user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/events/:id"
            element={
              user ? <EventDetails user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/create-event"
            element={
              user ? <CreateEvent user={user} /> : <Navigate to="/login" />
            }
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/protected-events"
            element={user ? <MyEvents user={user} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
