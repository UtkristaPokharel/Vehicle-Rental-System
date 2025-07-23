import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { getApiUrl, getImageUrl } from "../config/api";
import BackButton from '../components/BackButton';

const VehicleCard = ({ vehicle }) => {
	const navigate = useNavigate();
	const [liked, setLiked] = useState(false);
	const [loading, setLoading] = useState(false);

	// Check if vehicle is in favorites when component mounts
	useEffect(() => {
		const checkFavoriteStatus = async () => {
			const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
			if (!token) return;

			try {
				const response = await fetch(getApiUrl(`api/favorites/check/${vehicle._id}`), {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});
				
				if (response.ok) {
					const data = await response.json();
					setLiked(data.isFavorite);
				}
			} catch (error) {
				console.error('Error checking favorite status:', error);
			}
		};

		checkFavoriteStatus();
	}, [vehicle._id]);

	const handleFavoriteToggle = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		
		const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
		if (!token) {
			alert("Please login to add favorites");
			return;
		}

		setLoading(true);
		
		try {
			const url = liked 
				? getApiUrl(`api/favorites/remove/${vehicle._id}`)
				: getApiUrl(`api/favorites/add/${vehicle._id}`);
			
			const method = liked ? 'DELETE' : 'POST';
			
			const response = await fetch(url, {
				method,
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				const data = await response.json();
				setLiked(data.isFavorite);
			} else {
				const errorData = await response.json();
				console.error('Error toggling favorite:', errorData.message);
			}
		} catch (error) {
			console.error('Error toggling favorite:', error);
		} finally {
			setLoading(false);
		}
	};

	const trackClick = async () => {
		try {
			await fetch(getApiUrl(`api/public/track-click/${vehicle._id}`), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
		} catch (error) {
			console.error('Error tracking click:', error);
		}
	};

	const handleRentNow = async () => {
		await trackClick(); // Track the click
		const type = vehicle.type === 'two-wheeler' ? 'two-wheeler' : vehicle.type.toLowerCase();
		navigate(`/vehicle/${type}/${vehicle._id}`, {
			state: {
				id: vehicle._id,
				name: vehicle.name,
				image: vehicle.image,
				dateRange: vehicle.dateRange,
				price: vehicle.price,
			},
		});
	};

	return (
		<Motion.div
			className="vehicle-card group w-full rounded-3xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative"
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
			
			<div className="relative">
				<img 
					src={getImageUrl(vehicle.image)} 
					alt={vehicle.name} 
					className="w-full h-52 sm:h-56 object-cover object-center transition-transform duration-300 group-hover:scale-105"
				/>

				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				
				<button
					onClick={handleFavoriteToggle}
					disabled={loading}
					className={`absolute top-3 right-3 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-20 ${
						liked 
							? 'bg-red-500 text-white' 
							: 'bg-white text-red-500 hover:text-red-600'
					} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
				>
					{liked ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
				</button>
			</div>

			<div className="p-6 flex flex-col justify-between min-h-[180px] relative">
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-bold text-gray-800 truncate group-hover:text-indigo-600 transition-colors duration-200">
							{vehicle.name}
						</h3>
						<div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
							{vehicle.type.replace('two-wheeler', 'Two Wheeler')}
						</div>
					</div>
					
					<div className="flex items-center text-gray-500 text-sm">
						Available: {vehicle.dateRange}
					</div>
				</div>

				<div className="mt-4 flex items-end justify-between">
					<div className="flex flex-col">
						<p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
							{vehicle.price}
						</p>
						<p className="text-sm text-gray-400">Before taxes</p>
					</div>
					
					<button
						onClick={handleRentNow}
						className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
					>
						Rent Now
					</button>
				</div>
			</div>
		</Motion.div>
	);
};

const VehicleBrowse = () => {
	const [vehicles, setVehicles] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [categories, setCategories] = useState(['All']);
	const [sortBy, setSortBy] = useState('default');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				const res = await fetch(getApiUrl('api/vehicles'));
				const data = await res.json();
				const activeVehicles = data.filter(vehicle => vehicle.isActive === true);
				setVehicles(activeVehicles);

				const uniqueCategories = [
					'All',
					...new Set(activeVehicles.map(vehicle => vehicle.type).sort()),
				].map(category =>
					category === 'two-wheeler'
						? 'Two Wheeler'
						: category.charAt(0).toUpperCase() + category.slice(1)
				);
				setCategories(uniqueCategories);
				setLoading(false);
			} catch (err) {
				console.error('Error fetching vehicles:', err);
				setError('Unable to load vehicles. Please try again later.');
				setLoading(false);
			}
		};

		fetchVehicles();
	}, []);

	const filteredVehicles =
		selectedCategory === 'All'
			? vehicles
			: vehicles.filter(
					vehicle =>
						vehicle.type ===
						(selectedCategory === 'Two Wheeler'
							? 'two-wheeler'
							: selectedCategory.toLowerCase())
			  );

	// Sort the filtered vehicles based on the selected sort option
	const sortedVehicles = [...filteredVehicles].sort((a, b) => {
		switch (sortBy) {
			case 'name-asc':
				return a.name.localeCompare(b.name);
			case 'name-desc':
				return b.name.localeCompare(a.name);
			case 'price-asc': {
				const getPriceValue = (priceData) => {
					if (typeof priceData === 'number') return priceData;
					if (typeof priceData === 'string') {
						return parseFloat(priceData.replace(/[^\d.-]/g, '')) || 0;
					}
					return 0;
				};
				
				const priceA = getPriceValue(a.price);
				const priceB = getPriceValue(b.price);
				return priceA - priceB;
			}
			case 'price-desc': {
				const getPriceValue = (priceData) => {
					if (typeof priceData === 'number') return priceData;
					if (typeof priceData === 'string') {
						return parseFloat(priceData.replace(/[^\d.-]/g, '')) || 0;
					}
					return 0;
				};
				
				const priceA2 = getPriceValue(a.price);
				const priceB2 = getPriceValue(b.price);
				return priceB2 - priceA2;
			}
			default:
				return 0;
		}
	});

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Back Button */}
			<div className="absolute top-4 left-4 z-10">
				<BackButton />
			</div>
			
			<main className="container mx-auto px-4 py-8">
					<Motion.div
						className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.8 }}
					>
						<div className="flex justify-center space-x-2 flex-wrap">
							{categories.map(category => (
								<button
									key={category}
									className={`px-4 py-2 rounded-lg font-semibold transition-colors m-1 ${
										selectedCategory === category
											? 'bg-red-600 text-white'
											: 'bg-white text-gray-800 hover:bg-indigo-100'
									}`}
									onClick={() => setSelectedCategory(category)}
								>
									{category}
								</button>
							))}
						</div>

						<div className="flex items-center gap-3 flex-shrink-0">
							<label htmlFor="sort-select" className="text-gray-700 font-medium whitespace-nowrap">
								Sort by:
							</label>
							<select
								id="sort-select"
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-w-[180px]"
							>
								<option value="default">Default</option>
								<option value="name-asc">Name (A-Z)</option>
								<option value="name-desc">Name (Z-A)</option>
								<option value="price-asc">Price (Low to High)</option>
								<option value="price-desc">Price (High to Low)</option>
							</select>
						</div>
					</Motion.div>

					{loading ? (
						<p className="text-center text-gray-600">Loading...</p>
					) : (
						<Motion.div
							className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4, duration: 0.8 }}
						>
							{error ? (
								<p className="text-center col-span-full text-red-600">{error}</p>
							) : sortedVehicles.length > 0 ? (
								sortedVehicles.map(vehicle => (
									// The key below assumes your backend sends _id or id
									<VehicleCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
								))
							) : (
								<p className="text-center col-span-full text-gray-600">No vehicles found.</p>
							)}
						</Motion.div>
					)}
				</main>
			</div>
	);
};

export default VehicleBrowse;