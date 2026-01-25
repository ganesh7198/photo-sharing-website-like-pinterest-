import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/login';

async function loginApi(data) {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // If we get here, the request was successful
    return {
      success: true,
      ...response.data,
    };
  } catch (error) {
    console.error('Login API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Return a structured error response
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Login failed. Please check your credentials and try again.',
      status: error.response?.status || 500,
    };
  }
}

export default loginApi;
