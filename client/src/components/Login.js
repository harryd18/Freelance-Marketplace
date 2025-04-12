import React, { useState } from "react";
import { loginUser } from "../api/api";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await loginUser(email, password);

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
    <div className="gradient-bg d-flex justify-content-center align-items-center vh-100">
      <div className="p-5 rounded shadow bg-white" style={{ minWidth: "350px" }}>
        <h3 className="text-center mb-4" style={{ color: "#007BFF", fontWeight: "bold" }}>
          Freelance Marketplace
        </h3>
        <h5 className="mb-3">Login</h5>
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-success w-100" onClick={handleLogin}>
          Login
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
        <p className="text-center mt-3">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>

      {/* Gradient Animation Style */}
      <style>{`
        .gradient-bg {
          background: linear-gradient(270deg, #d5e8f7, #e7d8f8, #d1f0e3, #ffe5d9);
          background-size: 800% 800%;
          animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 50%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Login;
