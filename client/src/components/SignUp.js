import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/api";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client"
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    try {
      const res = await registerUser(form);
      alert(res.message || "Registered successfully!");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setError("Registration failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1650&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="bg-light p-5 rounded shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Freelance Marketplace</h2>
        <h4 className="text-center mb-3">Sign Up</h4>
        <input
          className="form-control my-2"
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="form-control my-2"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="form-control my-2"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <select
          className="form-select my-2"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>
        <button className="btn btn-primary w-100 mt-3" onClick={handleSubmit}>
          Register
        </button>
        {error && <p className="text-danger mt-2 text-center">{error}</p>}
        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
