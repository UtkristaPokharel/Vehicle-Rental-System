import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router";
import vehicleData from "../assets/Sample.json";
import { useState } from "react";

// VEHICLE CARD
export const VehicleCard = ({ vehicle, type }) => {
  const [liked, setLiked] = useState(false);

  return (
    <Link
      to={`/vehicle/${type}/${vehicle.id}`}
      state={{
        id: vehicle.id,
        name: vehicle.name,
        image: vehicle.image,
        dateRange: vehicle.dateRange,
        price: vehicle.price,
      }}
    >
      <div className="vehicle-card group w-full rounded-2xl bg-white border border-gray-200 hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
        <div className="relative">
          <img
            className="w-full h-48 sm:h-52 object-cover object-center transition-transform duration-300 group-hover:scale-105"
            src={vehicle.image}
            alt={vehicle.name}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked(!liked);
            }}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-500 p-2 rounded-full shadow-md transition-all"
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <div className="p-4 flex flex-col justify-between h-[160px]">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{vehicle.name}</h3>

            <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
              <FaStar className="text-base" /> 4.5
            </div>

            <div className="text-gray-500 text-sm">{vehicle.dateRange}</div>
          </div>

          <div className="mt-2 text-right">
            <p className="text-base font-semibold text-gray-800">{vehicle.price} total</p>
            <p className="text-sm text-gray-400">Before taxes</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

// VEHICLE GRID
export default function Vehicle({ type }) {
  const vehicles = vehicleData;

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Explore Vehicles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard type={type} vehicle={vehicle} key={vehicle.id} />
        ))}
      </div>
    </div>
  );
}
