import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different markers
const createCustomIcon = (color, size = 'normal') => {
  const iconUrls = {
    red: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    blue: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    green: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    orange: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    yellow: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    violet: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  };

  const sizes = {
    normal: [25, 41],
    large: [35, 57]
  };

  return new L.Icon({
    iconUrl: iconUrls[color] || iconUrls.red,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: sizes[size],
    iconAnchor: size === 'large' ? [17, 57] : [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Component to handle map updates
const MapUpdater = ({ userLocation, pickupPoints, selectedPickup }) => {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation && pickupPoints.length > 0) {
      const bounds = L.latLngBounds([
        [userLocation.lat, userLocation.lng],
        ...pickupPoints.map(point => [point.lat, point.lng])
      ]);
      map.fitBounds(bounds, { padding: [30, 30] });
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 15);
    }
  }, [userLocation, pickupPoints, selectedPickup, map]);
  
  return null;
};

const PickupPointMapFixed = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showDistanceLines, setShowDistanceLines] = useState(true);
  const [showUserRadius, setShowUserRadius] = useState(true);
  const [radiusKm, setRadiusKm] = useState(5);
  const [debugInfo, setDebugInfo] = useState([]);

  // Current user info
  const currentUser = 'bhuwan214';
  const currentDateTime = '2025-07-21 16:48:59';

  // Add debug log function
  const addDebugLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[Geolocation Debug] ${message}`);
  };

  // Check geolocation support on component mount
  useEffect(() => {
    addDebugLog('Component mounted, checking geolocation support...');
    
    if (!navigator.geolocation) {
      addDebugLog('❌ Geolocation is not supported by this browser');
      setLocationError('Geolocation is not supported by this browser.');
    } else {
      addDebugLog('✅ Geolocation is supported');
      
      // Check if we're on HTTPS or localhost
      const isSecure = window.location.protocol === 'https:' || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
      
      if (!isSecure) {
        addDebugLog('⚠️ Warning: Not on HTTPS/localhost - geolocation may be blocked');
      } else {
        addDebugLog('✅ Secure context detected');
      }

      // Check permissions API if available
      if ('permissions' in navigator) {
        navigator.permissions.query({name:'geolocation'}).then(function(result) {
          addDebugLog(`📋 Geolocation permission status: ${result.state}`);
          if (result.state === 'denied') {
            setLocationError('Location access was previously denied. Please enable it in your browser settings.');
          }
        }).catch(err => {
          addDebugLog(`❌ Error checking permissions: ${err.message}`);
        });
      }
    }
  }, []);

  // Define pickup points near user location
  const getPickupPoints = (userLat, userLng) => [
    {
      id: 1,
      name: "Central Pickup Hub",
      address: "Main Street Plaza, Downtown",
      lat: userLat + 0.01,
      lng: userLng + 0.005,
      services: ["Car Rental", "Bike Rental", "Package Pickup"],
      hours: "24/7",
      phone: "+977-1-4567890",
      type: "main",
      facilities: ["Parking", "Waiting Area", "Restroom", "Coffee Shop"]
    },
    {
      id: 2,
      name: "Airport Express Point",
      address: "Near International Airport",
      lat: userLat - 0.015,
      lng: userLng + 0.02,
      services: ["Airport Transfer", "Luggage Storage", "Express Delivery"],
      hours: "5:00 AM - 11:00 PM",
      phone: "+977-1-4567891",
      type: "express",
      facilities: ["Parking", "Security", "Free WiFi"]
    },
    {
      id: 3,
      name: "Shopping District Hub",
      address: "Commercial Complex, Mall Area",
      lat: userLat + 0.008,
      lng: userLng - 0.012,
      services: ["Shopping Pickup", "Food Delivery", "Local Transport"],
      hours: "6:00 AM - 10:00 PM",
      phone: "+977-1-4567892",
      type: "commercial",
      facilities: ["Shopping Mall", "Food Court", "ATM", "Parking"]
    }
  ];

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Calculate pickup points with distances
  const pickupPointsWithDistance = useMemo(() => {
    if (!userLocation) return [];
    
    const points = getPickupPoints(userLocation.lat, userLocation.lng);
    return points.map(point => ({
      ...point,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        point.lat,
        point.lng
      ),
      estimatedWalkTime: Math.ceil(calculateDistance(
        userLocation.lat,
        userLocation.lng,
        point.lat,
        point.lng
      ) * 12),
      estimatedDriveTime: Math.ceil(calculateDistance(
        userLocation.lat,
        userLocation.lng,
        point.lat,
        point.lng
      ) * 2)
    }))
    .sort((a, b) => a.distance - b.distance);
  }, [userLocation]);

  const closestPickup = pickupPointsWithDistance.length > 0 ? pickupPointsWithDistance[0] : null;

  // Enhanced getUserLocation function
  const getUserLocation = async () => {
    addDebugLog('🔄 User clicked location button');
    setIsLoadingLocation(true);
    setLocationError(null);
    setDebugInfo([]); // Clear previous debug info

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const error = "❌ Geolocation is not supported by this browser.";
      addDebugLog(error);
      setLocationError(error);
      setIsLoadingLocation(false);
      return;
    }

    addDebugLog('📍 Requesting geolocation...');

    // Create a promise wrapper for getCurrentPosition
    const getCurrentPosition = () => {
      return new Promise((resolve, reject) => {
        const options = {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout to 15 seconds
          maximumAge: 30000 // Cache for 30 seconds
        };

        addDebugLog(`⚙️ Geolocation options: ${JSON.stringify(options)}`);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            addDebugLog(`✅ Location obtained successfully`);
            addDebugLog(`📍 Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`);
            addDebugLog(`🎯 Accuracy: ${position.coords.accuracy} meters`);
            resolve(position);
          },
          (error) => {
            addDebugLog(`❌ Geolocation error: ${error.message} (Code: ${error.code})`);
            reject(error);
          },
          options
        );
      });
    };

    try {
      const position = await getCurrentPosition();
      
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      setUserLocation(location);
      addDebugLog(`🎉 Location set successfully: ${location.lat}, ${location.lng}`);
      setIsLoadingLocation(false);
      setLocationError(null);

    } catch (error) {
      let errorMessage = "Unable to retrieve your location.";
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "❌ Location access denied. Please allow location access and try again.";
          addDebugLog("❌ User denied location permission");
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "❌ Location information is unavailable. Please check your GPS/network.";
          addDebugLog("❌ Position unavailable");
          break;
        case error.TIMEOUT:
          errorMessage = "❌ Location request timed out. Please try again.";
          addDebugLog("❌ Location request timeout");
          break;
        default:
          errorMessage = `❌ An unknown error occurred: ${error.message}`;
          addDebugLog(`❌ Unknown error: ${error.message}`);
          break;
      }
      
      setLocationError(errorMessage);
      setIsLoadingLocation(false);
      
      // For demo purposes, set a fallback location
      addDebugLog('🔄 Using fallback location (Kathmandu) for demo');
      setTimeout(() => {
        setUserLocation({ lat: 27.7172, lng: 85.3240 });
        addDebugLog('📍 Fallback location set');
      }, 2000);
    }
  };

  // Try to get location automatically on mount (optional)
  useEffect(() => {
    addDebugLog('🚀 Auto-requesting location on component mount...');
    // Uncomment the line below if you want automatic location detection
    // getUserLocation();
  }, []);

  // Get pickup point icon color
  const getPickupIconColor = (pickup) => {
    if (selectedPickup?.id === pickup.id) return 'red';
    if (pickup.id === closestPickup?.id) return 'green';
    
    switch (pickup.type) {
      case 'main': return 'blue';
      case 'express': return 'orange';
      case 'commercial': return 'violet';
      default: return 'yellow';
    }
  };

  const handlePickupSelect = (pickup) => {
    setSelectedPickup(pickup);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Header Controls */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px 8px 0 0',
        borderBottom: '2px solid #dee2e6'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📍 Pickup Point Locator (Debug Mode)
          </h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              👤 User: <strong>{currentUser}</strong>
            </span>
            <span style={{ fontSize: '14px', color: '#666' }}>
              🕒 {currentDateTime} UTC
            </span>
          </div>
        </div>

        {/* Browser/Security Info */}
        <div style={{
          backgroundColor: '#d1ecf1',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px',
          border: '1px solid #bee5eb'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#0c5460' }}>
            🔒 Location Requirements:
          </h4>
          <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#0c5460' }}>
            <li>✅ Must be on HTTPS or localhost</li>
            <li>✅ Browser must support geolocation</li>
            <li>⚠️ You need to click "Allow" when prompted</li>
            <li>⚠️ Location services must be enabled on your device</li>
          </ul>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#0c5460' }}>
            Current: {window.location.protocol}//{window.location.host} 
            {(window.location.protocol === 'https:' || window.location.hostname === 'localhost') ? ' ✅' : ' ❌'}
          </p>
        </div>

        {/* Location Access Button */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={getUserLocation}
            disabled={isLoadingLocation}
            style={{
              padding: '12px 24px',
              backgroundColor: isLoadingLocation ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoadingLocation ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isLoadingLocation ? (
              <>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid #f3f3f3',
                  borderTop: '2px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Getting Your Location...
              </>
            ) : (
              <>
                📍 Access My Location
              </>
            )}
          </button>
          
          {locationError && (
            <div style={{ 
              marginTop: '8px', 
              padding: '8px 12px', 
              backgroundColor: '#f8d7da', 
              color: '#721c24', 
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {locationError}
            </div>
          )}
        </div>

        {/* Debug Information */}
        {debugInfo.length > 0 && (
          <div style={{
            backgroundColor: '#f1f3f4',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            <h5 style={{ margin: '0 0 8px 0', color: '#333' }}>
              🐛 Debug Information:
            </h5>
            <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
              {debugInfo.map((log, index) => (
                <div key={index} style={{ marginBottom: '2px', color: '#555' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map Controls */}
        {userLocation && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', display: 'block' }}>
                  📏 Search Radius
                </label>
                <select 
                  value={radiusKm} 
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value={2}>2 km radius</option>
                  <option value={5}>5 km radius</option>
                  <option value={10}>10 km radius</option>
                  <option value={15}>15 km radius</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>🎛️ Display Options</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input 
                      type="checkbox" 
                      checked={showDistanceLines} 
                      onChange={(e) => setShowDistanceLines(e.target.checked)}
                    />
                    Distance Lines
                  </label>
                  <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input 
                      type="checkbox" 
                      checked={showUserRadius} 
                      onChange={(e) => setShowUserRadius(e.target.checked)}
                    />
                    Search Area
                  </label>
                </div>
              </div>
            </div>

            {/* Pickup Points Summary */}
            {pickupPointsWithDistance.length > 0 && (
              <div style={{
                backgroundColor: '#e8f5e8',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #28a745'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#155724' }}>
                  🎯 Recommended Pickup Point
                </h4>
                <div style={{ fontSize: '14px', color: '#155724' }}>
                  <strong>📍 {closestPickup.name}</strong> - {closestPickup.distance.toFixed(2)} km away
                  <br />
                  🚶 Walk: ~{closestPickup.estimatedWalkTime} min | 🚗 Drive: ~{closestPickup.estimatedDriveTime} min
                  <br />
                  📍 {closestPickup.address}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Map Container */}
      {userLocation ? (
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={14}
          style={{ height: '600px', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater 
            userLocation={userLocation} 
            pickupPoints={pickupPointsWithDistance}
            selectedPickup={selectedPickup}
          />

          {/* User Location Marker */}
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={createCustomIcon('blue', 'large')}
          >
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '250px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>
                  📍 Your Current Location
                </h4>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  👤 User: <strong>{currentUser}</strong>
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  🌐 Coordinates: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  📏 Search radius: {radiusKm} km
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  📍 Pickup points found: {pickupPointsWithDistance.length}
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                  🕒 {currentDateTime} UTC
                </p>
              </div>
            </Popup>
          </Marker>

          {/* User Location Radius Circle */}
          {showUserRadius && (
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={radiusKm * 1000}
              pathOptions={{
                color: '#007bff',
                fillColor: '#007bff',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '10, 10'
              }}
            />
          )}

          {/* Pickup Point Markers */}
          {pickupPointsWithDistance.map((pickup, index) => (
            <Marker
              key={pickup.id}
              position={[pickup.lat, pickup.lng]}
              icon={createCustomIcon(getPickupIconColor(pickup))}
            >
              <Popup maxWidth={350}>
                <div style={{ minWidth: '320px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                    <h4 style={{ 
                      margin: '0 0 4px 0',
                      color: pickup.id === closestPickup?.id ? '#28a745' : '#333'
                    }}>
                      {pickup.id === closestPickup?.id ? '🏆' : '📍'} {pickup.name}
                      {pickup.id === closestPickup?.id && (
                        <span style={{ 
                          fontSize: '12px', 
                          backgroundColor: '#28a745', 
                          color: 'white', 
                          padding: '2px 6px', 
                          borderRadius: '10px',
                          marginLeft: '8px'
                        }}>
                          CLOSEST
                        </span>
                      )}
                    </h4>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                      #{index + 1} • {pickup.type.charAt(0).toUpperCase() + pickup.type.slice(1)} Hub
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>📍 Address:</strong> {pickup.address}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>📏 Distance:</strong> {pickup.distance.toFixed(2)} km from you
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>🚶 Walk Time:</strong> ~{pickup.estimatedWalkTime} minutes
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>🚗 Drive Time:</strong> ~{pickup.estimatedDriveTime} minutes
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>📞 Phone:</strong> {pickup.phone}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>🕒 Hours:</strong> {pickup.hours}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handlePickupSelect(pickup)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: selectedPickup?.id === pickup.id ? '#28a745' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      {selectedPickup?.id === pickup.id ? '✅ Selected' : '📍 Select This Point'}
                    </button>
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${pickup.lat},${pickup.lng}`;
                        window.open(url, '_blank');
                      }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      🗺️ Directions
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Distance Lines */}
          {showDistanceLines && userLocation && pickupPointsWithDistance.map((pickup) => (
            <Polyline
              key={`line-${pickup.id}`}
              positions={[
                [userLocation.lat, userLocation.lng],
                [pickup.lat, pickup.lng]
              ]}
              pathOptions={{
                color: pickup.id === closestPickup?.id ? '#28a745' : 
                       selectedPickup?.id === pickup.id ? '#dc3545' : '#6c757d',
                weight: pickup.id === closestPickup?.id ? 4 : 
                        selectedPickup?.id === pickup.id ? 4 : 2,
                opacity: pickup.id === closestPickup?.id ? 0.8 : 
                         selectedPickup?.id === pickup.id ? 0.8 : 0.5,
                dashArray: pickup.id === closestPickup?.id ? '0' : '10, 10'
              }}
            />
          ))}
        </MapContainer>
      ) : (
        <div style={{ 
          height: '600px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#666', margin: '0 0 12px 0' }}>📍 Location Access Required</h3>
            <p style={{ color: '#666', margin: '0 0 20px 0' }}>
              Click "Access My Location" to find nearby pickup points
            </p>
            <button
              onClick={getUserLocation}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              📍 Get My Location
            </button>
            
            {/* Manual Location Input (Fallback) */}
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#fff3cd', borderRadius: '6px' }}>
              <h4 style={{ margin: '0 0 8px 0' }}>🔧 Having trouble? Try demo location:</h4>
              <button
                onClick={() => {
                  setUserLocation({ lat: 27.7172, lng: 85.3240 });
                  addDebugLog('📍 Demo location (Kathmandu) set manually');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffc107',
                  color: '#212529',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🏔️ Use Kathmandu (Demo)
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PickupPointMapFixed;