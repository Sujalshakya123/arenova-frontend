import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserLayout from "./layouts/UserLayout";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StaticInfoPage from "./pages/StaticInfoPage";

import Tournaments from "./pages/Tournaments";
import Games from "./pages/Games";
import GameDetail from "./pages/GameDetail";
import ChangePass from "./pages/ChangePass";
import ProfileTest from "./pages/Profiletest";
import Notifications from "./pages/Notifications";
import MyTournaments from "./pages/MyTournaments";
import UserDashboard from "./pages/UserDashboard";
import Otppage from "./pages/Otppage";
import OAuthSuccess from "./pages/OAuthSuccess";
import TournamentsDetail from "./pages/TournamentsDetail";
import Overview from "./pages/tournaments-detail/Overview";
import Rules from "./pages/tournaments-detail/Rules";
import Schedule from "./pages/tournaments-detail/Schedule";
import TournamentRegister from "./pages/tournaments-detail/TournamentRegister";
import TournamentChat from "./pages/tournaments-detail/Chat";
import EsewaPaymentSuccess from "./pages/payment/EsewaPaymentSuccess";
import EsewaPaymentFailure from "./pages/payment/EsewaPaymentFailure";

import OrganizerLayout from "./pages/organizer/components/OrganizerLayout";
import OrganizerPendingApproval from "./pages/organizer/OrganizerPendingApproval";
import ProjectsHome from "./pages/organizer/ProjectsHome";
import ProjectDetail from "./pages/organizer/ProjectDetail";
import CreateTournament from "./pages/organizer/CreateTournament";
import TournamentLayout from "./pages/organizer/components/TournamentLayout";
import TournamentOverview from "./pages/organizer/tournament/Overview";
import GeneralSettings from "./pages/organizer/tournament/settings/GeneralSettings";
import AppearanceSettings from "./pages/organizer/tournament/settings/AppearanceSettings";
import DisciplineSettings from "./pages/organizer/tournament/settings/DisciplineSettings";
import RegistrationSettings from "./pages/organizer/tournament/settings/RegistrationSettings";
import ParticipantsSettings from "./pages/organizer/tournament/settings/ParticipantsSettings";
import PublicPageSettings from "./pages/organizer/tournament/settings/PublicPageSettings";
import MatchType from "./pages/organizer/tournament/structure/MatchType";
import StageType from "./pages/organizer/tournament/structure/StageType";
import Matches from "./pages/organizer/tournament/Matches";
import OrganizerTournamentChat from "./pages/organizer/tournament/Chat";
import TournamentSettlement from "./pages/organizer/tournament/Settlement";
import TournamentPayments from "./pages/organizer/tournament/Payments";
import OrganizerReports from "./pages/organizer/Reports";
import ProfileLayout from "./pages/organizer/profile/ProfileLayout";
import ProfileGeneral from "./pages/organizer/profile/ProfileGeneral";
import ProfileEmail from "./pages/organizer/profile/ProfileEmail";
import ProfilePassword from "./pages/organizer/profile/ProfilePassword";
import ChatWidget from "./components/ChatWidget";
import TournamentBracket from "./pages/TournamentBracket";
import MessagesHub from "./pages/MessagesHub";

import AdminLayout from "./pages/super-admin/components/AdminLayout";
import AdminDashboard from "./pages/super-admin/Dashboard";
import AdminUsers from "./pages/super-admin/Users";
import AdminOrganizers from "./pages/super-admin/Organizers";
import AdminTournaments from "./pages/super-admin/Tournaments";
import AdminPayments from "./pages/super-admin/Payments";
import AdminSettlements from "./pages/super-admin/Settlements";
import AdminGames from "./pages/super-admin/Games";
import AdminSettings from "./pages/super-admin/Settings";
import AdminSupport from "./pages/super-admin/Support";
import NotFound from "./pages/NotFound";
import ProtectedRoute, { GuestRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserLayout />} />

        <Route path="tournaments" element={<Tournaments />} />
        <Route path="games" element={<Games />} />
        <Route path="games-detail" element={<GameDetail />} />
        <Route path="contacts" element={<Contact />} />
        <Route path="privacy" element={<StaticInfoPage />} />
        <Route path="terms" element={<StaticInfoPage />} />
        <Route path="payment-policy" element={<StaticInfoPage />} />
        <Route path="about" element={<StaticInfoPage />} />
        <Route path="brackets/:tournamentId" element={<TournamentBracket />} />

        <Route element={<ProtectedRoute />}>
          <Route path="notifications" element={<Notifications />} />
          <Route path="messages" element={<MessagesHub />} />
          <Route path="payment/esewa/success" element={<EsewaPaymentSuccess />} />
          <Route path="payment/esewa/failure" element={<EsewaPaymentFailure />} />
          <Route
            path="tournaments-detail/register"
            element={<TournamentRegister />}
          />
        </Route>

        <Route path="tournaments-detail" element={<TournamentsDetail />}>
          <Route index element={<Overview />} />
          <Route path="rules" element={<Rules />} />
          <Route path="schedule" element={<Schedule />} />
          <Route element={<ProtectedRoute />}>
            <Route path="chat" element={<TournamentChat />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["player"]} />}>
          <Route path="changepass" element={<ChangePass />} />
          <Route path="profile" element={<ProfileTest />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="my-tournaments" element={<MyTournaments />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="otp" element={<Otppage />} />
          <Route path="/organizer/pending-approval" element={<OrganizerPendingApproval />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Organizer */}
        <Route element={<ProtectedRoute roles={["organizer"]} />}>
          <Route path="/organizer" element={<OrganizerLayout />}>
          <Route index element={<ProjectsHome />} />
          <Route path="reports" element={<OrganizerReports />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route
            path="projects/:projectId/tournaments/new"
            element={<CreateTournament />}
          />
          <Route path="profile" element={<ProfileLayout />}>
            <Route index element={<ProfileGeneral />} />
            <Route path="email" element={<ProfileEmail />} />
            <Route path="password" element={<ProfilePassword />} />
          </Route>
          <Route path="tournaments/:tournamentId" element={<TournamentLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<TournamentOverview />} />
            <Route path="settings/general" element={<GeneralSettings />} />
            <Route path="settings/public-page" element={<PublicPageSettings />} />
            <Route path="settings/appearance" element={<AppearanceSettings />} />
            <Route path="settings/discipline" element={<DisciplineSettings />} />
            <Route path="settings/registration" element={<RegistrationSettings />} />
            <Route path="settings/participants" element={<ParticipantsSettings />} />
            <Route path="structure" element={<MatchType />} />
            <Route path="structure/stage" element={<StageType />} />
            <Route path="matches" element={<Matches />} />
            <Route path="payments" element={<TournamentPayments />} />
            <Route path="settlement" element={<TournamentSettlement />} />
            <Route path="chat" element={<OrganizerTournamentChat />} />
          </Route>
        </Route>
        </Route>

        {/* Super Admin */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/super-admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="organizers" element={<AdminOrganizers />} />
          <Route path="tournaments" element={<AdminTournaments />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="settlements" element={<AdminSettlements />} />
          <Route path="games" element={<AdminGames />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatWidget />
      <ToastContainer
        position="top-right"
        autoClose={2800}
        theme="colored"
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default App;
