import { Route, Routes } from "react-router-dom"
import Signup from "./uicomponent/pages/Signup"
import Login from "./uicomponent/pages/Login"
import Homepage from "./uicomponent/pages/Homepage"
function App() {
  return (
   <>
  <Routes>
     <Route path="/signup" element={<Signup></Signup>}></Route>
     <Route path="/login" element={<Login></Login>}></Route>
     <Route path="/" element={<Homepage></Homepage>}></Route>
  </Routes>
   </>
  )
}

export default App
