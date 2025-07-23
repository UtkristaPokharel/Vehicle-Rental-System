import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { FaHeart, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CompactFavoriteCard from './CompactFavoriteCard';
import { getApiUrl } from '../config/api';

const FavoritesList = ({ limit = 5, showHeader = true, className = "" }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      
      if (!token) {
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
          setFavorites(data.slice(0, limit)); // Limit the results
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch favorites');
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Unable to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [limit]);

  const handleRemoveFavorite = async (vehicleId) => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    
    if (!token) return;

    try {
      const response = await fetch(getApiUrl(`api/favorites/remove/${vehicleId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFavorites(prevFavorites => prevFavorites.filter(vehicle => vehicle._id !== vehicleId));
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        {showHeader && (
          <div className="flex items-center gap-2 mb-4">
            <FaHeart className="text-red-500" />
            <h3 className="font-semibold text-gray-800">Your Favorites</h3>
          </div>
        )}
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-gray-400 text-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        {showHeader && (
          <div className="flex items-center gap-2 mb-4">
            <FaHeart className="text-red-500" />
            <h3 className="font-semibold text-gray-800">Your Favorites</h3>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-500 py-4">
          <FaExclamationCircle />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    
    return (
      <div className={`${className}`}>
        {showHeader && (
          <div className="flex items-center gap-2 mb-4">
            <FaHeart className="text-red-500" />
            <h3 className="font-semibold text-gray-800">Your Favorites</h3>
          </div>
        )}
        
        <div className="text-center py-6">
          {!token ? (
            <>
              <div className="text-4xl mb-3">🔒</div>
              <p className="text-gray-500 text-sm mb-3">Login to see your favorites</p>
              <Link
                to="/login"
                className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Login Now
              </Link>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">💔</div>
              <p className="text-gray-500 text-sm mb-3">No favorites yet</p>
              <Link
                to="/vehicles"
                className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                Browse Vehicles
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaHeart className="text-red-500" />
            <h3 className="font-semibold text-gray-800">Your Favorites</h3>
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
              {favorites.length}
            </span>
          </div>
          
          <Link
            to="/favorites"
            className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
          >
            View All
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {favorites.map((vehicle, index) => (
          <Motion.div
            key={vehicle._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CompactFavoriteCard
              vehicle={vehicle}
              onRemove={handleRemoveFavorite}
            />
          </Motion.div>
        ))}
      </div>

      {favorites.length >= limit && (
        <div className="mt-4 text-center">
          <Link
            to="/favorites"
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
          >
            <FaHeart className="text-xs" />
            View All Favorites
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
