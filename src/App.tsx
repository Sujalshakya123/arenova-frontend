import { Route, Routes } from "react-router";
import Home from "./pages/Game";
import Navbar from "./components/User/Navbar/Navbar";
import UserLayout from "./layouts/UserLayout";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Tournament from "./pages/Tournament";
import ListUsers from "./pages/ListUsers";
import UserForm from "./pages/UserForm";

function App() {
  return (
    <>
      {/* User */}
      <Routes>
        <Route path="/" element={<UserLayout />} />
        <Route path="/list-users" element={<ListUsers />} />
        <Route path="/userform" element={<UserForm />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tournament" element={<Tournament />} />
      </Routes>
    </>
  );
}

export default App;
