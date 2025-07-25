import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = ({ 
  to = null, 
  className = "", 
  showText = true, 
  text = "Back",
  variant = "default" // default, minimal, floating
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const baseClasses = "inline-flex items-center gap-2 transition-all duration-200 hover:scale-105";
  
  const variants = {
    default: "bg-white text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg shadow-md hover:shadow-lg border border-gray-200",
    minimal: "text-gray-600 hover:text-red-600 p-2",
    floating: "fixed top-4 left-4 z-50 bg-white text-gray-700 hover:text-red-600 p-3 rounded-full shadow-lg hover:shadow-xl border border-gray-200"
  };

  return (
    <button
      onClick={handleBack}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      title="Go back"
    >
      <FaArrowLeft className="text-sm" />
      {showText && <span className="font-medium">{text}</span>}
    </button>
  );
};

export default BackButton;
