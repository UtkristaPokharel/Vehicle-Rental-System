import React, { useState, useEffect } from 'react';
import { getPopularVehicles } from '../utils/vehicleAnalytics';
import VehicleCard from './VehicleCard';

const PopularVehicles = ({ limit = 8 }) => {
  const [popularVehicles, setPopularVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularVehicles = async () => {
      try {
        setLoading(true);
        const vehicles = await getPopularVehicles(limit);
        setPopularVehicles(vehicles);
      } catch (err) {
        setError('Failed to load popular vehicles');
        console.error('Error fetching popular vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularVehicles();
  }, [limit]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading popular vehicles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (popularVehicles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No popular vehicles found.</p>
      </div>
    );
  }

  return (
    <div className="popular-vehicles">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Vehicles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {popularVehicles.map((vehicle) => (
          <div key={vehicle._id} className="relative">
            <VehicleCard 
              vehicle={vehicle} 
              type={vehicle.type === 'two-wheeler' ? 'two-wheeler' : vehicle.type.toLowerCase()}
            />
            {vehicle.clickCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {vehicle.clickCount} {vehicle.clickCount === 1 ? 'view' : 'views'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularVehicles;
