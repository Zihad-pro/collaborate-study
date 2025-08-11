import React from "react";

const Button = ({
  label,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full sm:w-auto            /* 🔹 Full width on mobile, auto on larger screens */
        px-4 py-2                  /* 🔹 Base padding */
        sm:px-6 sm:py-2.5          /* 🔹 More padding on medium screens */
        lg:px-8 lg:py-2            /* 🔹 Even more padding on larger screens */
        md:px-6 md:py-2            /* 🔹 Even more padding on larger screens */

        text-sm sm:text-base lg:text-lg md:text-md   /* 🔹 Responsive text size */
        text-white
        bg-[#1DA678]
        hover:bg-[#17976A]
         cursor-pointer
        rounded-lg
        font-semibold
        transition duration-300
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {label}
    </button>
  );
};

export default Button;
