import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function AddVehicle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    brand: "",
    price: "",
    location: "",
    features: {
      Safety: [],
      "Device connectivity": [],
      "Additional features": [],
    },
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Check if user is logged in by verifying name and email in localStorage
  useEffect(() => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!name || !email || !token) {
      toast.error("You must be logged in. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      toast.success(`Welcome back, ${name}!`);
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    const startsWithNumber = (value) => /^\d/.test(value);

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (startsWithNumber(formData.name)) {
      newErrors.name = "Name must not start with a number.";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Type is required.";
    } else if (startsWithNumber(formData.type)) {
      newErrors.type = "Type must not start with a number.";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required.";
    } else if (startsWithNumber(formData.brand)) {
      newErrors.brand = "Brand must not start with a number.";
    }

    if (!formData.price || parseFloat(formData.price) <= 1) {
      newErrors.price = "Price must be a positive number.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    if (!image) {
      newErrors.image = "Image is required.";
    } else {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(image.type)) {
        newErrors.image = "Please select a valid image file (JPEG, PNG, JPG).";
      } else if (image.size > 5 * 1024 * 1024) {
        newErrors.image = "Image size must be less than 5MB.";
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
    const updatedItems = [...formData.features[category]];
    updatedItems[index] = value;

    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [category]: updatedItems,
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
    const updatedItems = formData.features[category].filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [category]: updatedItems,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");

    if (!name || !email || !token) {
      toast.error("You must be logged in. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
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
      submission.append("features", JSON.stringify(formData.features));
      submission.append("vehicleImage", image);
      submission.append("createdBy", id);

      const res = await fetch("http://localhost:3001/user/add-vehicle", {
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
          features: {
            Safety: [],
            "Device connectivity": [],
            "Additional features": [],
          },
          createdBy: "",
        });
        setImage(null);
        setErrors({});
        const fileInput = document.getElementById("vehicleImage");
        if (fileInput) fileInput.value = "";
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Something went wrong while adding vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {["name", "type", "brand", "price", "location"].map((field) => (
          <div key={field}>
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
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}
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
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
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
                <h4 className="font-bold mb-3 text-center bg-gray-100 py-2 rounded">{category}</h4>
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
          className="bg-red-600 rounded font-bold text-white py-2 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Vehicle..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
}