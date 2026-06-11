import { Route, Routes } from "react-router";

import UserLayout from "./layouts/UserLayout";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ListUsers from "./pages/ListUsers";
import UserForm from "./pages/UserForm";
import BrowseGames from "./pages/BrowseGames";
import FeaturedTournament from "./pages/FeaturedTournament";

import Tournaments from "./pages/Tournaments";
import Profile from "./pages/Profile";
import Games from "./pages/Games";
import Profilesidebar from "./components/User/Profilesidebar";
import ChangePass from "./pages/ChangePass";
import ProfileTest from "./pages/Profiletest";
import Otppage from "./pages/Otppage";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
  return (
    <>
      {/* User */}
      <Routes>
        {/* Pages WITH Navbar (nested under UserLayout) */}
        <Route path="/" element={<UserLayout />}>
          {/* <Route path="" element={<BrowseGames />} /> */}
          <Route path="browse-games" element={<BrowseGames />} />
          <Route path="featured-tournament" element={<FeaturedTournament />} />

          <Route path="list-users" element={<ListUsers />} />
          <Route path="userform" element={<UserForm />} />
        </Route>

        {/* Pages WITHOUT Navbar */}
        <Route path="tournaments" element={<Tournaments />} />
        <Route path="games" element={<Games />} />
        <Route path="contacts" element={<Contact />} />
        <Route path="changepass" element={<ChangePass />} />
        <Route path="profile" element={<ProfileTest />} />
        <Route path="otp" element={<Otppage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        <Route path="/oauth-success" element={<OAuthSuccess />} />
      </Routes>
    </>
  );
}

export default App;
