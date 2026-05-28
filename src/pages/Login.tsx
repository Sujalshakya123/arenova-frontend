import React, { useState } from "react";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiLogIn } from "react-icons/fi";

import logo from "../assets/Logo.png";
import leftcover from "../assets/login-left.png";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

type LoginForm = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post<LoginResponse>("/auth/login", form);

      login(response.data.token);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <>
      <div className="flex ">
        <div className="relative w-1/2 ">
          <img
            src={leftcover}
            className=" w-full h-full object-cover object-center   opacity-80 "
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#364A80]/35 to-[#0B0F1A]" />

          <div className="absolute inset-0 flex flex-col justify-center items-center  text-white z-10 h-[80%]">
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
          <div className="w-full max-w-[400px] py-8">
            <h2 className="font-bold text-2xl">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4 ">
              Please enter your credentials to access your account.
            </p>

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
            <div>
              <div className="flex justify-between items-center">
                <label className="font-semibold text-black mb-1 block">
                  Password
                </label>
                <span className="font-semibold text-blue-600 cursor-pointer hover:underline">
                  Forgot Password?
                </span>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 mb-5">
              <input type="checkbox" className=" w-4 h-4 " />
              <p className="text-sm text-gray-500">Remember me</p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition flex items-center justify-center gap-2"
            >
              Login <FiLogIn />
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <span className="text-blue-600 cursor-pointer font-semibold hover:underline">
                Sign up for free
              </span>
            </p>

            <div className="flex items-center gap-3 my-5 mt-6 mb-8">
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
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-blue-50 transition">
                <FaFacebook size={18} className="text-[#1877F2]" />
                Facebook
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
