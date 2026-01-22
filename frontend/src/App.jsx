import { Routes } from "react-router-dom"
import { Route } from "react-router-dom"
import Loginpage from "./pages/Loginpage"
import Signup from "./pages/Singuppage";
import LandingPage from "./pages/LandingPage";

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>}></Route>
        <Route path="/login" element={<Loginpage></Loginpage>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
      </Routes>
    </>
  );
}

export default App
