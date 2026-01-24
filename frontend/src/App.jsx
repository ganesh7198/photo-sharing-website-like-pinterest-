import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Loginpage from './pages/Loginpage';
import Signup from './pages/Singuppage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './services/ProtectedRoute';
import MainLayout from './layout.jsx/MainLayout';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import Homepage from './pages/Homepage';

function App() {
  const { userInfo } = useContext(UserContext);
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>}></Route>
        <Route path="/login" element={<Loginpage></Loginpage>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route element={<ProtectedRoute></ProtectedRoute>}>
          <Route element={<MainLayout></MainLayout>}>
            <Route path={`/home`} element={<Homepage></Homepage>}></Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
