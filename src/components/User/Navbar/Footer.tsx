import React from "react";
import logo from "../../../assets/Logo.png";

const Footer = () => {
  return (
    <>
      <div>
        <footer className="bg-black flex justify-between items-center px-[80px] py-[20px]  text-white h-[20%]">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-[48px] h-[48px]" />
            <h2 className="font-bold text-[20px]">ARENOVA</h2>
          </div>
          <div>
            <h2 className="font-semibold">Quick Links</h2>
            <ul>
              <li>Home</li>
              <li>Tournaments</li>
              <li>Games</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold">Legal</h2>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Payment Policy</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold">About</h2>
            <ul>
              <li>About Us</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold">Social Links</h2>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
