import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import VehicleCard from './VehicleCard';
import { FaChevronDown } from "react-icons/fa";

const VehicleTypePage = () => {
  const { type } = useParams();
  const [vehicles, setVehicles] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/vehicles/type/${type.toLowerCase()}`);
        const data = await res.json();
        setVehicles(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };

    fetchVehicles();
  }, [type]);

  const parsePrice = (price) => {
    if (typeof price === "string") {
      const number = price.replace(/[^\d]/g, '');
      return parseInt(number, 10);
    }
    return price;
  };

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

  const sortedVehicles = sortVehicles(vehicles);
  console.log('Vehicles:', vehicles);
  console.log('Vehicle type param:', type);



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

        {loading ? (
          <p>Loading...</p>
        ) : (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedVehicles.map((vehicle) => (
              <VehicleCard type={type} vehicle={vehicle} key={vehicle._id || vehicle.id} />
            ))}
          </div>
        )}
      </div>
      
    </>
  );
};

export default VehicleTypePage;
