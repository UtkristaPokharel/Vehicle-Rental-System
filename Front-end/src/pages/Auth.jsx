import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { auth, provider, signInWithPopup } from "../../src/firebase";
import { useNavigate } from "react-router";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        fetch("http://localhost:5000/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.displayName,
            email: user.email,
            googleId: user.uid,
          }),
        })
          .then((res) => res.json())
          .then(({ user, token }) => {
            localStorage.setItem("token", token);
            console.log("Google user logged in:", user);
            navigate("/");
          });
      })
      .catch((error) => {
        console.error("Google Sign-In Error:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const route = isLogin ? "login" : "signup";

    if (!isLogin && form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    fetch(`http://localhost:5000/api/auth/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(({ user, token }) => {
        localStorage.setItem("token", token);
        console.log("Manual login/signup user:", user);
        navigate("/");
      })
      .catch((err) => console.error("Login error:", err));
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
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md sm:w-[90%] mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mt-2">
            {isLogin ? "Welcome Back" : "Let's Start Driving"}
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Please login or sign up to continue
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>
          </form>

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