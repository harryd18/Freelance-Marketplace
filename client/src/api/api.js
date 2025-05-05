// export const loginUser = async (email, password) => {
//   try {
//     const res = await fetch("http://localhost:8000/api/auth.php", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const text = await res.text();

//     try {
//       const data = JSON.parse(text);

//       if (!res.ok) {
//         throw new Error(data?.error || "Login failed");
//       }

//       return data;
//     } catch (jsonError) {
//       console.error("Server did not return valid JSON:", text);
//       throw new Error("Invalid response from server");
//     }

//   } catch (err) {
//     console.error("Network or server error:", err.message);
//     throw err;
//   }
// };

  
//   export const getProtectedData = async (token) => {
//     const res = await fetch("http://localhost:8000/api/protected.php", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
  
//     return await res.json();
//   };
  
//   export const registerUser = async (userData) => {
//     const res = await fetch("http://localhost:8000/api/register.php", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(userData)
//     });
  
//     const data = await res.json();
//     if (!res.ok) {
//       throw new Error(data.message || "Registration failed");
//     }
  
//     return data;
//   };
  

const API_BASE = "https://freelance-marketplace-aetf.onrender.com/api";


// LOGIN
export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE}/auth.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();
    const data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(data?.error || "Login failed");
    }

    return data;
  } catch (err) {
    console.error("Login Error:", err.message);
    throw new Error("Invalid response from server");
  }
};

// REGISTER
export const registerUser = async (userData) => {
  const res = await fetch(`${API_BASE}/register.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
};

// GET USER DATA (Protected Route)
export const getProtectedData = async (token) => {
  const res = await fetch(`${API_BASE}/protected.php`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

// POST A JOB (Client)
export const postJob = async (jobData, token) => {
  const res = await fetch(`${API_BASE}/post_job.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(jobData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to post job");
  return data;
};

// GET ALL JOBS (Freelancer)
export const getAllJobs = async () => {
  const res = await fetch(`${API_BASE}/get_all_jobs.php`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to get jobs");
  return data;
};

// SUBMIT BID (Freelancer)
export const submitBid = async (bidData, token) => {
  const res = await fetch(`${API_BASE}/submit_bid.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(bidData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to submit bid");
  return data;
};
