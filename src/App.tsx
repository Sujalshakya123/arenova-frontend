import { Route, Routes } from "react-router";
import Home from "./pages/BrowseGames";
import Navbar from "./components/User/Navbar/Navbar";
import UserLayout from "./layouts/UserLayout";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ListUsers from "./pages/ListUsers";
import UserForm from "./pages/UserForm";
import BrowseGames from "./pages/BrowseGames";
import FeaturedTournament from "./pages/FeaturedTournament";
import Sidebar from "./components/Sidebar";
import Tournaments from "./pages/Tournaments";

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
        <Route path="/browse-games" element={<BrowseGames />} />
        <Route path="/featured-tournament" element={<FeaturedTournament />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/tournaments" element={<Tournaments />} />
      </Routes>
    </>
  );
}

export default App;
