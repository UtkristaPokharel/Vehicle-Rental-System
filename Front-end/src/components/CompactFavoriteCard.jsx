import React from 'react';
import { motion as Motion } from 'framer-motion';
import { FaHeart, FaMapMarkerAlt, FaEye, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../config/api';

const CompactFavoriteCard = ({ vehicle, onRemove, showRemoveButton = true }) => {
  const handleViewDetails = () => {
    const type = vehicle.type === 'two-wheeler' ? 'two-wheeler' : vehicle.type.toLowerCase();
    return `/vehicle/${type}/${vehicle._id}`;
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(vehicle._id);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-200"
    >
      <Link to={handleViewDetails()} className="block">
        <div className="flex gap-3 p-3">
          {/* Vehicle Image */}
          <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={getImageUrl(vehicle.image)}
              alt={vehicle.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Favorite Badge */}
            <div className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1">
              <FaHeart className="text-xs" />
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-semibold text-gray-800 text-sm truncate group-hover:text-red-600 transition-colors">
                {vehicle.name}
              </h4>
              
              {showRemoveButton && (
                <button
                  onClick={handleRemove}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-2 flex-shrink-0"
                  title="Remove from favorites"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-500 mb-2">
              <FaMapMarkerAlt className="text-xs text-red-400" />
              <span className="text-xs truncate">{vehicle.location}</span>
            </div>

            {/* Price and Views */}
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-green-600">
                {vehicle.price}
              </div>
              
              {vehicle.clickCount > 0 && (
                <div className="flex items-center gap-1 text-gray-400">
                  <FaEye className="text-xs" />
                  <span className="text-xs">{vehicle.clickCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Hover Effect Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Motion.div>
  );
};

export default CompactFavoriteCard;
