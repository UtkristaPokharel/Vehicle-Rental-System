import { useState,useEffect } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function VehicleDataComponent() {
  const [showDropdown, setShowDropdown] = useState(null);
  const [vehicles,setVehicles]=useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001/api/vehicles")
        .then(res => setVehicles(res.data.reverse()))
        .catch(err => toast.error("Error fetching vehicles:", err));
    }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm font-medium text-gray-500 border-b">
            <th className="pb-3 px-4">Vehicle ID</th>
            <th className="pb-3 px-4">Name</th>
            <th className="pb-3 px-4">Type</th>
            <th className="pb-3 px-4">Location</th>
            <th className="pb-3 px-4">Price</th>
            <th className="pb-3 px-4">Created By</th>
            <th className="pb-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle, index) => (
            <tr key={vehicle._id} className="border-b border-gray-100 hover:bg-gray-100">
              <td className="py-4 px-4 text-sm text-gray-600">{vehicle._id}</td>
              <td className="py-4 px-4 text-sm text-gray-600">{vehicle.name}</td>
              <td className="py-4 px-4 text-sm text-gray-600">{vehicle.type}</td>
              <td className="py-4 px-4 text-sm text-gray-600">{vehicle.location}</td>
              <td className="py-4 px-4 text-sm text-gray-800 font-medium">Rs {vehicle.price}</td>
              <td className="py-4 px-4 text-sm text-gray-600">{vehicle.createdBy}</td>
              <td className="py-4 px-4">
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(showDropdown === index ? null : index)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <BsThreeDotsVertical className="text-gray-600" />
                  </button>

                  {showDropdown === index && (
                    <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                        Edit
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
