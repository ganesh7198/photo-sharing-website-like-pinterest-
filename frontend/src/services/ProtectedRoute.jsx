import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/getme', {
          withCredentials: true, // ✅ VERY IMPORTANT
        });

        if (res.data) {
          setAuth(true);
        }
      } catch (error) {
        console.log(error);
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
