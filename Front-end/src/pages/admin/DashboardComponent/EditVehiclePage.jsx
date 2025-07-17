import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function EditVehicleForm({ initialData = null, onSubmit, onCancel }) {
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
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      console.log("Initial vehicle data:", initialData); // Debug log
      console.log("Vehicle image field:", initialData.image); // Debug log specifically for image
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "",
        brand: initialData.brand || "",
        price: initialData.price || "",
        location: initialData.location || "",
        description: initialData.description || "",
        features: initialData.features || {
          Safety: [],
          "Device connectivity": [],
          "Additional features": [],
        },
      });

      if (initialData.image) {
        let imageUrl;
        // Check if it's already a full URL or just a filename/path
        if (initialData.image.startsWith('http')) {
          imageUrl = initialData.image;
        } else if (initialData.image.startsWith('uploads/')) {
          imageUrl = `http://localhost:3001/${initialData.image}`;
        } else {
          // If it's just a filename, assume it's in uploads/vehicles
          imageUrl = `http://localhost:3001/uploads/vehicles/${initialData.image}`;
        }
        console.log("Setting image preview to:", imageUrl); // Debug log
        setImagePreview(imageUrl);
      }
    }
  }, [initialData]);

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

    // Image validation only for add mode (when initialData is null)
    if (!initialData && !image) {
      newErrors.image = "Image is required.";
    } else if (!initialData && image) {
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
    
    // Create preview for new uploads
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
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

    const name = localStorage.getItem("name") || localStorage.getItem("adminName");
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

    if (!name || !token) {
      toast.error("Login required.");
      return;
    }

    if (!validate()) return;
    setLoading(true);

    try {
      if (initialData) {
        // Update vehicle
        const updateData = {
          ...formData,
          _id: initialData._id,
        };

        const res = await fetch("http://localhost:3001/api/update-vehicle", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Update failed");

        toast.success("Vehicle updated successfully");
        onSubmit(updateData);
      } else {
        // Create new vehicle
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

        const status = name === localStorage.getItem("adminName") ? "active" : "inactive";
        submission.append("status", status);

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
          setImagePreview(null);
          const fileInput = document.getElementById("vehicleImage");
          if (fileInput) fileInput.value = "";
        } else {
          toast.error("Error: " + data.message);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full overflow-y-auto">
        <div className="px-6 py-2">
          <Toaster />
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {initialData ? "Edit Vehicle Details" : "Add Vehicle"}
            </h2>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 text-5xl mb-5"
              >
                ×
              </button>
            )}
          </div>

          {/* Current Vehicle Info Display */}
          {initialData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Editing Vehicle</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <p className="text-gray-800">{initialData.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Type:</span>
                  <p className="text-gray-800">{initialData.type}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Brand:</span>
                  <p className="text-gray-800">{initialData.brand}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Price:</span>
                  <p className="text-gray-800">Rs. {initialData.price}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
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
                      <option value="two-wheeler">Two-Wheeler</option>
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

            {/* Image Section - Upload for Add, Preview Only for Edit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!initialData ? (
                // Add Vehicle Mode - Show Upload Input and Preview
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Image *
                    </label>
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
                      <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                    )}
                    {image && (
                      <p className="text-green-600 text-sm mt-1">
                        Selected: {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <div className="flex flex-col items-center gap-2">
                      <div className="border-2 border-gray-200 rounded-lg overflow-hidden w-48 h-36 flex items-center justify-center bg-gray-50">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Vehicle preview"
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">No image selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Edit Vehicle Mode - Show Preview Only
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Vehicle Image
                  </label>
                  <div className="flex flex-col items-center gap-2">
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden w-48 h-36 flex items-center justify-center bg-gray-50">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Vehicle preview"
                          className="object-contain w-full h-full"
                          onError={(e) => {
                            console.error("Failed to load image:", imagePreview);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                          onLoad={() => {
                            console.log("Image loaded successfully:", imagePreview);
                          }}
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No image available</span>
                      )}
                      <span className="text-red-400 text-sm hidden">Failed to load image</span>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Image updates are not available in edit mode
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Features Section */}
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

            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-red-600 rounded font-bold text-white py-2 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading
                  ? (initialData ? "Updating Vehicle..." : "Adding Vehicle...")
                  : (initialData ? "Update Vehicle" : "Add Vehicle")}
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
