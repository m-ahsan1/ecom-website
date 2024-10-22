import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const hardcodedUsername = "admin";
  const hardcodedPassword = "admin123";

  const handleLogin = () => {
    if (username === hardcodedUsername && password === hardcodedPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      console.log("Logged in as admin");
      navigate("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AdminLogin;
