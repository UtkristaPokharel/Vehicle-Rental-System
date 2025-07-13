import React, { useState, useEffect } from 'react';
import DashboardComponent from "../admin/DashboardComponent.jsx";
import axios from "axios";

const Sidebar = ({ selectedMenu, setSelectedMenu }) => {
  const menuItems = [
    { id: 'vehicles', name: 'Vehicle Listing' },
    { id: 'users', name: 'Users' },
    { id: 'add-vehicle', name: 'Add Vehicle' },
  ];

  return (
    <div className="w-64 bg-blue-400 text-white h-screen fixed top-0 left-0">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Admin Dashboard
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full text-left p-4 hover:bg-gray-700 transition-colors ${
              selectedMenu === item.id ? 'bg-gray-700' : ''
            }`}
            onClick={() => setSelectedMenu(item.id)}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

const VehicleListing = ({ vehicles }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Vehicle Listing</h2>
    <div className="bg-white p-4 rounded-lg shadow">
      {vehicles.length === 0 ? (
        <p className="text-gray-600">No vehicles available.</p>
      ) : (
        <DashboardComponent vehicles={vehicles} />
      )}
    </div>
  </div>
);

const Users = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Users</h2>
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-600">User management interface will be displayed here.</p>
      <div className="p-2 bg-gray-300 rounded mt-2 grid grid-cols-2 md:grid-cols-3 sm:grid-row-3">
        <span>Userid</span>
        <span>UserEmail</span>
        <span>UserStatus</span>
      </div>
    </div>
  </div>
);

const AddVehicle = ({ vehicles }) => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Add Vehicle</h2>
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-600">Form to add a new vehicle will be displayed here.</p>
      {/* Add vehicle form component here later */}
      <DashboardComponent vehicles={vehicles} />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('vehicles');
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/vehicles")
      .then(res => setVehicles(res.data.reverse()))
      .catch(err => console.error("Error fetching vehicles:", err));
  }, []);

  const renderContent = () => {
    switch (selectedMenu) {
      case 'vehicles':
        return <VehicleListing vehicles={vehicles} />;
      case 'users':
        return <Users />;
      case 'add-vehicle':
        return <AddVehicle vehicles={vehicles} />;
      default:
        return <VehicleListing vehicles={vehicles} />;
    }
  };

  return (
    <div className="flex">
      <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
