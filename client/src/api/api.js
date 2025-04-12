export const loginUser = async (email, password) => {
    const res = await fetch("http://localhost:8000/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    return await res.json();
  };
  
  export const getProtectedData = async (token) => {
    const res = await fetch("http://localhost:8000/api/protected.php", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return await res.json();
  };
  
  export const registerUser = async (userData) => {
    const res = await fetch("http://localhost:8000/api/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });
  
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }
  
    return data;
  };
  