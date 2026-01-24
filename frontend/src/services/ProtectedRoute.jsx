import { Navigate, Outlet } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const { setuserinfo } = useContext(UserContext);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/getme', {
          withCredentials: true, // ✅ VERY IMPORTANT
        });

        if (res.data) {
          setuserinfo(res.data);
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
  }, [setuserinfo]);

  if (loading) return <h2>Loading...</h2>;

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
