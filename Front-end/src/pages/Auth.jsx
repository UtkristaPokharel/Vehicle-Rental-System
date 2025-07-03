import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { auth, provider, signInWithPopup } from "../../src/firebase";
import { useNavigate } from "react-router";
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        api.post("/auth/google", {
          name: user.displayName,
          email: user.email,
          googleId: user.uid,
        })
          .then((response) => {
            const { user: userData, token } = response.data;
            localStorage.setItem("token", token);
            console.log("Google user logged in:", userData);
            navigate("/");
          })
          .catch((error) => {
            console.error("Google Sign-In Error:", error);
          });
      })
      .catch((error) => {
        console.error("Google Sign-In Error:", error);
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
        
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        console.log("User logged in:", user);
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

        const { user, token } = response.data;
        localStorage.setItem("token", token);
        console.log("User signed up:", user);
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

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div className="flex items-center justify-between px-6 py-4 absolute top-0 left-0 w-full z-10">
        <div className="absolute top-6 left-6 z-20 text-orange-500 font-bold text-3xl">
          EasyWheels
        </div>
        <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
          <button className="text-gray-600 hover:text-orange-500 transition">
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-colors mb-6 mt-6 disabled:opacity-50"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-colors mb-6 disabled:opacity-50"
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
              className="text-orange-500 hover:underline font-medium"
            >
              {isLogin ? "Register now" : "Login here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}