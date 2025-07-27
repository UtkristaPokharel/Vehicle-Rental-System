import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import toast from "react-hot-toast";

// Pickup points data (same as in map.jsx)
const pickuppoints = {
  butwal: [
    { name: "Traffic Chowk", lat: 27.6983, lng: 83.4661 },
    { name: "Butwal Bus Park", lat: 27.694903, lng: 83.464522 },
    { name: "Lakhan Thapa Chowk", lat: 27.6856, lng: 83.4653 },
  ],
  kathmandu: [
    { name: "New Road / Indra Chowk", lat: 27.7049, lng: 85.3075 },
    { name: "Kalanki / Ring Road", lat: 27.6966, lng: 85.2914 },
    { name: "Gaushala / Tinkune", lat: 27.6951, lng: 85.3187 },
  ],
  pokhara: [
    { name: "Chipledhunga Centre", lat: 28.2068, lng: 83.9725 },
    { name: "New Road Mid", lat: 28.2096, lng: 83.9751 },
    { name: "Sabhagriha Chowk", lat: 28.2101, lng: 83.9780 },
  ],
  bhairahawa: [
    { name: "Town Center", lat: 27.5000, lng: 83.4500 },
    { name: "Highway Junction", lat: 27.5030, lng: 83.4470 },
    { name: "Main Market Area", lat: 27.4990, lng: 83.4530 },
  ],
  dang: [
    { name: "Ghorahi Bazaar", lat: 28.0500, lng: 82.4833 },
    { name: "Tulsipur Chowk", lat: 28.0170, lng: 82.5420 },
    { name: "Mahendra Hwy Crossing", lat: 28.0480, lng: 82.4900 },
  ],
};

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Get all pickup locations with city info
const getAllLocations = () => {
  const allLocations = [];
  Object.keys(pickuppoints).forEach(city => {
    pickuppoints[city].forEach(location => {
      allLocations.push({ 
        ...location, 
        city: city.charAt(0).toUpperCase() + city.slice(1),
        fullName: `${location.name}, ${city.charAt(0).toUpperCase() + city.slice(1)}`
      });
    });
  });
  return allLocations;
};

// Find the 3 nearest pickup locations
const findNearestLocations = (userLat, userLng, allLocations, count = 3) => {
  const locationsWithDistance = allLocations.map(location => ({
    ...location,
    distance: calculateDistance(userLat, userLng, location.lat, location.lng)
  }));

  // Sort by distance and return top 3
  return locationsWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
};

export const LocationPicker = ({ location, onLocationChange }) => {
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [nearestLocations, setNearestLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Initialize with default locations (Butwal)
  useEffect(() => {
    // Default to Butwal locations if no user location available
    const defaultLocations = pickuppoints.butwal.map(loc => ({
      ...loc,
      city: 'Butwal',
      fullName: `${loc.name}, Butwal`,
      distance: 0
    }));
    setNearestLocations(defaultLocations);
  }, []);

  // Function to get user location and find nearest pickup points
  const findNearestPickupLocations = () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoordinates({ lat: latitude, lng: longitude });
        
        const allLocations = getAllLocations();
        const nearest = findNearestLocations(latitude, longitude, allLocations, 3);
        
        setNearestLocations(nearest);
        
        // Auto-select the nearest location
        if (nearest.length > 0) {
          const nearestLocation = nearest[0];
          const locationData = {
            name: `${nearestLocation.city}, ${nearestLocation.name}`, // Format as "Butwal, Traffic Chowk"
            coordinates: {
              lat: nearestLocation.lat,
              lng: nearestLocation.lng
            },
            distance: nearestLocation.distance,
            city: nearestLocation.city,
            locationName: nearestLocation.name
          };
          
          setSelectedLocation(nearestLocation.fullName);
          onLocationChange(locationData);
          
          toast.success(`Found ${nearest.length} nearest pickup locations`);
        }
        
        setIsLoading(false);
      },
      (error) => {
        toast.error(`Error getting location: ${error.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    const locationData = {
      name: `${location.city}, ${location.name}`, // Format as "Butwal, Traffic Chowk"
      coordinates: {
        lat: location.lat,
        lng: location.lng
      },
      distance: location.distance,
      city: location.city,
      locationName: location.name
    };
    
    setSelectedLocation(location.fullName);
    onLocationChange(locationData);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className="font-medium text-sm text-gray-700 mb-1">
            Pickup & Drop-off Location
          </p>
          
          {/* Location Selection Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full text-left p-3 border border-gray-300 rounded-lg bg-white hover:border-blue-500 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedLocation || "Select pickup location"}
                  </span>
                  {nearestLocations.length > 0 && selectedLocation && (
                    <div className="text-xs text-gray-500 mt-1">
                      {nearestLocations.findIndex(loc => loc.fullName === selectedLocation) === 0 && 'Nearest location'}
                      {nearestLocations.findIndex(loc => loc.fullName === selectedLocation) === 1 && '2nd nearest location'}
                      {nearestLocations.findIndex(loc => loc.fullName === selectedLocation) > 1 && 'Available location'}
                    </div>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {nearestLocations.length > 0 ? (
                  nearestLocations.map((location, index) => (
                    <button
                      key={`${location.city}-${location.name}-${index}`}
                      onClick={() => handleLocationSelect(location)}
                      className="w-full text-left p-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {location.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {location.city}
                          </div>
                        </div>
                        <div className="text-right">
                          {index === 0 && nearestLocations.length > 1 && (
                            <div className="text-xs text-green-600 font-medium">
                              Nearest
                            </div>
                          )}
                          {index === 1 && nearestLocations.length > 1 && (
                            <div className="text-xs text-blue-600 font-medium">
                              2nd Nearest
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-gray-500 text-sm text-center">
                    No pickup locations available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Find Nearest Button */}
        <button 
          className="ml-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          onClick={findNearestPickupLocations}
          disabled={isLoading}
          title="Find nearest pickup locations"
        >
          {isLoading ? (
            <FaSpinner className="text-sm animate-spin" />
          ) : (
            <FaMapMarkerAlt className="text-sm" />
          )}
        </button>
      </div>

      {/* Info Text */}
      {nearestLocations.length > 0 && (
        <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
          <FaMapMarkerAlt className="inline mr-1" />
          {userCoordinates 
            ? `Showing ${nearestLocations.length} nearest pickup locations based on your current location.`
            : `Showing default pickup locations. Click the location button to find nearest locations.`
          }
        </div>
      )}
    </div>
  );
};
