import axios from 'axios';

async function loginApi(data) {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/login',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    return response.data; // return only data
  } catch (error) {
    console.log('Error in login API:', error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || 'Something went wrong',
    };
  }
}

export default loginApi;
