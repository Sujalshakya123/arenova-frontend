import React, { useState } from "react";
import { MdSecurity } from "react-icons/md";
import tourhero from "../assets/download.jpg";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import Profilesidebar from "../components/User/Profilesidebar";

const ChangePass = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
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
        <div className="flex min-h-screen bg-[#f4f6fb]">
          <Profilesidebar />

          <div className="flex-1 px-[60px] py-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Security & Privacy
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your account security, connected devices, and
                authentication methods.
              </p>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-xl p-8 max-w-[660px]">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MdSecurity size={22} className="text-blue-600" />
                Change Password
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Current Password */}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* New + Confirm side by side */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 mb-1 block">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 mb-1 block">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg w-fit transition cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default ChangePass;
