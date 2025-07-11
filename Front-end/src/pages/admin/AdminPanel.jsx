import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    brand: "",
    imageUrl: "",
    price: "",
    location: "",
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/admin/add-vehicle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Vehicle added successfully");
      setFormData({
        id: "",
        name: "",
        type: "",
        brand: "",
        imageUrl: "",
        price: "",
        location: "",
      });
    } else {
      alert("Error: " + data.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel – Add Vehicle</h2>
      <form onSubmit={handleAddVehicle} className="flex flex-col gap-3">
        {["id", "name", "type", "brand", "imageUrl", "price", "location"].map((field) => (
          <input
            key={field}
            type={field === "price" || field === "id" ? "number" : "text"}
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            className="border p-2 rounded-sm"
            required
          />
        ))}
        <button type="submit" className="bg-red-600 rounded font-bold text-white py-2">
          Add Vehicle
        </button>
      </form>
    </div>
  );
}
