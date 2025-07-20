import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function Logout() {
  const [showPrompt, setShowPrompt] = useState(false);
  const navigate = useNavigate();
  const promptRef = useRef(null);

  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem("profileImg");
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem("name");
      localStorage.removeItem("userId");

      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close prompt on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (promptRef.current && !promptRef.current.contains(event.target)) {
        setShowPrompt(false);
      }
    };

    if (showPrompt) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPrompt]);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowPrompt(!showPrompt)}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all"
      >
        Logout
      </button>

      {showPrompt && (
        <div
          ref={promptRef}
          className="absolute mt-2 top-[-100px] left-25 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4"
        >
          <p className="text-gray-800 font-medium mb-4">Are you sure you want to logout?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowPrompt(false)}
              className="px-3 py-1 text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
            >
              Yes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Logout;
