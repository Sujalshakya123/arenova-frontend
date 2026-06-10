import React, { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import logo from "../assets/Logo.png";
import leftcover from "../assets/login-left.png";
import { NavLink, useNavigate } from "react-router";
import api from "../api/axios";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  role: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      role: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      alert("Registration successful");

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert("Registration failed");
    }
  };

  return (
    <>
      <div className="flex ">
        <div className="relative w-1/2 h-full">
          <img
            src={leftcover}
            className=" w-full h-full object-cover opacity-80 "
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#364A80]/35 to-[#0B0F1A]" />

          <div className="absolute inset-0 flex flex-col justify-center items-center  text-white z-10 h-[80%] ">
            <img src={logo} alt="Logo" className="w-[150px] h-[150px]" />
            <h2 className="text-3xl font-bold tracking-widest mt-2">ARENOVA</h2>
            <p className="text-gray-300">Ready for the ultimate fight?</p>
            <div>
              <ul className="flex flex-col gap-4 mt-6 text-[16px]">
                <li className="flex items-center gap-2">
                  <IoCheckmarkDoneCircleOutline size={28} /> Easy Matchmaking
                </li>
                <li className="flex items-center gap-2">
                  <IoCheckmarkDoneCircleOutline size={28} /> Secure & Fair
                  Gameplay
                </li>
                <li className="flex items-center gap-2">
                  <IoCheckmarkDoneCircleOutline size={28} /> Real-time Match
                </li>
              </ul>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-1/2 bg-white flex items-center justify-center "
        >
          <div className="w-full max-w-[400px] py-8 h-[60%]">
            <h2 className="font-bold text-2xl">Create Account</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Start your professional journey today.
            </p>

            <div>
              <label className="font-semibold text-black mb-1 block">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-black mb-1 block">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full h-[42px] border border-gray-300 rounded-lg px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block font-semibold text-gray-700 mb-1">
                  Primary Game
                </label>
                <select className="w-full h-[42px] border border-gray-300 rounded-lg px-3 py-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Game</option>
                  <option>PUBG</option>
                  <option>Free Fire</option>
                  <option>Valorant</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block font-semibold text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleSelectChange}
                  className="w-full h-[42px] border border-gray-300 rounded-lg px-3 py-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="PLAYER">Player</option>
                  <option value="ORGANIZER">Organizer</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-5">
              <input type="checkbox" className="w-4 h-4" />
              <p className="text-sm text-gray-500">
                I agree to the{" "}
                <span className="text-blue-600 cursor-pointer">
                  Terms of Service and Privacy Policy
                </span>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
            >
              Create Account
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-semibold text-blue-600 cursor-pointer hover:underline"
              >
                <span className="text-blue-600 cursor-pointer font-medium">
                  Log in
                </span>
              </NavLink>
            </p>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-[1px] bg-gray-300" />
              <span className="font-semimedium text-gray-500 ">
                OR CONTINUE WITH
              </span>
              <div className="flex-1 h-[1px] bg-gray-300" />
            </div>

            <div className="flex gap-3 mb-4">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-blue-50 transition">
                <FcGoogle size={18} />
                Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
