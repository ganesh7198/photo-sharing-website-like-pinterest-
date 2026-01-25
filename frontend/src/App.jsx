import { Routes, Route } from 'react-router-dom';
import Loginpage from './pages/Loginpage';
import Signup from './pages/Singuppage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './services/ProtectedRoute';
import MainLayout from './layout.jsx/MainLayout';
import Homepage from './pages/Homepage';
import Profilepage from './pages/Profilepage';
import Uploadpage from './pages/Uploadpage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Loginpage />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Homepage />} />
          {/* This route must come BEFORE the /profile route */}
          <Route path="/profile/:username" element={<Profilepage />} />
          {/* Default profile - will redirect to /profile/:username */}
          <Route path="/profile" element={<Profilepage />} />
          <Route path="/upload" element={<Uploadpage></Uploadpage>}></Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
