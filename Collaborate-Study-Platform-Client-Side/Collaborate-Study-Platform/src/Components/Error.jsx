import React from "react";
import { useNavigate } from "react-router";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <FaExclamationTriangle className="text-red-500 text-6xl mb-4 animate-bounce" />
      <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-4">Oops! Page not found.</p>
      <p className="text-gray-500 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={handleGoHome}
        className="px-6 py-2 bg-primary1 hover:bg-primary2 text-white rounded shadow transition duration-200 cursor-pointer"
      >
        ⬅ Back to Home
      </button>
    </div>
  );
};

export default ErrorPage;
