import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaCar, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.length > 1 ? navigate(-1) : navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Large 404 Text */}
            <h1 className="text-9xl font-bold text-transparent bg-red-600 bg-clip-text">
              404
            </h1>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <FaCar className="text-4xl text-red-600 opacity-20" />
            </div>
          </div>
          
          {/* Warning Icon */}
          <div className="flex justify-center mt-4">
            <div className="bg-red-100 p-3 rounded-full">
              <FaExclamationTriangle className="text-2xl text-red-600" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            The page you're looking for seems to have taken a different route. 
            Don't worry, even the best drivers sometimes take a wrong turn!
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              <strong>What happened?</strong> The URL you entered might be incorrect, 
              or the page might have been moved or deleted.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaHome className="mr-2" />
              Go to Homepage
            </Link>
            
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default NotFound;
