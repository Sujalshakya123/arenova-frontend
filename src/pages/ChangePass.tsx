import React, { useState } from "react";
import { MdSecurity } from "react-icons/md";
import tourhero from "../assets/download.jpg";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import Profilesidebar from "../components/User/Profilesidebar";
import ResponsiveSidebarLayout from "../components/ResponsiveSidebarLayout";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/axios";
import { changePassword } from "../services/userApi";
import { getPasswordPolicyError, PASSWORD_POLICY_MESSAGE } from "../utils/passwordPolicy";
import PasswordInput from "../components/PasswordInput";
import { userShell } from "../theme/userShellTheme";

const ChangePass = () => {
  const { userDTO } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (!userDTO?.id || userDTO.id.includes("@")) {
      setError("Please log out and log in again so your account id can be loaded.");
      return;
    }
    if (!form.currentPassword.trim()) {
      setError("Current password is required.");
      return;
    }
    if (!form.newPassword.trim()) {
      setError("New password is required.");
      return;
    }
    const passwordError = getPasswordPolicyError(form.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setSubmitting(true);
      const response = await changePassword(
        userDTO.id,
        form.currentPassword,
        form.newPassword,
      );
      setSuccess(
        typeof response.data === "string"
          ? response.data
          : "Password updated successfully!",
      );
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div>
        <div className=" bg-gradient-to-r from-black/75 via-black/40 to-transparent">
          <img
            src={tourhero}
            className="absolute h-[88px] w-full object-cover opacity-85"
          />
          <div className="relative  flex flex-col">
            <Navbar />
          </div>
        </div>
        <ResponsiveSidebarLayout
          sidebar={<Profilesidebar />}
          className={userShell.page}
          filterLabel="Account menu"
        >
          <div className={userShell.contentWide}>
            {/* Header */}
            <div className="mb-8">
              <h1 className={userShell.h1}>
                Security & Privacy
              </h1>
              <p className={userShell.subtitle}>
                Manage your account security, connected devices, and
                authentication methods.
              </p>
            </div>

            {/* Change Password Card */}
            <div className={userShell.cardPad8}>
              <h2 className={`${userShell.h2Lg} mb-6 flex items-center gap-2`}>
                <MdSecurity size={22} className="text-blue-600" />
                Change Password
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Current Password */}
                <div>
                  <label className={userShell.labelPlain}>
                    Current Password
                  </label>
                  <PasswordInput
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className={userShell.inputLg}
                  />
                </div>

                {/* New + Confirm side by side */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className={userShell.labelPlain}>
                      New Password
                    </label>
                    <PasswordInput
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className={userShell.inputLg}
                    />
                    <p className={`${userShell.mutedXs} mt-1`}>{PASSWORD_POLICY_MESSAGE}</p>
                  </div>
                  <div className="flex-1">
                    <label className={userShell.labelPlain}>
                      Confirm New Password
                    </label>
                    <PasswordInput
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className={userShell.inputLg}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg w-fit transition cursor-pointer"
                >
                  {submitting ? "Updating..." : "Update Password"}
                </button>

                {error && (
                  <p className="text-sm text-red-600 font-medium">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-sm text-emerald-700 font-medium">
                    {success}
                  </p>
                )}
              </form>
            </div>
          </div>
        </ResponsiveSidebarLayout>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default ChangePass;
