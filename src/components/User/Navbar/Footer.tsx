import React from "react";
import logo from "../../../assets/Logo.png";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <div>
        <footer className="bg-black flex justify-between  px-[80px] py-[40px]  text-white h-[20%]">
          <div className="flex flex-col">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="w-[48px] h-[48px]" />
              <h2 className="font-bold text-[20px]">ARENOVA</h2>
            </div>
            <p className=" text-sm max-w-[220px] leading-relaxed justify-content mb-2">
              The ultimate competitive platform for gamers in Nepal. Providing
              professional infrastructure for the next generation of esports
              talent.
            </p>
          </div>

          <div className="flex flex-col gap-1 ">
            <h2 className="font-bold">Quick Links</h2>
            <ul>
              <li>Home</li>
              <li>Tournaments</li>
              <li>Games</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-bold">Legal</h2>
            <ul className="flex flex-col gap-1">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Payment Policy</li>
            </ul>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-bold">About</h2>
            <ul className="flex flex-col gap-1">
              <li>About Us</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-bold mb-2">Social Links</h2>
            <ul className="flex gap-4">
              <li>
                <FaInstagram size={36} />
              </li>
              <li>
                <FaXTwitter size={36} />
              </li>
              <li>
                <FaDiscord size={36} />
              </li>
            </ul>
            <p className="text-sm max-w-[220px] leading-relaxed justify-content mb-4">
              Stay updated with esports news and tournaments.
            </p>
          </div>
        </footer>
        <div className="bg-black justify-items-center px-[80px] py-[30px]  text-white h-[20%]">
          <h2 className="text-gray-400 text-sm">
            © 2025 Arenova. All rights reserved. Building the future of esports
            in Nepal.
          </h2>
        </div>
      </div>
    </>
  );
};

export default Footer;
