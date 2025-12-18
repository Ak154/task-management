import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center bg-white p-10 rounded-xl shadow-lg max-w-md">
        <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
        <h2 className="text-2xl font-semibold mt-4 text-gray-800">
          Page Not Found
        </h2>
        <p className="text-gray-600 mt-2">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;