// import React, { useEffect, useState } from "react";
// import { getProtectedData } from "../api/api";

// function FreelancerDashboard() {
//   const [user, setUser] = useState(null);
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showBidForm, setShowBidForm] = useState({});
//   const [bidAmounts, setBidAmounts] = useState({});

//   useEffect(function () {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     getProtectedData(token).then(function (res) {
//       console.log("Freelancer Raw Data:", res);
//       if (res.user) setUser(res.user);
//       if (res.data?.jobs) setJobs(res.data.jobs);
//       setLoading(false);
//     });
//   }, []);

//   function handleBidSubmit(jobId) {
//     const token = localStorage.getItem("token");
//     const amount = bidAmounts[jobId];

//     if (!amount) {
//       alert("Please enter a bid amount.");
//       return;
//     }

//     fetch("http://localhost:8000/api/submit_bid.php", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//       body: JSON.stringify({
//         job_id: jobId,
//         amount: amount,
//       }),
//     })
//       .then(function (response) {
//         return response.json().then(function (data) {
//           console.log("Bid Response:", data);
//           if (response.ok) {
//             alert("Bid submitted successfully!");
//             setShowBidForm(Object.assign({}, showBidForm, { [jobId]: false }));
//             setBidAmounts(Object.assign({}, bidAmounts, { [jobId]: "" }));
//           } else {
//             alert("Error submitting bid: " + data.error);
//           }
//         });
//       })
//       .catch(function (error) {
//         console.error("Error submitting bid:", error);
//         alert("An error occurred while submitting your bid.");
//       });
//   }

//   return (
//     <div className="freelancer-dashboard">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="dashboard-title">Freelancer Dashboard</h2>
//         <button
//           className="btn btn-danger"
//           onClick={function () {
//             localStorage.removeItem("token");
//             window.location.href = "/login";
//           }}
//         >
//           Logout
//         </button>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : user ? (
//         <>
//           <div className="glass-box">
//             <p><strong>Welcome:</strong> {user.name}</p>
//             <p><strong>Email:</strong> {user.email}</p>
//             <p><strong>Role:</strong> {user.role}</p>
//           </div>

//           <h4 className="mt-4">Available Jobs</h4>
//           <div className="row">
//             {jobs.length > 0 ? (
//               jobs.map(function (job) {
//                 return (
//                   <div className="col-md-4 mb-3" key={job.id}>
//                     <div className="card">
//                       <div className="card-body">
//                         <h5 className="card-title">{job.title}</h5>
//                         <p className="card-text">{job.description}</p>
//                         <p className="card-text">
//                           <strong>Budget:</strong> ${job.budget}
//                         </p>

//                         {showBidForm[job.id] ? (
//                           <div>
//                             <input
//                               type="number"
//                               className="form-control mb-2"
//                               placeholder="Enter bid amount"
//                               value={bidAmounts[job.id] || ""}
//                               onChange={function (e) {
//                                 var updated = Object.assign({}, bidAmounts);
//                                 updated[job.id] = e.target.value;
//                                 setBidAmounts(updated);
//                               }}
//                             />
//                             <button
//                               className="btn btn-success me-2"
//                               onClick={function () {
//                                 handleBidSubmit(job.id);
//                               }}
//                             >
//                               Submit
//                             </button>
//                             <button
//                               className="btn btn-secondary"
//                               onClick={function () {
//                                 var updated = Object.assign({}, showBidForm);
//                                 updated[job.id] = false;
//                                 setShowBidForm(updated);
//                               }}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         ) : (
//                           <button
//                             className="btn btn-primary"
//                             onClick={function () {
//                               var updated = Object.assign({}, showBidForm);
//                               updated[job.id] = true;
//                               setShowBidForm(updated);
//                             }}
//                           >
//                             Bid
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <p>No jobs available.</p>
//             )}
//           </div>
//         </>
//       ) : (
//         <p>Error: No user info</p>
//       )}

//       <style>{`
//         .freelancer-dashboard {
//           background: linear-gradient(135deg, #e3f2fd, #ffffff);
//           min-height: 100vh;
//           padding: 2rem;
//           color: #333;
//           font-family: 'Segoe UI', sans-serif;
//         }

//         .glass-box {
//           background: rgba(255, 255, 255, 0.6);
//           border-radius: 12px;
//           padding: 1.5rem;
//           margin-bottom: 2rem;
//           box-shadow: 0 6px 12px rgba(0,0,0,0.05);
//           backdrop-filter: blur(10px);
//         }

//         .dashboard-title {
//         font-size: 2.5rem;
//         font-weight: 700;
//         background: linear-gradient(135deg, #007cf0, #00dfd8);
//         -webkit-background-clip: text;
//         -webkit-text-fill-color: transparent;
//         margin-bottom: 1.5rem;
//       }


//         .card {
//           border: none;
//           border-radius: 12px;
//           background: #ffffff;
//           box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
//           transition: transform 0.3s ease;
//         }

