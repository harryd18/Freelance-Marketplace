import React from "react";

const Dashboard = ({ user }) => {
  return (
    <div className="container mt-4">
      <h2>Freelance Marketplace</h2>
      <div className="card p-4 mt-3">
        <h4>Dashboard</h4>
        <p>Welcome, {user?.name || ""}</p>
        <p>Email: {user?.email || ""}</p>
        <p>No projects found.</p>
      </div>
    </div>
  );
};

export default Dashboard;
