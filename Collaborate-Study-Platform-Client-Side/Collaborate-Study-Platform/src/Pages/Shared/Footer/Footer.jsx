import React from "react";
import CollaborateLogo from "../../../Components/CollaborateLogo";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

const socialLinks = {
  facebook: "https://www.facebook.com/collaboratestudy",
  twitter: "https://twitter.com/collaboratestudy",
  youtube: "https://www.youtube.com/c/collaboratestudy",
  instagram: "https://www.instagram.com/collaboratestudy",
};

const Footer = () => {
  return (
    <div className=" bg-[#b6d6bb] text-base-content">
      <footer className="max-w-7xl   mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Logo and Slogan */}
        <div className="space-y-4">
          <CollaborateLogo />
          <p className="text-sm leading-relaxed max-w-sm">
            Empowering learners and educators — walking with you for more than a
            century.
          </p>
        </div>

        {/* Right: Contact and Socials */}
        <div className="space-y-4">
          <h2 className="md:text-xl font-semibold">Contact Us</h2>
          <ul className=" md:text-lg  space-y-1">
            <li className="flex items-center gap-2">
              <MdPhone className="text-lg text-green-500" />
              Call: 01700-000697
            </li>
            <li className="flex items-center gap-2">
              <FaWhatsapp className="text-green-500 text-lg" />
              Hotline: +8801896016252 (24x7)
            </li>
            <li className="flex items-center gap-2">
              <MdEmail className="text-lg text-green-500 " />
              Email: collaboratestudy@gmail.com
            </li>
          </ul>

          <div className="flex items-center gap-7 pt-3 md:text-3xl text-xl ">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-600 transition-transform transform hover:scale-110"
            >
              <FaFacebookF />
            </a>
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="hover:text-sky-500 transition-transform transform hover:scale-110"
            >
              <FaTwitter />
            </a>
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="hover:text-red-600 transition-transform transform hover:scale-110"
            >
              <FaYoutube />
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-500 transition-transform transform hover:scale-110"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="text-center text-sm py-5 ">
        © 2010 - {new Date().getFullYear()} Collaborate Study. All rights
        reserved.
      </div>
    </div>
  );
};

export default Footer;
