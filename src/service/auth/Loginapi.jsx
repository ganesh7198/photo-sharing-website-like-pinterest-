import axios from "axios";

async function Loginapi(formData) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      formData,
      {
        timeout: 10000, // 10s timeout
      }
    );

    return {
      success: response.data?.success ?? true,
      message: response.data?.message || "Login successful",
      ...response.data,
    };
  } catch (error) {
    // Axios error (server responded)
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message:
          error.response.data?.message ||
          "Invalid username or password",
        type: error.response.data?.type || "api",
      };
    }

    // Network / unexpected error
    return {
      success: false,
      message: error?.message || "Network error. Try again later",
      type: "api",
    };
  }
}

export default Loginapi;
