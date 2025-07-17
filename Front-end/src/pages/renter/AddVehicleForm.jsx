import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AddVehicle() {
  
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    brand: "",
    price: "",
    location: "",
    description: "",
    features: {
      Safety: [],
      "Device connectivity": [],
      "Additional features": [],
    },
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Auth check

  const validate = () => {
    const newErrors = {};
    const startsWithNumber = (value) => /^\d/.test(value);

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    else if (startsWithNumber(formData.name)) newErrors.name = "Must not start with number.";

    if (!formData.type.trim()) newErrors.type = "Type is required.";
    else if (startsWithNumber(formData.type)) newErrors.type = "Must not start with number.";

    if (!formData.brand.trim()) newErrors.brand = "Brand is required.";
    else if (startsWithNumber(formData.brand)) newErrors.brand = "Must not start with number.";

    if (!formData.price || parseFloat(formData.price) <= 1) newErrors.price = "Price must be positive.";

    if (!formData.location.trim()) newErrors.location = "Location is required.";

    if (!image) {
      newErrors.image = "Image is required.";
    } else {
      const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowed.includes(image.type)) {
        newErrors.image = "Invalid image type.";
      } else if (image.size > 5 * 1024 * 1024) {
        newErrors.image = "Image must be < 5MB.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleFeatureChange = (category, index, value) => {
    const updated = [...formData.features[category]];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [category]: updated,
      },
    }));
  };

  const addFeature = (category) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [category]: [...prev.features[category], ""],
      },
    }));
  };

  const removeFeature = (category, index) => {
    const updated = formData.features[category].filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [category]: updated,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = localStorage.getItem("name") ||localStorage.getItem("adminName");
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    if (!name || !token ) {
      toast.error("Login required.");
      return;
    }

    if (!validate()) return;
    setLoading(true);

    try {
      const submission = new FormData();
      submission.append("name", formData.name);
      submission.append("type", formData.type);
      submission.append("brand", formData.brand);
      submission.append("price", formData.price);
      submission.append("location", formData.location);
      submission.append("description", formData.description);
      submission.append("features", JSON.stringify(formData.features));
      submission.append("vehicleImage", image);
      submission.append("createdBy", name || "admin");

      const res = await fetch("http://localhost:3001/api/add-vehicle", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submission,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Vehicle added successfully");
        setFormData({
          name: "",
          type: "",
          brand: "",
          price: "",
          location: "",
          description: "",
          features: {
            Safety: [],
            "Device connectivity": [],
            "Additional features": [],
          },
        });
        setImage(null);
        setErrors({});
        const fileInput = document.getElementById("vehicleImage");
        if (fileInput) fileInput.value = "";
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["name", "type", "brand", "price", "location"].map((field) => (
            <div key={field}>
              {field === "type" ? (
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="two-wheeler">Two Wheeler</option>
                  <option value="car">Car</option>
                  <option value="truck">Truck</option>
                  <option value="pickup">Pickup</option>
                  <option value="bus">Bus</option>
                </select>
              ) : (
                <input
                  type={field === "price" ? "number" : "text"}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                  step={field === "price" ? "1" : undefined}
                  min={field === "price" ? "0" : undefined}
                />
              )}
              {errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )}
            </div>
          ))}
          <div className="md:col-span-2">
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded w-full h-28"
            />
          </div>
        </div>

        <div>
          <input
            type="file"
            id="vehicleImage"
            name="vehicleImage"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 rounded w-full"
            required
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
          {image && (
            <p className="text-green-600 text-sm mt-1">
              Selected: {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Vehicle Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.keys(formData.features).map((category) => (
              <div key={category} className="border rounded-lg p-4">
                <h4 className="font-bold mb-3 text-center bg-gray-100 py-2 rounded">
                  {category}
                </h4>
                {formData.features[category].map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleFeatureChange(category, index, e.target.value)
                      }
                      className="flex-1 p-2 border border-gray-300 rounded text-sm"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(category, index)}
                      className="text-red-500 hover:text-red-700 px-2"
                      title="Remove feature"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFeature(category)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline mt-2"
                >
                  + Add Feature
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 rounded font-bold text-white py-2 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Vehicle..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
}
