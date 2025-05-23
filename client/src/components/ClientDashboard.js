import React, { useEffect, useState } from "react";
import { getProtectedData, postJob, deleteJob, updateJob } from '../api/api';


function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: "", description: "", budget: "" });
  const [editingJobId, setEditingJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({ title: "", description: "", budget: "" });

  useEffect(() => {
    getProtectedData(token)
      .then(data => {
        setUser(data.user);
        setJobs(data?.data?.userProjects || []);
      })
      .catch(err => console.error("Error fetching user data", err));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  function handlePostJob() {
    postJob(newJob, token)
      .then(data => {
        alert(data.message || "Job posted");
        window.location.reload();
      })
      .catch(err => {
        console.error("Post Job Error:", err);
        alert("Something went wrong.");
      });
  }

  function handleDelete(jobId) {
    fetch("https://freelance-marketplace-aetf.onrender.com/api/delete_job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ job_id: jobId })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Job deleted");
        setJobs(jobs.filter(job => job.id !== jobId));
      })
      .catch(err => {
        console.error("Delete Error:", err);
        alert("Failed to delete job");
      });
  }

  function handleEdit(job) {
    setEditingJobId(job.id);
    setEditedJob({
      title: job.title,
      description: job.description,
      budget: job.budget
    });
  }

  function handleSaveEdit(jobId) {
    fetch("https://freelance-marketplace-aetf.onrender.com/api/updated_job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        job_id: jobId,
        ...editedJob
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Job updated");
        setEditingJobId(null);
        window.location.reload();
      })
      .catch(err => {
        console.error("Edit Job Error:", err);
        alert("Something went wrong.");
      });
  }

  function handleCancelEdit() {
    setEditingJobId(null);
  }

  return (
    <div className="client-dashboard-container">
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-white">Client Dashboard</h2>
          <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
        </div>

        {user && (
          <div className="mb-4 glass-card p-3 text-white">
            <p><strong>Welcome:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        )}

        <div className="glass-card p-4 mb-5">
          <h5 className="mb-3 text-white">Post a New Job</h5>
          <div className="row g-2">
            <div className="col-md-3">
              <input type="text" className="form-control rounded-pill" placeholder="Job Title"
                value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })}
              />
            </div>
            <div className="col-md-5">
              <textarea className="form-control rounded-4" placeholder="Job Description"
                value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input type="number" className="form-control rounded-pill" placeholder="Budget"
                value={newJob.budget} onChange={e => setNewJob({ ...newJob, budget: e.target.value })}
              />
            </div>
            <div className="col-md-2 d-grid">
              <button className="btn btn-success rounded-pill fw-semibold" onClick={handlePostJob}>Post</button>
            </div>
          </div>
        </div>

        <h5 className="text-white">Your Posted Jobs</h5>
        {jobs.length === 0 ? (
          <p className="text-light">No jobs posted yet.</p>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="glass-card p-4 mb-4">
              {editingJobId === job.id ? (
                <>
                  <input type="text" className="form-control mb-2"
                    value={editedJob.title} onChange={e => setEditedJob({ ...editedJob, title: e.target.value })}
                  />
                  <textarea className="form-control mb-2"
                    value={editedJob.description} onChange={e => setEditedJob({ ...editedJob, description: e.target.value })}
                  />
                  <input type="number" className="form-control mb-3"
                    value={editedJob.budget} onChange={e => setEditedJob({ ...editedJob, budget: e.target.value })}
                  />
                  <div className="d-flex gap-2">
                    <button className="btn btn-success btn-sm" onClick={() => handleSaveEdit(job.id)}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h6 className="fw-bold text-white">{job.title}</h6>
                  <p className="text-light">{job.description}</p>
                  <p className="text-info fw-semibold">Budget: ${job.budget}</p>
                  <div className="d-flex gap-2 mb-3">
                    <button className="btn btn-outline-warning btn-sm" onClick={() => handleEdit(job)}>Edit</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(job.id)}>Delete</button>
                  </div>

                  {job.bids && job.bids.length > 0 && (
                    <div className="text-light mt-2">
                      <strong>Bids Received:</strong>
                      <ul className="mt-1">
                        {job.bids.map((bid, index) => (
                          <li key={index}>
                            {bid.freelancer_name} - ${bid.amount}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      <style>{`
        .client-dashboard-container {
          background: linear-gradient(135deg, #1e1d2b, #3a2f63);
          min-height: 100vh;
          color: #ffffff;
          padding: 2rem;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        input.form-control,
        textarea.form-control {
          background: rgba(255, 255, 255, 0.08);
          color: white !important;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          padding: 0.6rem 0.75rem;
          font-size: 14px;
        }

        input.form-control:focus,
        textarea.form-control:focus {
          color: white !important;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #777;
          outline: none;
          box-shadow: none;
        }

        textarea.form-control {
          height: 80px;
          resize: none;
        }

        .form-control::placeholder {
          color: #cccccc;
        }

        .btn-success {
          background-color: #28a745;
          border: none;
          padding: 10px 20px;
          height: 40px;
          font-size: 14px;
          font-weight: bold;
          transition: background 0.3s ease;
          color: white;
        }

        .btn-outline-warning {
          background-color: #ffc107;
          color: black;
        }

        .btn-outline-danger {
          background-color: #dc3545;
          color: white;
        }

        .btn-outline-warning:hover {
          background-color: #e0a800;
        }

        .btn-outline-danger:hover {
          background-color: #c82333;
        }
      `}</style>
    </div>
  );
}

export default ClientDashboard;


