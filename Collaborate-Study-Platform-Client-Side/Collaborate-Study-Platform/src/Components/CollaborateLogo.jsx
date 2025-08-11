import React from 'react';
import logo from ".././assets/presentation_5494117.png";
import { Link } from 'react-router';
const CollaborateLogo = () => {
  return (
    <div>
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"
      >
        <img src={logo} className="lg:w-15 md:w-12 w-10" alt="Flowbite Logo" />
        <span className="text-black font-bold text-sm sm:text-base lg:text-xl">
          COLLABORATE
          <br className="block lg:hidden" />{" "}
          {/* show line break only on sm and md */}
          <span className="hidden lg:inline">&nbsp;</span>{" "}
          {/* add space for lg inline */}
          STUDY
        </span>
      </Link>
    </div>
  );
};

export default CollaborateLogo;