//         .card:hover {
//           transform: translateY(-5px);
//         }

//         .card-body {
//           padding: 1.2rem;
//         }

//         .card-title {
//           font-weight: bold;
//           font-size: 1.1rem;
//           margin-bottom: 0.6rem;
//         }

//         .card-text {
//           color: #444;
//           font-size: 0.95rem;
//         }

//         .btn-primary {
//           background-color: #42a5f5;
//           border: none;
//           font-weight: 500;
//           padding: 5px 12px;
//           font-size: 0.9rem;
//         }

//         .btn-primary:hover {
//           background-color: #1e88e5;
//         }

//         .btn-success {
//           background-color: #66bb6a;
//           border: none;
//           font-weight: 500;
//           padding: 5px 14px;
//           font-size: 0.9rem;
//         }

//         .btn-success:hover {
//           background-color: #43a047;
//         }

//         .btn-secondary {
//           background-color: #9e9e9e;
//           border: none;
//           font-weight: 500;
//           padding: 5px 14px;
//           font-size: 0.9rem;
//         }

//         .btn-danger {
//           background-color: #ef5350;
//           border: none;
//         }

//         input.form-control {
//           border-radius: 8px;
//           height: 36px;
//           font-size: 0.9rem;
//         }

//         h2, h4 {
//           color: #263238;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default FreelancerDashboard;


import React, { useEffect, useState } from "react";
import { getProtectedData, submitBid } from "../api/api";

function FreelancerDashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState({});
  const [bidAmounts, setBidAmounts] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    getProtectedData(token)
      .then((res) => {
        console.log("Freelancer Raw Data:", res);
        if (res.user) setUser(res.user);
        if (res.data?.jobs) setJobs(res.data.jobs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
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

    submitBid({ job_id: jobId, amount }, token)
      .then((data) => {
        alert("Bid submitted successfully!");
        setShowBidForm({ ...showBidForm, [jobId]: false });
        setBidAmounts({ ...bidAmounts, [jobId]: "" });
      })
      .catch((err) => {
        console.error("Error submitting bid:", err);
        alert("An error occurred while submitting your bid.");
      });
  }

  return (
    <div className="freelancer-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="dashboard-title">Freelancer Dashboard</h2>
        <button
          className="btn btn-danger"
          onClick={() => {
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
          <div className="glass-box">
            <p><strong>Welcome:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>

          <h4 className="mt-4">Available Jobs</h4>
          <div className="row">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div className="col-md-4 mb-3" key={job.id}>
                  <div className="card">
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
                            onChange={(e) => {
                              setBidAmounts({
                                ...bidAmounts,
                                [job.id]: e.target.value,
                              });
                            }}
                          />
                          <button
                            className="btn btn-success me-2"
                            onClick={() => handleBidSubmit(job.id)}
                          >
                            Submit
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() =>
                              setShowBidForm({
                                ...showBidForm,
                                [job.id]: false,
                              })
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            setShowBidForm({
                              ...showBidForm,
                              [job.id]: true,
                            })
                          }
                        >
                          Bid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No jobs available.</p>
            )}
          </div>
        </>
      ) : (
        <p>Error: No user info</p>
      )}

      <style>{`
        .freelancer-dashboard {
          background: linear-gradient(135deg, #e3f2fd, #ffffff);
          min-height: 100vh;
          padding: 2rem;
          color: #333;
          font-family: 'Segoe UI', sans-serif;
        }

        .glass-box {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 6px 12px rgba(0,0,0,0.05);
          backdrop-filter: blur(10px);
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #007cf0, #00dfd8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
        }

        .card {
          border: none;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
          transition: transform 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
        }

        .card-body {
          padding: 1.2rem;
        }

        .card-title {
          font-weight: bold;
          font-size: 1.1rem;
          margin-bottom: 0.6rem;
        }

        .card-text {
          color: #444;
          font-size: 0.95rem;
        }

        .btn-primary {
          background-color: #42a5f5;
          border: none;
          font-weight: 500;
          padding: 5px 12px;
          font-size: 0.9rem;
        }

        .btn-primary:hover {
          background-color: #1e88e5;
        }

        .btn-success {
          background-color: #66bb6a;
          border: none;
          font-weight: 500;
          padding: 5px 14px;
          font-size: 0.9rem;
        }

        .btn-success:hover {
          background-color: #43a047;
        }

        .btn-secondary {
          background-color: #9e9e9e;
          border: none;
          font-weight: 500;
          padding: 5px 14px;
          font-size: 0.9rem;
        }

        .btn-danger {
          background-color: #ef5350;
          border: none;
        }

        input.form-control {
          border-radius: 8px;
          height: 36px;
          font-size: 0.9rem;
        }

        h2, h4 {
          color: #263238;
        }
      `}</style>
    </div>
  );
}

export default FreelancerDashboard;
