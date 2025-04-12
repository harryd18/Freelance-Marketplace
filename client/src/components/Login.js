import React, { useState } from "react";
import { loginUser } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await loginUser(email, password);
      console.log("Raw Login Response:", res);

      if (res.token && res.user) {
        localStorage.setItem("token", res.token);

        if (res.user.role === "client") {
          window.location.href = "/client-dashboard";
        } else if (res.user.role === "freelancer") {
          window.location.href = "/dashboard";
        }
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Freelance Marketplace</h2>
      <h4>Login</h4>
      <input
        className="form-control my-2"
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="form-control my-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
};

export default Login;
