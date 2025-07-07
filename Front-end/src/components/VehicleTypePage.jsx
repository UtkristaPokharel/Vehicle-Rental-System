import { useParams } from 'react-router';
import { useState } from 'react';
import Navbar from './Navbar';
import VehicleCard from './VehicleCard';
import vehicleData from '../assets/Sample.json';
import { FaChevronDown } from "react-icons/fa";

const VehicleTypePage = () => {
  const { type } = useParams();
  const [sortOption, setSortOption] = useState('default');

  const parsePrice = (priceStr) => {
    const number = priceStr.replace(/[^\d]/g, ''); // removes Rs, commas, etc.
    return parseInt(number, 10);
  };

  const filteredVehicles = vehicleData.filter(
    (v) => v.type.toLowerCase() === type.toLowerCase()
  );

  const sortVehicles = (vehicles) => {
    switch (sortOption) {
      case 'priceLowToHigh':
        return [...vehicles].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      case 'priceHighToLow':
        return [...vehicles].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      case 'popularity':
        return [...vehicles].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return vehicles;
    }
  };

  const sortedVehicles = sortVehicles(filteredVehicles);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-2 sm:mb-0 text-center sm:text-left">
            Vehicles of type: {type}
          </h1>
          <div className="relative w-60">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none w-full border px-3 py-2 pr-10 rounded-xl text-gray-700"
            >
              <option value="default">Default</option>
              <option value="popularity">Popularity</option>
              <option value="priceLowToHigh">Price - Low to High</option>
              <option value="priceHighToLow">Price - High to Low</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedVehicles.map((vehicle) => (
            <VehicleCard type={type} vehicle={vehicle} key={vehicle.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default VehicleTypePage;
