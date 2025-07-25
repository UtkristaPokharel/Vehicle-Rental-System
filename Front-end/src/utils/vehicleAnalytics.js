// Utility functions for vehicle analytics and content-based filtering
import { getApiUrl } from '../config/api';

export const trackVehicleClick = async (vehicleId) => {
  try {
    const response = await fetch(getApiUrl(`api/public/track-click/${vehicleId}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to track click');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error tracking click:', error);
    throw error;
  }
};

export const getPopularVehicles = async (limit = 10) => {
  try {
    const response = await fetch(getApiUrl(`api/public/popular?limit=${limit}`));
    
    if (!response.ok) {
      throw new Error('Failed to fetch popular vehicles');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching popular vehicles:', error);
    throw error;
  }
};

export const getVehiclesByClickCount = async (vehicles) => {
  // Sort vehicles by click count in descending order
  return vehicles.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
};

export const suggestSimilarVehicles = async (currentVehicle, allVehicles, limit = 5) => {
  // Simple content-based filtering: suggest vehicles of same type or brand
  // prioritizing by click count
  const similarVehicles = allVehicles.filter(vehicle => 
    vehicle._id !== currentVehicle._id && 
    (vehicle.type === currentVehicle.type || vehicle.brand === currentVehicle.brand) &&
    vehicle.isActive === true
  );
  
  // Sort by click count and return limited results
  return similarVehicles
    .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
    .slice(0, limit);
};
