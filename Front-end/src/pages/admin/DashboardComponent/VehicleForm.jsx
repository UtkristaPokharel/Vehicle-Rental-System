// VehicleForm.jsx
import { useState, useEffect } from 'react';

export default function VehicleForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    brand: '',
    imageUrl: '',
    price: '',
    location: '',
    status: 'active',
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md w-full max-w-xl shadow-lg space-y-4">
        <h2 className="text-lg font-semibold mb-4">Edit Vehicle</h2>

        {["name", "type", "brand", "imageUrl", "price", "location"].map((field) => (
          <input
            key={field}
            name={field}
            value={formData[field] || ""}
            onChange={handleChange}
            placeholder={field}
            className="w-full border px-4 py-2 rounded-md"
            type={field === "price" ? "number" : "text"}
          />
        ))}

        <select name="status" value={formData.status} onChange={handleChange} className="w-full border px-4 py-2 rounded-md">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
