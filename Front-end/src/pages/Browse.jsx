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
  const [randomIds, setRandomIds] = useState([]);
  const scrollRef = useRef(null);

  // 1️⃣  Fetch vehicles once
  useEffect(() => {
    async function getVehicles() {
      const res  = await fetch("http://localhost:3001/api/vehicles");
      const data = await res.json();
      setVehicles(data);
    }
    getVehicles();
  }, []);


  useEffect(() => {
    if (!vehicles.length) return; 

    const count = Math.min(6, vehicles.length);
    const indexes = new Set();
    while (indexes.size < count) {
      indexes.add(Math.floor(Math.random() * vehicles.length)); 
    }
    setRandomIds([...indexes].map(i => vehicles[i]._id));
  }, [vehicles]);

  // 3️⃣  Filter
  const filteredVehicles = vehicles.filter(v => randomIds.includes(v._id));

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
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="min-w-[300px]">
            <VehicleCard vehicle={vehicle} />
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