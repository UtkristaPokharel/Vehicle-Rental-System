import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FavoriteVehicleCard from '../components/FavoriteVehicleCard';
import BackButton from '../components/BackButton';
import { getApiUrl } from '../config/api';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    
    if (!token) {
      setError("Please login to view your favorites");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl('api/favorites'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch favorites');
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Unable to load favorites. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to remove a favorite and refresh the list
  const handleRemoveFavorite = async (vehicleId) => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    
    if (!token) {
      setError("Please login to manage favorites");
      return;
    }

    try {
      const response = await fetch(getApiUrl(`api/favorites/remove/${vehicleId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the vehicle from the local state immediately for better UX
        setFavorites(prevFavorites => prevFavorites.filter(vehicle => vehicle._id !== vehicleId));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to remove favorite');
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Unable to remove favorite. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <BackButton 
              to="/" 
              variant="minimal" 
              className="text-white hover:text-white" 
              showText={false}
            />
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Simple Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BackButton variant="minimal" showText={false} />
            <FaHeart className="text-red-500 text-xl" />
            <h1 className="text-2xl font-bold text-gray-800">My Favorites</h1>
            {favorites.length > 0 && (
              <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full">
                {favorites.length}
              </span>
            )}
          </div>
        </div>

        {/* Favorites Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
            <p className="text-gray-500 mb-6">Start adding vehicles to your favorites</p>
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaHeart />
              Browse Vehicles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((vehicle, index) => (
              <FavoriteVehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                index={index}
                onRemoveFavorite={handleRemoveFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
