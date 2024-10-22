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
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

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
