import React, { useState } from "react";
import Button from "../Button/Button";
import { Link, NavLink } from "react-router";
import CollaborateLogo from "../../../Components/CollaborateLogo";
import { FaHome, FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";
import UseAuth from "../../../Hooks/UseAuth";
import { MdDashboardCustomize } from "react-icons/md";
const Navbar = () => {
  const { user } = UseAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const NavLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 py-2  hover:scale-105 transition duration-200 ${
              isActive ? "text-[#1DA678] font-semibold" : "text-black"
            }`
          }
        >
          <FaHome className="text-base md:text-md lg:text-xl" />
          <span className="text-sm md:text-md lg:text-base">Home</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/tutor"
          className={({ isActive }) =>
            `flex items-center gap-2 py-2 hover:scale-105 transition duration-200 ${
              isActive ? "text-[#1DA678] font-semibold" : "text-black"
            }`
          }
        >
          <FaChalkboardTeacher className="text-base md:text-lg lg:text-xl" />
          <span className="text-sm md:text-md lg:text-base">Tutor</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/studySession"
          className={({ isActive }) =>
            `flex items-center gap-2 py-2 hover:scale-105 transition duration-200 ${
              isActive ? "text-[#1DA678] font-semibold" : "text-black"
            }`
          }
        >
          <FaBookOpen className="text-base md:text-lg lg:text-xl" />
          <span className="text-sm md:text-md lg:text-base">Study Session</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 py-2  hover:scale-105 transition duration-200 ${
              isActive ? "text-[#1DA678] font-semibold" : "text-black"
            }`
          }
        >
          <MdDashboardCustomize className="text-base sm:text-lg md:text-xl" />
          <span className="text-sm md:text-md lg:text-base">Dashboard</span>
        </NavLink>
      </li>

      {/* User Profile Avatar */}
      <li>
        {user && (
          <div className="relative group">
            <img
              src={user?.photoURL}
              alt="Profile"
              className="lg:w-10 lg:h-10 sm:w-8 sm:h-8 w-7 h-7 rounded-full border-2 border-primary1 cursor-pointer"
              referrerPolicy="no-referrer"
            />
            <div className="absolute left-1/2 -translate-x-1/2 mt-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
              {user?.displayName}
            </div>
          </div>
        )}
      </li>
    </>
  );

  return (
    <nav className="bg-white  fixed w-full top-0 z-20 border-b-2 border-b-gray-100">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-2  ">
        <CollaborateLogo></CollaborateLogo>

        {/* Buttons */}
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Link to="/login">
            {user ? <Button label="LogOut" /> : <Button label="Login" />}
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isMenuOpen ? "block" : "hidden"
          }`}
          id="navbar-cta"
        >
          <ul className="flex flex-col font-light p-4 sm:p-3 mt-4 border border-gray-100 rounded-lg  lg:space-x-7 md:space-x-4 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0   items-center ">
            {NavLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
