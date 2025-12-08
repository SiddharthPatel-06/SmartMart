import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <Link to="/dashboard">
        <Button className="bg-white text-neutral-950 hover:bg-gray-200">
          Go back Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
