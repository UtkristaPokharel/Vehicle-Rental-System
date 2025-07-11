import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    brand: "",
    price: "",
    location: "",
    image: null,
  });

  const [errors, setErrors] = useState({});

  // ✅ Redirect if not logged in
useEffect(() => {
  const isLoggedIn = localStorage.getItem("adminLoggedIn");
  const token = localStorage.getItem("adminToken");
  if (!isLoggedIn || !token) {
    navigate("/admin-login");
  }
}, [navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name || /^\d/.test(formData.name)) newErrors.name = "Name must not start with a number";
    if (!formData.brand || /^\d/.test(formData.brand)) newErrors.brand = "Brand must not start with a number";
    if (!formData.type || /^\d/.test(formData.type)) newErrors.type = "Type must not start with a number";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Price must be a positive number";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const submission = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submission.append(key, value);
      });

      const res = await fetch("http://localhost:3001/admin/add-vehicle", {
        method: "POST",
        body: submission,
        headers:{
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Vehicle added successfully");
        setFormData({ name: "", type: "", brand: "", price: "", location: "", image: null });
        setErrors({});
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to connect to backend");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel – Add Vehicle</h2>
      <form onSubmit={handleAddVehicle} className="flex flex-col gap-4">
        {["name", "type", "brand", "price", "location"].map((field) => (
          <div key={field}>
            <input
              type={field === "price" ? "number" : "text"}
              name={field}
              placeholder={field}
              value={formData[field]}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}
        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
        </div>
        <button type="submit" className="bg-red-600 rounded font-bold text-white py-2 hover:bg-red-700">
          Add Vehicle
        </button>
      </form>
    </div>
  );
}
