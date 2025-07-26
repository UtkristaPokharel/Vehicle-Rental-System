import React from 'react';
import { FaHeart, FaMapMarkerAlt, FaEye, FaCar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../config/api';
import toast from 'react-hot-toast';

const FavoriteVehicleCard = ({ vehicle, onRemoveFavorite }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    // Check if vehicle is available
    if (!vehicle.isAvailable) {
      toast.error("This vehicle is currently not available for viewing.");
      return;
    }
    
    const type = vehicle.type === 'two-wheeler' ? 'two-wheeler' : vehicle.type.toLowerCase();
    return `/vehicle/${type}/${vehicle._id}`;
  };

  const handleRentNow = () => {
    if (!vehicle.isAvailable) {
      toast.error("This vehicle is currently not available for rental.");
      return;
    }
    
    const type = vehicle.type === 'two-wheeler' ? 'two-wheeler' : vehicle.type.toLowerCase();
    navigate(`/vehicle/${type}/${vehicle._id}`);
  };

  const handleRemoveFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onRemoveFavorite) {
      await onRemoveFavorite(vehicle._id);
    }
  };

  return (
    <div className={`group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden ${
      !vehicle.isAvailable ? 'opacity-60' : ''
    }`}>
      {/* Availability Status Badge */}
      {!vehicle.isAvailable && (
        <div className="absolute top-3 left-3 z-20 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          Not Available
        </div>
      )}
      
      {/* Remove Favorite Button */}
      <button
        onClick={handleRemoveFavorite}
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-red-500 text-red-500 hover:text-white rounded-full shadow-md transition-all duration-200"
        title="Remove from favorites"
      >
        <FaHeart className="text-sm" />
      </button>

      <Link 
        to={vehicle.isAvailable ? handleViewDetails() : '#'} 
        className="block"
        onClick={(e) => {
          if (!vehicle.isAvailable) {
            e.preventDefault();
            toast.error("This vehicle is currently not available for viewing.");
          }
        }}
      >
        {/* Vehicle Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl(vehicle.image)}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* View Count Badge */}
          {vehicle.clickCount > 0 && vehicle.isAvailable && (
            <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <FaEye className="text-xs" />
              <span>{vehicle.clickCount}</span>
            </div>
          )}
        </div>

        {/* Vehicle Information */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors leading-tight">
              {vehicle.name}
            </h3>
            <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium capitalize ml-2 flex-shrink-0">
              {vehicle.type.replace('two-wheeler', '2W')}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <FaMapMarkerAlt className="text-red-500 text-sm" />
            <span className="text-sm">{vehicle.location}</span>
          </div>

          {/* Price and Actions */}
          <div className="flex items-end justify-between mb-3">
            <div className="flex flex-col">
              <p className="text-xl font-bold text-green-600">
                {vehicle.price}
              </p>
              <p className="text-xs text-gray-500">per day</p>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              vehicle.isAvailable 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-300 text-gray-500'
            }`}>
              {vehicle.isAvailable ? 'View' : 'Not Available'}
            </div>
          </div>

          {/* Rent Now Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRentNow();
            }}
            disabled={!vehicle.isAvailable}
            className={`w-full font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
              vehicle.isAvailable 
                ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FaCar className="text-sm" />
            {vehicle.isAvailable ? 'Rent Now' : 'Not Available'}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default FavoriteVehicleCard;
