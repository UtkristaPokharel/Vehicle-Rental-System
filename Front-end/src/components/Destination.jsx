import { useState } from "react";

const destinations = {
  Butwal: [
    { name: "Devdaha", image: "butwal.jpg" },
    { name: "Manimukunda Park", image: "butwal.jpg" },
    { name: "Hill Park", image: "butwal.jpg" },
  ],
  Kathmandu: [
    { name: "Pashupatinath", image: "butwal.jpg" },
    { name: "Boudhanath", image: "butwal.jpg" },
  ],
  Palpa: [
    { name: "Rani Mahal", image: "butwal.jpg" },
    { name: "Tansen Bazaar", image: "butwal.jpg" },
  ],
  Bhairahawa: [
    { name: "Lumbini", image: "butwal.jpg" },
    { name: "Gautam Buddha Airport", image: "butwal.jpg" },
  ],
  Dang: [
    { name: "Ghorahi", image: "butwal.jpg" },
    { name: "Tulsipur", image: "butwal.jpg" },
  ],
  Pokhara: [
    { name: "Phewa Lake", image: "butwal.jpg" },
    { name: "Sarangkot", image: "butwal.jpg" },
    { name: "World Peace Pagoda", image: "butwal.jpg" },
  ],
};

export default function PopularDest() {
  const [selectedPlace, setSelectedPlace] = useState("Butwal");

  return (
    <div className="py-10 bg-white">
	 <h2 className="text-2xl font-bold text-center mb-6">
	   Our Most Popular Destinations
	 </h2>

	 {/* Tabs */}
	 <div className="flex justify-center flex-wrap gap-4 mb-8">
	   {Object.keys(destinations).map((place) => (
		<button
		  key={place}
		  onClick={() => setSelectedPlace(place)}
		  className={`px-4 py-2 rounded-full border ${selectedPlace === place
			 ? "bg-red-600 text-white"
			 : "bg-white text-black border-gray-300"
		    } hover:bg-red-500 hover:text-white transition`}
		>
		  {place}
		</button>
	   ))}
	 </div>

	 {/* Destination Cards */}
	 <div className="flex flex-wrap justify-center gap-6 px-4">
	   {destinations[selectedPlace].map((location, index) => (
		<div
		  key={index}
		  className="w-64 bg-[#fffafa] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
		>
		  <img
		    src={location.image}
		    alt={location.name}
		    className="w-full h-40 object-cover"
		  />
		  <div className="p-4 text-center">
		    <h3 className="font-semibold text-lg">{location.name}</h3>
		    {/* <p className="text-sm text-gray-500">· {selectedPlace}</p> */}
		  </div>
		</div>
	   ))}
	 </div>
    </div>
  );
};
