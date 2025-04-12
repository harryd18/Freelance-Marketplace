import React, { useEffect, useState } from "react";

function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: "", description: "", budget: "" });
  const [editingJobId, setEditingJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({ title: "", description: "", budget: "" });

  useEffect(() => {
    fetch("http://localhost:8000/api/protected.php", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setJobs(data.data.userProjects);
      })
      .catch(err => console.error("Error fetching user data", err));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  function handlePostJob() {
    fetch("http://localhost:8000/api/post_job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newJob)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Job posted");
  
        // Refresh job list without reloading page
        return fetch("http://localhost:8000/api/protected.php", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      })
      .then(res => res.json())
      .then(data => {
        setJobs(data.data.userProjects || []);
        setNewJob({ title: "", description: "", budget: "" });
      })
      .catch(err => {
        console.error("Post Job Error:", err);
        alert("Something went wrong.");
      });
  }
  
  

  function handleDelete(jobId) {
    fetch("http://localhost:8000/api/delete_job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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
    fetch("http://localhost:8000/api/updated_job.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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
    <div>
      <h2>Client Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      {user && (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}

      <h4>Post a New Job</h4>
      <input
        type="text"
        placeholder="Job Title"
        value={newJob.title}
        onChange={e => setNewJob({ ...newJob, title: e.target.value })}
      />
      <textarea
        placeholder="Job Description"
        value={newJob.description}
        onChange={e => setNewJob({ ...newJob, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Budget (NZD)"
        value={newJob.budget}
        onChange={e => setNewJob({ ...newJob, budget: e.target.value })}
      />
      <button onClick={handlePostJob}>Post Job</button>

      <h4>Your Posted Jobs</h4>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map(job => (
          <div key={job.id}>
            {editingJobId === job.id ? (
              <div>
                <input
                  type="text"
                  value={editedJob.title}
                  onChange={e => setEditedJob({ ...editedJob, title: e.target.value })}
                />
                <textarea
                  value={editedJob.description}
                  onChange={e => setEditedJob({ ...editedJob, description: e.target.value })}
                />
                <input
                  type="number"
                  value={editedJob.budget}
                  onChange={e => setEditedJob({ ...editedJob, budget: e.target.value })}
                />
                <button onClick={() => handleSaveEdit(job.id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>{job.title}</strong>
                <p>{job.description}</p>
                <p><b>Budget:</b> ${job.budget}</p>
                <button onClick={() => handleEdit(job)}>Edit</button>
                <button onClick={() => handleDelete(job.id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ClientDashboard;
