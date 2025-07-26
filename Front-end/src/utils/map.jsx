import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

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

// Find the nearest pickup point to user's location
const findNearestLocation = (userLat, userLng, allLocations) => {
  console.log('Finding nearest location from user position:', { lat: userLat, lng: userLng });
  
  let nearest = null;
  let minDistance = Infinity;

  allLocations.forEach(location => {
    const distance = calculateDistance(userLat, userLng, location.lat, location.lng);
    console.log(`Distance to ${location.name} in ${location.city}: ${distance.toFixed(2)} km`);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...location, distance };
      console.log(`New nearest location: ${location.name} (${distance.toFixed(2)} km)`);
    }
  });

  console.log('Final nearest location:', nearest);
  return nearest;
};

// Flatten all pickup points into a single array
const getAllLocations = () => {
  const allLocations = [];
  Object.keys(pickuppoints).forEach(city => {
    pickuppoints[city].forEach(location => {
      allLocations.push({ ...location, city });
    });
  });
  return allLocations;
};

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestLocation, setNearestLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allLocations] = useState(getAllLocations());

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
  });

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        setUserLocation({
          lat: userLat,
          lng: userLng
        });

        // Find nearest pickup location
        const nearest = findNearestLocation(userLat, userLng, allLocations);
        setNearestLocation(nearest);
        
        // Console log the nearest pickup location
        if (nearest) {
          console.log('=== NEAREST PICKUP LOCATION FOUND ===');
          console.log('User Location:', { lat: userLat, lng: userLng });
          console.log('Nearest Pickup Point:', {
            name: nearest.name,
            city: nearest.city,
            coordinates: { lat: nearest.lat, lng: nearest.lng },
            distance: `${nearest.distance.toFixed(2)} km`
          });
          console.log('All distances calculated:', 
            allLocations.map(loc => ({
              name: loc.name,
              city: loc.city,
              distance: calculateDistance(userLat, userLng, loc.lat, loc.lng).toFixed(2) + ' km'
            })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
          );
          console.log('=====================================');
        }
        
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError(`Unable to get your location: ${error.message}`);
        setLoading(false);
        
        // Set default location (Kathmandu center) if geolocation fails
        setUserLocation({
          lat: 27.7172,
          lng: 85.3240
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [allLocations]);

  useEffect(() => {
    if (isLoaded) {
      getUserLocation();
    }
  }, [isLoaded, getUserLocation]);

  // Map container style
  const containerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  // Map options
  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
  };

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Center map on user location when it's available
  const center = userLocation || { lat: 27.7172, lng: 85.3240 }; // Default to Kathmandu

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-1">Map Loading Error</h3>
          <p className="text-red-600">Failed to load Google Maps. Please check your API key.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-blue-800 mb-1">Loading Map</h3>
          <p className="text-blue-600">
            {loading ? 'Getting your location...' : 'Loading Google Maps...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pickup Locations Near You</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Nearest Pickup Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Other Pickup Points</span>
          </div>
        </div>
        
        {error && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">⚠️ {error}</p>
          </div>
        )}
        
        {nearestLocation && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              📍 Nearest pickup point: <strong>{nearestLocation.name}</strong> in {nearestLocation.city}
              {nearestLocation.distance && (
                <span> ({nearestLocation.distance.toFixed(2)} km away)</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={userLocation ? 13 : 7}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {/* User Location Marker (Blue) */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" stroke-width="3"/>
                    <circle cx="20" cy="20" r="8" fill="white"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 20),
              }}
              onClick={() => setSelectedMarker({ type: 'user', location: userLocation })}
            />
          )}

          {/* Pickup Location Markers */}
          {allLocations.map((location, index) => {
            const isNearest = nearestLocation && 
              location.lat === nearestLocation.lat && 
              location.lng === nearestLocation.lng;
            
            return (
              <Marker
                key={`${location.city}-${index}`}
                position={{ lat: location.lat, lng: location.lng }}
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 2C10.5 2 6 6.5 6 12c0 8 10 18 10 18s10-10 10-18c0-5.5-4.5-10-10-10z" 
                            fill="${isNearest ? '#10B981' : '#EF4444'}" 
                            stroke="white" 
                            stroke-width="2"/>
                      <circle cx="16" cy="12" r="4" fill="white"/>
                    </svg>
                  `),
                  scaledSize: new window.google.maps.Size(32, 32),
                  anchor: new window.google.maps.Point(16, 32),
                }}
                onClick={() => setSelectedMarker({ type: 'pickup', location })}
              />
            );
          })}

          {/* Info Window */}
          {selectedMarker && (
            <InfoWindow
              position={
                selectedMarker.type === 'user' 
                  ? selectedMarker.location 
                  : { lat: selectedMarker.location.lat, lng: selectedMarker.location.lng }
              }
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2">
                {selectedMarker.type === 'user' ? (
                  <div>
                    <h3 className="font-semibold text-blue-800">📍 Your Location</h3>
                    <p className="text-sm text-gray-600">Current position</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {selectedMarker.location.name}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      📍 {selectedMarker.location.city}
                    </p>
                    {nearestLocation && 
                     selectedMarker.location.lat === nearestLocation.lat && 
                     selectedMarker.location.lng === nearestLocation.lng && (
                      <p className="text-xs text-green-600 mt-1">
                        ⭐ Nearest to you ({nearestLocation.distance?.toFixed(2)} km)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Location List */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">All Pickup Locations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(pickuppoints).map(city => (
            <div key={city} className="border rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 capitalize mb-2">{city}</h4>
              <ul className="space-y-1">
                {pickuppoints[city].map((location, index) => {
                  const isNearest = nearestLocation && 
                    location.lat === nearestLocation.lat && 
                    location.lng === nearestLocation.lng;
                  
                  return (
                    <li 
                      key={index} 
                      className={`text-sm p-2 rounded cursor-pointer transition-colors ${
                        isNearest 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        if (map) {
                          map.panTo({ lat: location.lat, lng: location.lng });
                          map.setZoom(15);
                          setSelectedMarker({ type: 'pickup', location: { ...location, city } });
                        }
                      }}
                    >
                      {isNearest && '⭐ '}
                      {location.name}
                      {userLocation && (
                        <span className="block text-xs opacity-75">
                          {calculateDistance(
                            userLocation.lat, 
                            userLocation.lng, 
                            location.lat, 
                            location.lng
                          ).toFixed(2)} km away
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <button
          onClick={getUserLocation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Refresh My Location
        </button>
      </div>
    </div>
  );
};

export default MapComponent;