import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { auth, provider, signInWithPopup } from "../../src/firebase";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  // 👉 Google login handler
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Google user:", user.displayName, user.email);
        // You can store the user info or redirect here
      })
      .catch((error) => {
        console.error("Google Sign-In Error:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 absolute top-0 left-0 w-full z-10">
        {/* Logo */}
        {/* Top-Left Logo */}
<div className="absolute top-6 left-6 z-20 text-orange-500 font-bold text-3xl">
  EasyWheels
</div>

{/* Top-Right Contact Icons */}
<div className="absolute top-6 right-6 z-20 flex items-center gap-4">
  <button className="text-gray-600 hover:text-orange-500 transition">
    <FiPhone size={30} />
  </button>
  <button className="text-green-500 hover:text-green-600 transition">
    <FaWhatsapp size={30} />
  </button>
</div>
      </div>

      {/* Auth Form Centered */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md sm:w-[90%] mt-16">
          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mt-2">
            {isLogin ? "Welcome Back" : "Let's Start Learning"}
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Please login or sign up to continue
          </p>

          {/* Form */}
          <form className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Driver's License (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="mt-1 w-full text-sm text-gray-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Re-type password"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
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
