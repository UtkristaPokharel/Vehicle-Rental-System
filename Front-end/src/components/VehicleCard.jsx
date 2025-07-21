import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const VehicleCard = ({ vehicle, type }) => {
  const [liked, setLiked] = useState(false);

  const trackClick = async () => {
    try {
      await fetch(`http://localhost:3001/api/public/track-click/${vehicle._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  return (
    <Link
      to={`/vehicle/${type}/${vehicle._id}`}
      state={{
        id: vehicle._id,
        name: vehicle.name,
        image: vehicle.image,
        dateRange: vehicle.dateRange,
        price: vehicle.price,
      }}
      onClick={trackClick}
    >
      <div className="vehicle-card group w-full rounded-3xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative">
        <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
        
        <div className="relative">
          <img
            className="w-full h-52 sm:h-56 object-cover object-center transition-transform duration-300 group-hover:scale-105"
            src={`http://localhost:3001/uploads/vehicles/${vehicle.image}`}
            alt={vehicle.name}
          />
          
          {/* Simplified gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked(!liked);
            }}
            className={`absolute top-3 right-3 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-20 ${
              liked 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-red-500 hover:text-red-600'
            }`}
          >
            {liked ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
          </button>
        </div>

        <div className="p-6 flex flex-col justify-between min-h-[150px] relative">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 truncate group-hover:text-indigo-600 transition-colors duration-200">
                {vehicle.name}
              </h3>
            </div>

            <div className="flex items-center text-gray-500 text-sm">{vehicle.dateRange}</div>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div className="flex flex-col">
              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-indigo-600 bg-clip-text text-transparent">
                {vehicle.price}
              </p>
              <p className="text-sm text-gray-400">per day • Before taxes</p>
            </div>
            
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition-transform duration-200">
              Book Now
            </div>
          </div>
        </div>
        
        {/* Simple bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </Link>
  );
};

export default VehicleCard;
