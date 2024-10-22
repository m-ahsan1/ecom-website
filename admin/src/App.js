import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import Admin from "./Pages/Admin";
import AdminLogin from "./Components/Auth/AdminLogin";

export const backend_url = "http://localhost:4000";
export const currency = "$";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const expirationTime = localStorage.getItem("expirationTime");
    const currentTime = new Date().getTime();

    // Check if the session is still valid based on expiration time
    if (
      authStatus === "true" &&
      expirationTime &&
      currentTime < expirationTime
    ) {
      setIsAuthenticated(true);
    } else {
      // If session expired or user not authenticated, log out
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("expirationTime");
      setIsAuthenticated(false);
    }
  }, []);

  // useEffect(() => {
  //   let idleTimeout;
  //   const sessionDuration = 30 * 60 * 1000; // 30 minutes

  //   const resetTimeout = () => {
  //     clearTimeout(idleTimeout);
  //     idleTimeout = setTimeout(() => {
  //       localStorage.removeItem("isAuthenticated");
  //       localStorage.removeItem("expirationTime");
  //       setIsAuthenticated(false);
  //       window.location.href = "/login"; // Redirect to login on timeout
  //     }, sessionDuration);
  //   };

  //   window.onload = resetTimeout;
  //   document.onmousemove = resetTimeout;
  //   document.onkeydown = resetTimeout;

  //   return () => {
  //     clearTimeout(idleTimeout);
  //     window.onload = null;
  //     document.onmousemove = null;
  //     document.onkeydown = null;
  //   };
  // }, []);

  return (
    <BrowserRouter>
      <div>
        <Navbar />

        <Routes>
          <Route
            path="/login"
            element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/admin" : "/login"} />}
          />
          {isAuthenticated && <Route path="/admin/*" element={<Admin />} />}
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
