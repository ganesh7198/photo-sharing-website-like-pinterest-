import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  async function change() {
    try {
      const data = await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        { withCredentials: true }
      );
      console.log(data);

      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    }
  }
  change();
};

export default Logout;
