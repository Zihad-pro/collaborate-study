import React from "react";
import { Link } from "react-router";
import { FaLock } from "react-icons/fa";

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 text-center px-4">
      <FaLock className="text-6xl text-yellow-500 mb-4" />
      <h1 className="text-5xl font-bold mb-2">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Access Forbidden</h2>
      <p className="mb-6 text-lg">
        You don't have permission to view this page.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ForbiddenPage;
