import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { RiMotorbikeFill } from "react-icons/ri";
import { FaCar, FaBus } from "react-icons/fa";
import { PiTruckTrailerFill } from "react-icons/pi";
import { PiTruckFill } from "react-icons/pi";
import VehicleCard from "../components/VehicleCard";
// import vehicleData from '../assets/Sample.json';
// import { useRef } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";


const vehicleTypes = [
  { name: 'Two-Wheeler', icon: <RiMotorbikeFill /> },
  { name: 'Pickup', icon: <PiTruckFill /> },
  { name: 'Car', icon: <FaCar /> },
  { name: 'Truck', icon: <PiTruckTrailerFill /> },
  { name: 'Bus', icon: <FaBus /> },
];


export default function VehicleBrowse() {
  const navigate = useNavigate();
  
  const handleClick = (type) => {
    navigate(`/vehicles/${type}`);
  };
  
  return (
    <div className="vehicle-browse flex justify-center items-center flex-col my-10 p-3  w-[90vw] md:w-[80vw]">
      <h2 className="text-3xl font-bold text-center m-12">
        Browse Our Vehicles
      </h2>

      <ul className="flex flex-wrap justify-center items-center gap-20 list-none mb-4 text-2xl">
        {vehicleTypes.map((vehicle, index) => (
          <li
          key={index}
          className="text-center cursor-pointer  flex flex-col items-center "
          onClick={() => handleClick(vehicle.name)}
          >
            {vehicle.icon}
            <h1 className="mt-1 text-sm font-bold">{vehicle.name}</h1>
          </li>
        ))}
      </ul>


      <SuggestedVehicle />

    </div>
  );
};


export const SuggestedVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [suggestedVehicles, setSuggestedVehicles] = useState([]);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const scrollRef = useRef(null);

  // Fetch all vehicles
  useEffect(() => {
    async function getVehicles() {
      try {
        const res = await fetch("http://localhost:3001/api/vehicles");
        const data = await res.json();
        // Filter only active vehicles
        const activeVehicles = data.filter(vehicle => vehicle.isActive === true);
        setVehicles(activeVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    }
    getVehicles();
  }, []);

  // Function to refresh suggestions
  const refreshSuggestions = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Add event listener for focus to refresh suggestions when user returns to page
  useEffect(() => {
    const handleFocus = () => {
      refreshSuggestions();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Generate suggestions based on click data or show random vehicles
  useEffect(() => {
    if (!vehicles.length) return;

    const generateSuggestions = async () => {
      try {
        // Try to get popular vehicles first (based on clicks)
        const popularRes = await fetch("http://localhost:3001/api/public/popular?limit=10");
        
        if (popularRes.ok) {
          const popularVehicles = await popularRes.json();
          
          // Get vehicles with clicks (max 5)
          const vehiclesWithClicks = popularVehicles.filter(v => v.clickCount > 0).slice(0, 5);
          
          if (vehiclesWithClicks.length > 0) {
            // We have some click data, create a mixed recommendation
            const clickedVehicleIds = vehiclesWithClicks.map(v => v._id);
            
            // Get remaining vehicles (excluding already clicked ones)
            const remainingVehicles = vehicles.filter(v => !clickedVehicleIds.includes(v._id) && v.isActive);
            
            // Calculate how many more vehicles we need (total 6)
            const remainingSlotsNeeded = 6 - vehiclesWithClicks.length;
            
            // Get random vehicles to fill remaining slots
            const shuffledRemaining = [...remainingVehicles].sort(() => 0.5 - Math.random());
            const randomVehicles = shuffledRemaining.slice(0, remainingSlotsNeeded);
            
            // Combine clicked vehicles and random vehicles
            const mixedSuggestions = [...vehiclesWithClicks, ...randomVehicles];
            
            setSuggestedVehicles(mixedSuggestions);
            setIsPersonalized(true);
            return;
          }
        }
        
        // Fallback: Show random vehicles if no click data
        const count = Math.min(6, vehicles.length);
        const shuffled = [...vehicles].sort(() => 0.5 - Math.random());
        setSuggestedVehicles(shuffled.slice(0, count));
        setIsPersonalized(false);
        
      } catch (error) {
        console.error('Error generating suggestions:', error);
        // Fallback to random vehicles
        const count = Math.min(6, vehicles.length);
        const shuffled = [...vehicles].sort(() => 0.5 - Math.random());
        setSuggestedVehicles(shuffled.slice(0, count));
        setIsPersonalized(false);
      }
    };

    generateSuggestions();
  }, [vehicles, refreshKey]); // Added refreshKey as dependency

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full mt-8">
      {/* Header with personalization indicator and refresh button */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {isPersonalized ? "Trending & Featured Vehicles" : "Featured Vehicles"}
          </h3>
          <button
            onClick={refreshSuggestions}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
        {isPersonalized && (
          <p className="text-sm text-gray-600 mt-1">
            Popular choices + more vehicles for you • Click refresh to update
          </p>
        )}
      </div>
    
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
      >
        <IoChevronBack size={24} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth px-10 py-4 hide-scrollbar"
      >
        {suggestedVehicles.map((vehicle) => (
          <div key={vehicle._id} className="min-w-[300px] relative">
            <VehicleCard 
              vehicle={vehicle} 
              type={vehicle.type === 'two-wheeler' ? 'two-wheeler' : vehicle.type.toLowerCase()}
            />
            {isPersonalized && vehicle.clickCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                🔥 {vehicle.clickCount} {vehicle.clickCount === 1 ? 'view' : 'views'}
              </div>
            )}
            {isPersonalized && vehicle.clickCount === 0 && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                ✨ New
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
      >
        <IoChevronForward size={24} />
      </button>
    </div>
  );
};