import React, { useEffect, useState } from "react";
import { getProtectedData } from "../api/api";

function FreelancerDashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState({});
  const [bidAmounts, setBidAmounts] = useState({});

  useEffect(function () {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    getProtectedData(token).then(function (res) {
      console.log("Freelancer Raw Data:", res);
      if (res.user) setUser(res.user);
      if (res.data?.jobs) setJobs(res.data.jobs);
      setLoading(false);
    });
  }, []);

  function handleBidSubmit(jobId) {
    const token = localStorage.getItem("token");
    const amount = bidAmounts[jobId];

    if (!amount) {
      alert("Please enter a bid amount.");
      return;
    }

    fetch("http://localhost:8000/api/submit_bid.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        job_id: jobId,
        amount: amount,
      }),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          console.log("Bid Response:", data);
          if (response.ok) {
            alert("Bid submitted successfully!");
            setShowBidForm(Object.assign({}, showBidForm, { [jobId]: false }));
            setBidAmounts(Object.assign({}, bidAmounts, { [jobId]: "" }));
          } else {
            alert("Error submitting bid: " + data.error);
          }
        });
      })
      .catch(function (error) {
        console.error("Error submitting bid:", error);
        alert("An error occurred while submitting your bid.");
      });
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Freelancer Dashboard</h2>
        <button
          className="btn btn-danger"
          onClick={function () {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>

          <h4 className="mt-4">Available Jobs</h4>
          <div className="row">
            {jobs.length > 0 ? (
              jobs.map(function (job) {
                return (
                  <div className="col-md-4 mb-3" key={job.id}>
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{job.title}</h5>
                        <p className="card-text">{job.description}</p>
                        <p className="card-text">
                          <strong>Budget:</strong> ${job.budget}
                        </p>

                        {showBidForm[job.id] ? (
                          <div>
                            <input
                              type="number"
                              className="form-control mb-2"
                              placeholder="Enter bid amount"
                              value={bidAmounts[job.id] || ""}
                              onChange={function (e) {
                                var updated = Object.assign({}, bidAmounts);
                                updated[job.id] = e.target.value;
                                setBidAmounts(updated);
                              }}
                            />
                            <button
                              className="btn btn-success me-2"
                              onClick={function () {
                                handleBidSubmit(job.id);
                              }}
                            >
                              Submit
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={function () {
                                var updated = Object.assign({}, showBidForm);
                                updated[job.id] = false;
                                setShowBidForm(updated);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={function () {
                              var updated = Object.assign({}, showBidForm);
                              updated[job.id] = true;
                              setShowBidForm(updated);
                            }}
                          >
                            Bid
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No jobs available.</p>
            )}
          </div>
        </>
      ) : (
        <p>Error: No user info</p>
      )}
    </div>
  );
}

export default FreelancerDashboard;
