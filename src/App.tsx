import { Route, Routes } from "react-router"
import Home from "./pages/Home"


function App() {
 
  return (
    <>
     <Routes>
      <Route path="/home" element={<Home/>} />
      <Route path="/games" element={<Home/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/home" element={<Home/>} />
     </Routes>
    </>
  )
}

export default App
