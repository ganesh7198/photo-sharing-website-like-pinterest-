import axios from "axios";

async function Signupapi(formData) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/signup",
      formData
    );

    // Return the backend response directly
    return response.data; // ✅ this contains { success: true/false, message: "...", type: "..." }
  } catch (error) {
    // If server responded with an error (like 400)
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || "Signup failed",
        type: error.response.data.type || "api",
      };
    }

    // Network or other errors
    return {
      success: false,
      message: error.message || "Network error. Try again later",
      type: "api",
    };
  }
}

export default Signupapi;
