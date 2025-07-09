import { useState } from "react";

const destinations = {
	Butwal: [
		{ name: "Siddhababa Temple", image: "siddhababa.jpg" },
		{ name: "Manimukunda Park", image: "fulbari.jpg" },
		{ name: "Hill Park", image: "hillpark.jpg" },
		{ name: "Jitgadi Killa", image: "jitgadi.jpg" },
	],
	Kathmandu: [
		{ name: "Pashupatinath", image: "pashupatinath.jpg" },
		{ name: "Boudhanath", image: "bouddhanath.jpg" },
	],
	Palpa: [
		{ name: "Rani Mahal", image: "ranimahal.webp" },
		{ name: "Tansen Bazaar", image: "tansen.webp" },
	],
	Bhairahawa: [
		{ name: "Lumbini", image: "lumbini.jpg" },
		{ name: "Gautam Buddha Airport", image: "gbia.jpg" },
	],
	Dang: [
		{ name: "Ghorahi", image: "ghorahi.jpg" },
		{ name: "Tulsipur", image: "tulsipur.jpg" },
	],
	Pokhara: [
		{ name: "Phewa Lake", image: "phewa.jpg" },
		{ name: "Sarangkot", image: "sarangkot.jpg" },
		{ name: "World Peace Pagoda", image: "worldpeace.jpg" },
	],
};

export default function PopularDest() {
	const [selectedPlace, setSelectedPlace] = useState("Butwal");

	return (
		<div className="py-10 bg-white">
			<h2 className="text-2xl font-bold text-center mb-6">
				Our Most Popular Destinations
			</h2>

			<div className="flex p-10 justify-center flex-wrap gap-4 mb-8">
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
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
