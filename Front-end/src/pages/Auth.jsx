import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { auth, provider, signInWithPopup } from "../../src/firebase";
import { useNavigate } from "react-router";
import { useUserContext } from "../context/UserContext";
import axios from "axios";

// Create axios instance with credentials enabled for cookies
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  withCredentials: true, // This is crucial for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function AuthForm() {
  const {setUser} = useUserContext ();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authenticated on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/check');
      if (response.data.authenticated) {
        setIsAuthenticated(true);
        navigate('/'); // Redirect to dashboard if already logged in
      }
    } catch (error) {
      console.log('Not authenticated ' ,error);
      setIsAuthenticated(false);
    }
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        api.post("/auth/google", {
          name: user.displayName,
          email: user.email,
          googleId: user.uid,
          imgUrl: user.photoURL,
        })
          .then((response) => {
            const { user: userData, token } = response.data;
            setUser(userData);

            // Optional: Still store token in localStorage for backward compatibility
            localStorage.setItem("token", token);
            
            setIsAuthenticated(true);
            navigate("/");
          })
          .catch((error) => {
            console.error("Google Sign-In Error:", error);
            alert("Google sign-in failed. Please try again.");
          });
      })
      .catch((error) => {
        console.error("Google Sign-In Error:", error);
        alert("Google sign-in failed. Please try again.");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

        const { userData, token } = response.data;
         setUser(userData)        

        // Optional: Still store token in localStorage for backward compatibility
        localStorage.setItem("token", token);
        
        setIsAuthenticated(true);
        navigate("/");
      } else {
        // Signup
        if (form.password !== form.confirmPassword) {
          alert("Passwords do not match");
          setLoading(false);
          return;
        }

        const response = await api.post("/auth/signup", {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        const { userData, token } = response.data;
          setUser(userData);
        
        
        // Optional: Still store token in localStorage for backward compatibility
        localStorage.setItem("token", token);
      
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.code === 'ERR_NETWORK') {
        alert("Cannot connect to server. Please make sure the backend is running.");
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/auth');
      setUser("")
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // If user is already authenticated, show logout option
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            You are already logged in
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div className="flex items-center justify-between px-6 py-4 absolute top-0 left-0 w-full z-10">
        <div className="absolute top-0 left-6 z-20">
          <img
            src="blacklogo.png"
            alt="EasyWheels Logo"
            className="w-60 h-auto"
          />
        </div>

        <div className="absolute top-11 right-12 z-20 flex items-center gap-4">
          <button className="text-gray-600 hover:text-red-500 transition">
            <FiPhone size={30} />
          </button>
          <button className="text-green-500 hover:text-green-600 transition">
            <FaWhatsapp size={30} />
          </button>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-md sm:w-[90%] mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mt-3">
            {isLogin ? "Welcome Back" : "Let's Start Driving"}
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Please login or sign up to continue
          </p>

          {/* Login form */}
          {isLogin ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm font-medium text-gray-700">
                Your Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
                required
              />

              <label className="block text-sm font-medium text-gray-700 mt-4">
                Your Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors mb-6 mt-6 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            /* Signup form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm font-medium text-gray-700 m-0">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
                required
              />

              <label className="block text-sm font-medium text-gray-700 m-0">
                Your Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
                required
              />

              <label className="block text-sm font-medium text-gray-700 m-0">
                Your Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
                required
              />

              <label className="block text-sm font-medium text-gray-700 m-0">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-type password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors mb-6 disabled:opacity-50"
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-500 hover:underline font-medium"
            >
              {isLogin ? "Register now" : "Login here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}