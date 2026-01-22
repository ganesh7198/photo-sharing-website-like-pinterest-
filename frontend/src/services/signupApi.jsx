import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const signupApi = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/signup`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};