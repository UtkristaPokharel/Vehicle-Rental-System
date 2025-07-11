import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminToken", data.token);
      navigate("/admin-panel"); // ✅ Redirect to admin panel after login
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-[300px]">
        <input
          type="text"
          placeholder="Username"
          className=" border-gray-500 rounded-xl border-2 p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border-2 border-gray-500 p-2 rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-red-600 text-white font-bold py-2 rounded-xl">Login</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
