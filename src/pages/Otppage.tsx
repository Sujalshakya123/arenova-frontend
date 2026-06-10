import React from "react";
import logo from "../assets/Logo.png";
import leftcover from "../assets/login-left.png";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { NavLink } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
const Otppage = () => {
  return (
    <>
      <div className="flex">
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

        {/* Right */}
        <div className="w-1/2 flex items-center justify-center bg-white min-h-screen">
          <div className="w-full max-w-[400px] py-8 h-[60%]">
            {/* Email Icon */}
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <MdEmail size={28} className="text-blue-500" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify your email
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              We've sent a 6-digit verification code to{" "}
              <span className="font-semibold text-gray-800">
                shakyajo****@gmail.com
              </span>
              . Please enter it below:
            </p>

            {/* OTP Input Boxes */}
            <div className="flex gap-3 mb-6">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-6">
              Verify & Continue
              <span>→</span>
            </button>

            {/* Resend */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">
                Didn't receive the code?
              </p>
              <button className="text-sm text-blue-600 font-medium underline underline-offset-2">
                Resend verification code
              </button>
            </div>

            {/*  Back */}
            <NavLink
              to="/login"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              <div className="mt-10">
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                  <FaArrowLeft /> Back to login
                </button>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Otppage;
