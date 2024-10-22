import React, { useState } from "react";
import "./AdminLogin.css";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const hardcodedUsername = "admin";
  const hardcodedPassword = "admin123";

  const handleLogin = () => {
    if (username === hardcodedUsername && password === hardcodedPassword) {
      setIsAuthenticated(true);
      const sessionDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
      const expirationTime = new Date().getTime() + sessionDuration;

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("expirationTime", expirationTime);
      console.log("Logged in as admin");
      navigate("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
