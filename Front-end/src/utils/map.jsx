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

// Car icon for pickup points
const createCarIcon = (color = 'blue') => {
  return L.divIcon({
    className: 'custom-car-icon',
    html: `<div style="
      background-color: ${color === 'green' ? '#28a745' : color === 'red' ? '#dc3545' : color === 'orange' ? '#fd7e14' : '#007bff'};
      color: white;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">🚗</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Component to handle map updates
const MapUpdater = ({ userLocation, selectedCity, nearestPickup }) => {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation && selectedCity) {
      // Fit bounds to include user location and selected city
      const bounds = L.latLngBounds([
        [userLocation.lat, userLocation.lng],
        [selectedCity.lat, selectedCity.lng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 8);
    } else {
      // Default view of Nepal
      map.setView([28.3949, 84.1240], 7);
    }
  }, [userLocation, selectedCity, nearestPickup, map]);
  
  return null;
};

const NepalPickupMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showDistanceLines, setShowDistanceLines] = useState(true);
  const [showUserRadius, setShowUserRadius] = useState(false);
  const [radiusKm, setRadiusKm] = useState(50);
  const [filterByCity, setFilterByCity] = useState('all');

  // Current user info from provided data
  const currentUser = 'bhuwan214';
  const currentDateTime = '2025-07-22 04:37:45';

  // Major cities in Nepal with their pickup points
  const nepalCities = [
    {
      id: 1,
      name: 'Kathmandu',
      lat: 27.7172,
      lng: 85.3240,
      province: 'Bagmati',
      population: '1.5M',
      pickupPoints: [
        {
          id: 101,
          name: 'Tribhuvan International Airport Hub',
          address: 'TIA Airport Road, Kathmandu',
          lat: 27.6966,
          lng: 85.3591,
          type: 'airport',
          vehicles: ['Sedan', 'SUV', 'Luxury', 'Van'],
          hours: '24/7',
          phone: '+977-1-4441234',
          facilities: ['Parking', 'Waiting Lounge', 'ATM', 'Cafe']
        },
        {
          id: 102,
          name: 'Thamel Tourist Hub',
          address: 'Thamel Chowk, Kathmandu',
          lat: 27.7149,
          lng: 85.3147,
          type: 'tourist',
          vehicles: ['Hatchback', 'Sedan', 'Motorcycle'],
          hours: '6:00 AM - 11:00 PM',
          phone: '+977-1-4441235',
          facilities: ['Tourist Info', 'WiFi', 'Restaurant', 'Shop']
        },
        {
          id: 103,
          name: 'New Baneshwor Business Center',
          address: 'New Baneshwor, Kathmandu',
          lat: 27.6954,
          lng: 85.3438,
          type: 'business',
          vehicles: ['Sedan', 'SUV', 'Electric'],
          hours: '7:00 AM - 10:00 PM',
          phone: '+977-1-4441236',
          facilities: ['Office Space', 'Meeting Rooms', 'Parking']
        },
        {
          id: 104,
          name: 'Ratna Park Central',
          address: 'Ratna Park, Kathmandu',
          lat: 27.7040,
          lng: 85.3100,
          type: 'central',
          vehicles: ['All Types'],
          hours: '5:00 AM - 12:00 AM',
          phone: '+977-1-4441237',
          facilities: ['Large Parking', 'Food Court', 'Shopping']
        },
        {
          id: 105,
          name: 'Patan Durbar Square',
          address: 'Patan Durbar Square, Lalitpur',
          lat: 27.6734,
          lng: 85.3260,
          type: 'heritage',
          vehicles: ['Sedan', 'Hatchback', 'Electric'],
          hours: '6:00 AM - 9:00 PM',
          phone: '+977-1-4441238',
          facilities: ['Heritage Site', 'Museum', 'Cultural Center']
        }
      ]
    },
    {
      id: 2,
      name: 'Pokhara',
      lat: 28.2096,
      lng: 83.9856,
      province: 'Gandaki',
      population: '518K',
      pickupPoints: [
        {
          id: 201,
          name: 'Pokhara Airport Terminal',
          address: 'Pokhara Regional Airport',
          lat: 28.2009,
          lng: 83.9821,
          type: 'airport',
          vehicles: ['Sedan', 'SUV', 'Van'],
          hours: '5:00 AM - 11:00 PM',
          phone: '+977-61-441234',
          facilities: ['Airport Lounge', 'Parking', 'Rental Office']
        },
        {
          id: 202,
          name: 'Lakeside Tourist Area',
          address: 'Lakeside, Pokhara',
          lat: 28.2090,
          lng: 83.9550,
          type: 'tourist',
          vehicles: ['Hatchback', 'Sedan', 'Motorcycle', 'Bicycle'],
          hours: '6:00 AM - 10:00 PM',
          phone: '+977-61-441235',
          facilities: ['Lake View', 'Restaurants', 'Hotels', 'Boat Rental']
        },
        {
          id: 203,
          name: 'Mahendrapul Bus Park',
          address: 'Mahendrapul, Pokhara',
          lat: 28.2380,
          lng: 83.9956,
          type: 'transport',
          vehicles: ['All Types'],
          hours: '4:00 AM - 11:00 PM',
          phone: '+977-61-441236',
          facilities: ['Bus Station', 'Parking', 'Food Stalls']
        },
        {
          id: 204,
          name: 'World Peace Pagoda Point',
          address: 'Near World Peace Pagoda',
          lat: 28.1945,
          lng: 83.9402,
          type: 'scenic',
          vehicles: ['SUV', 'Van', 'Motorcycle'],
          hours: '6:00 AM - 8:00 PM',
          phone: '+977-61-441237',
          facilities: ['Scenic View', 'Hiking Trail', 'Photography Spot']
        },
        {
          id: 205,
          name: 'New Road Commercial Hub',
          address: 'New Road, Pokhara',
          lat: 28.2135,
          lng: 83.9785,
          type: 'commercial',
          vehicles: ['Sedan', 'Hatchback', 'Electric'],
          hours: '7:00 AM - 9:00 PM',
          phone: '+977-61-441238',
          facilities: ['Shopping', 'Banking', 'Restaurants']
        }
      ]
    },
    {
      id: 3,
      name: 'Butwal',
      lat: 27.7006,
      lng: 83.4487,
      province: 'Lumbini',
      population: '195K',
      pickupPoints: [
        {
          id: 301,
          name: 'Butwal Bus Terminal',
          address: 'Main Bus Terminal, Butwal',
          lat: 27.6965,
          lng: 83.4462,
          type: 'transport',
          vehicles: ['All Types'],
          hours: '4:00 AM - 11:00 PM',
          phone: '+977-71-441234',
          facilities: ['Bus Terminal', 'Parking', 'Waiting Area']
        },
        {
          id: 302,
          name: 'Traffic Chowk Commercial',
          address: 'Traffic Chowk, Butwal',
          lat: 27.7058,
          lng: 83.4538,
          type: 'commercial',
          vehicles: ['Sedan', 'Hatchback', 'SUV'],
          hours: '6:00 AM - 10:00 PM',
          phone: '+977-71-441235',
          facilities: ['Shopping Center', 'Banks', 'Restaurants']
        },
        {
          id: 303,
          name: 'Medical College Area',
          address: 'Near Medical College, Butwal',
          lat: 27.6892,
          lng: 83.4623,
          type: 'medical',
          vehicles: ['Sedan', 'SUV', 'Ambulance'],
          hours: '24/7',
          phone: '+977-71-441236',
          facilities: ['Hospital', 'Emergency Service', 'Pharmacy']
        },
        {
          id: 304,
          name: 'Kalika Mandir Point',
          address: 'Kalika Temple Area, Butwal',
          lat: 27.7134,
          lng: 83.4398,
          type: 'religious',
          vehicles: ['Hatchback', 'Sedan', 'Van'],
          hours: '5:00 AM - 9:00 PM',
          phone: '+977-71-441237',
          facilities: ['Temple', 'Parking', 'Religious Center']
        },
        {
          id: 305,
          name: 'Industrial Area Hub',
          address: 'Industrial Area, Butwal',
          lat: 27.6823,
          lng: 83.4721,
          type: 'industrial',
          vehicles: ['Truck', 'Van', 'SUV'],
          hours: '6:00 AM - 8:00 PM',
          phone: '+977-71-441238',
          facilities: ['Cargo Service', 'Warehouse', 'Loading Bay']
        }
      ]
    },
    {
      id: 4,
      name: 'Narayanghat',
      lat: 27.7033,
      lng: 84.4308,
      province: 'Bagmati',
      population: '154K',
      pickupPoints: [
        {
          id: 401,
          name: 'Narayanghat Bus Park',
          address: 'Central Bus Park, Narayanghat',
          lat: 27.7089,
          lng: 84.4285,
          type: 'transport',
          vehicles: ['All Types'],
          hours: '4:00 AM - 11:30 PM',
          phone: '+977-56-441234',
          facilities: ['Bus Terminal', 'Ticket Counter', 'Food Court']
        },
        {
          id: 402,
          name: 'Sahid Chowk Central',
          address: 'Sahid Chowk, Narayanghat',
          lat: 27.7045,
          lng: 84.4325,
          type: 'central',
          vehicles: ['Sedan', 'Hatchback', 'SUV', 'Motorcycle'],
          hours: '5:00 AM - 11:00 PM',
          phone: '+977-56-441235',
          facilities: ['Central Location', 'Shopping', 'Banks']
        },
        {
          id: 403,
          name: 'Chitwan Medical College',
          address: 'CMC Campus, Bharatpur',
          lat: 27.6798,
          lng: 84.4156,
          type: 'medical',
          vehicles: ['Sedan', 'SUV', 'Ambulance'],
          hours: '24/7',
          phone: '+977-56-441236',
          facilities: ['Medical College', 'Hospital', 'Emergency']
        },
        {
          id: 404,
          name: 'Chitwan National Park Entry',
          address: 'Park Entry Gate, Sauraha',
          lat: 27.5788,
          lng: 84.5060,
          type: 'tourist',
          vehicles: ['SUV', 'Van', 'Jeep'],
          hours: '6:00 AM - 6:00 PM',
          phone: '+977-56-441237',
          facilities: ['National Park', 'Wildlife Tours', 'Safari']
        },
        {
          id: 405,
          name: 'Bharatpur Airport Area',
          address: 'Near Bharatpur Airport',
          lat: 27.6781,
          lng: 84.4298,
          type: 'airport',
          vehicles: ['Sedan', 'SUV', 'Van'],
          hours: '5:00 AM - 10:00 PM',
          phone: '+977-56-441238',
          facilities: ['Airport Access', 'Parking', 'Travel Services']
        }
      ]
    },
    {
      id: 5,
      name: 'Biratnagar',
      lat: 26.4525,
      lng: 87.2718,
      province: 'Koshi',
      population: '244K',
      pickupPoints: [
        {
          id: 501,
          name: 'Biratnagar Airport Terminal',
          address: 'Biratnagar Airport',
          lat: 26.4815,
          lng: 87.2640,
          type: 'airport',
          vehicles: ['Sedan', 'SUV', 'Van'],
          hours: '5:00 AM - 10:00 PM',
          phone: '+977-21-441234',
          facilities: ['Airport Terminal', 'Parking', 'Cargo']
        },
        {
          id: 502,
          name: 'Main Road Commercial',
          address: 'Main Road, Biratnagar',
          lat: 26.4588,
          lng: 87.2756,
          type: 'commercial',
          vehicles: ['All Types'],
          hours: '6:00 AM - 10:00 PM',
          phone: '+977-21-441235',
          facilities: ['Shopping', 'Banking', 'Business Center']
        },
        {
          id: 503,
          name: 'Industrial District',
          address: 'Industrial Area, Biratnagar',
          lat: 26.4445,
          lng: 87.2892,
          type: 'industrial',
          vehicles: ['Truck', 'Van', 'SUV'],
          hours: '6:00 AM - 8:00 PM',
          phone: '+977-21-441236',
          facilities: ['Factory Area', 'Cargo', 'Logistics']
        },
        {
          id: 504,
          name: 'Hospital Area Hub',
          address: 'Near Koshi Hospital',
          lat: 26.4512,
          lng: 87.2634,
          type: 'medical',
          vehicles: ['Sedan', 'SUV', 'Ambulance'],
          hours: '24/7',
          phone: '+977-21-441237',
          facilities: ['Hospital', 'Emergency', 'Medical Services']
        },
        {
          id: 505,
          name: 'Border Trade Point',
          address: 'Near India Border',
          lat: 26.4198,
          lng: 87.2945,
          type: 'border',
          vehicles: ['All Types'],
          hours: '24/7',
          phone: '+977-21-441238',
          facilities: ['Border Crossing', 'Customs', 'Trade Center']
        }
      ]
    }
  ];

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of the Earth in km
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

  // Get all pickup points with distances
  const allPickupPointsWithDistance = useMemo(() => {
    if (!userLocation) return [];
    
    let allPoints = [];
    
    nepalCities.forEach(city => {
      if (filterByCity === 'all' || filterByCity === city.name.toLowerCase()) {
        city.pickupPoints.forEach(point => {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            point.lat,
            point.lng
          );
          
          allPoints.push({
            ...point,
            cityName: city.name,
            cityId: city.id,
            distance: distance,
            estimatedDriveTime: Math.ceil(distance * 1.5), // Assuming average 40 km/h
            estimatedCost: Math.ceil(distance * 15) // Rough cost estimate in NPR per km
          });
        });
      }
    });
    
    return allPoints.sort((a, b) => a.distance - b.distance);
  }, [userLocation, filterByCity]);

  // Get nearest pickup point
  const nearestPickup = allPickupPointsWithDistance.length > 0 ? allPickupPointsWithDistance[0] : null;

  // Get nearest city
  const nearestCity = useMemo(() => {
    if (!userLocation) return null;
    
    let closestCity = null;
    let minDistance = Infinity;
    
    nepalCities.forEach(city => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        city.lat,
        city.lng
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = { ...city, distance };
      }
    });
    
    return closestCity;
  }, [userLocation]);

  // Get user's current location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setIsLoadingLocation(false);
        setLocationError(null);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
        
        // Fallback to Kathmandu for demo
        console.warn('Using fallback location for demo');
        setTimeout(() => {
          setUserLocation({ lat: 27.7172, lng: 85.3240 });
        }, 2000);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  // Get pickup point icon color based on distance and type
  const getPickupIconColor = (pickup) => {
    if (selectedPickup?.id === pickup.id) return 'red';
    if (pickup.id === nearestPickup?.id) return 'green';
    
    if (pickup.distance <= 50) return 'blue';
    if (pickup.distance <= 100) return 'orange';
    return 'violet';
  };

  const handlePickupSelect = (pickup) => {
    setSelectedPickup(pickup);
    const city = nepalCities.find(c => c.id === pickup.cityId);
    setSelectedCity(city);
  };

  const getCityColor = (cityName) => {
    const colors = {
      'Kathmandu': '#007bff',
      'Pokhara': '#28a745',
      'Butwal': '#ffc107',
      'Narayanghat': '#17a2b8',
      'Biratnagar': '#dc3545'
    };
    return colors[cityName] || '#6c757d';
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
            🇳🇵 Nepal Vehicle Pickup Network
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
                📍 Access My Location in Nepal
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
              ⚠️ {locationError}
            </div>
          )}
        </div>

        {/* Quick City Selection */}
        {!userLocation && (
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>
              🏙️ Quick Demo - Select Your City:
            </h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {nepalCities.map(city => (
                <button
                  key={city.id}
                  onClick={() => setUserLocation({ lat: city.lat, lng: city.lng })}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: getCityColor(city.name),
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  📍 {city.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        {userLocation && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', display: 'block' }}>
                🏙️ Filter by City
              </label>
              <select 
                value={filterByCity} 
                onChange={(e) => setFilterByCity(e.target.value)}
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="all">All Cities</option>
                {nepalCities.map(city => (
                  <option key={city.id} value={city.name.toLowerCase()}>{city.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', display: 'block' }}>
                📏 Search Radius
              </label>
              <select 
                value={radiusKm} 
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value={50}>50 km radius</option>
                <option value={100}>100 km radius</option>
                <option value={200}>200 km radius</option>
                <option value={500}>All Nepal</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>🎛️ Display Options</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
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
        )}

        {/* Nearest Location Recommendation */}
        {userLocation && nearestPickup && nearestCity && (
          <div style={{
            backgroundColor: '#e8f5e8',
            padding: '16px',
            borderRadius: '8px',
            border: '2px solid #28a745',
            marginBottom: '16px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#155724' }}>
              🏆 Recommended Nearest Pickup Point
            </h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '16px'
            }}>
              <div>
                <h5 style={{ margin: '0 0 4px 0', color: '#155724' }}>
                  🚗 {nearestPickup.name}
                </h5>
                <p style={{ margin: '0', fontSize: '14px', color: '#155724' }}>
                  📍 {nearestPickup.address}, {nearestPickup.cityName}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#155724' }}>
                  📏 Distance: <strong>{nearestPickup.distance.toFixed(1)} km</strong>
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#155724' }}>
                  🕒 Drive Time: <strong>~{nearestPickup.estimatedDriveTime} minutes</strong>
                </p>
              </div>
              <div>
                <h5 style={{ margin: '0 0 4px 0', color: '#155724' }}>
                  🏙️ Nearest City: {nearestCity.name}
                </h5>
                <p style={{ margin: '0', fontSize: '14px', color: '#155724' }}>
                  📍 Province: {nearestCity.province}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#155724' }}>
                  👥 Population: {nearestCity.population}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#155724' }}>
                  📏 City Distance: <strong>{nearestCity.distance.toFixed(1)} km</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        {userLocation && allPickupPointsWithDistance.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            backgroundColor: '#e9ecef',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
            flexWrap: 'wrap'
          }}>
            <span>
              <strong>🚗 Found: {allPickupPointsWithDistance.length} pickup points</strong>
            </span>
            <span>
              📏 Nearest: {nearestPickup.distance.toFixed(1)} km
            </span>
            <span>
              📏 Furthest: {allPickupPointsWithDistance[allPickupPointsWithDistance.length - 1].distance.toFixed(1)} km
            </span>
            <span>
              💰 Est. Cost: NPR {nearestPickup.estimatedCost}
            </span>
            <span>
              🏙️ Cities: {new Set(allPickupPointsWithDistance.map(p => p.cityName)).size}
            </span>
          </div>
        )}
      </div>

      {/* Map Container */}
      {userLocation ? (
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={8}
          style={{ height: '700px', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater 
            userLocation={userLocation} 
            selectedCity={selectedCity}
            nearestPickup={nearestPickup}
          />

          {/* User Location Marker */}
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={createCustomIcon('blue', 'large')}
          >
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '280px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#007bff' }}>
                  📍 Your Current Location
                </h4>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  👤 User: <strong>{currentUser}</strong>
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  🌐 Coordinates: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                </p>
                {nearestCity && (
                  <>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      🏙️ Nearest City: <strong>{nearestCity.name}</strong>
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      📏 City Distance: {nearestCity.distance.toFixed(1)} km
                    </p>
                  </>
                )}
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  🚗 Pickup points found: {allPickupPointsWithDistance.length}
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
                fillOpacity: 0.05,
                weight: 2,
                dashArray: '10, 10'
              }}
            />
          )}

          {/* City Markers */}
          {nepalCities.map((city) => (
            <Marker
              key={`city-${city.id}`}
              position={[city.lat, city.lng]}
              icon={createCustomIcon(city.id === nearestCity?.id ? 'green' : 'yellow')}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: getCityColor(city.name) }}>
                    🏙️ {city.name}
                    {city.id === nearestCity?.id && (
                      <span style={{ 
                        fontSize: '11px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        padding: '2px 6px', 
                        borderRadius: '10px',
                        marginLeft: '8px'
                      }}>
                        NEAREST CITY
                      </span>
                    )}
                  </h4>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    📍 Province: {city.province}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    👥 Population: {city.population}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    🚗 Pickup Points: {city.pickupPoints.length}
                  </p>
                  {userLocation && (
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      📏 Distance: {calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        city.lat,
                        city.lng
                      ).toFixed(1)} km
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Pickup Point Markers with Car Icons */}
          {allPickupPointsWithDistance
            .filter(pickup => pickup.distance <= radiusKm)
            .map((pickup) => (
            <Marker
              key={`pickup-${pickup.id}`}
              position={[pickup.lat, pickup.lng]}
              icon={createCarIcon(getPickupIconColor(pickup))}
            >
              <Popup maxWidth={400}>
                <div style={{ minWidth: '350px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                    <h4 style={{ 
                      margin: '0 0 4px 0',
                      color: pickup.id === nearestPickup?.id ? '#28a745' : '#333'
                    }}>
                      🚗 {pickup.name}
                      {pickup.id === nearestPickup?.id && (
                        <span style={{ 
                          fontSize: '12px', 
                          backgroundColor: '#28a745', 
                          color: 'white', 
                          padding: '2px 6px', 
                          borderRadius: '10px',
                          marginLeft: '8px'
                        }}>
                          NEAREST
                        </span>
                      )}
                    </h4>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                      📍 {pickup.cityName} • {pickup.type.charAt(0).toUpperCase() + pickup.type.slice(1)} Hub
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>📍 Address:</strong> {pickup.address}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>📏 Distance:</strong> {pickup.distance.toFixed(1)} km from you
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>🚗 Drive Time:</strong> ~{pickup.estimatedDriveTime} minutes
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>💰 Est. Cost:</strong> NPR {pickup.estimatedCost}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>📞 Phone:</strong> {pickup.phone}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      <strong>🕒 Hours:</strong> {pickup.hours}
                    </p>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: 'bold' }}>
                      🚗 Available Vehicles:
                    </p>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {pickup.vehicles.map((vehicle, idx) => (
                        <span key={idx} style={{
                          display: 'inline-block',
                          backgroundColor: '#e9ecef',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          margin: '2px',
                          fontSize: '11px'
                        }}>
                          {vehicle}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: 'bold' }}>
                      🏢 Facilities:
                    </p>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {pickup.facilities.map((facility, idx) => (
                        <span key={idx} style={{
                          display: 'inline-block',
                          backgroundColor: '#f8f9fa',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          margin: '2px',
                          fontSize: '11px',
                          border: '1px solid #dee2e6'
                        }}>
                          {facility}
                        </span>
                      ))}
                    </div>
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
                      {selectedPickup?.id === pickup.id ? '✅ Selected' : '🚗 Select Point'}
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
                      🗺️ Navigate
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Distance Lines to Nearest Pickup Points */}
          {showDistanceLines && userLocation && allPickupPointsWithDistance
            .filter(pickup => pickup.distance <= radiusKm)
            .slice(0, 5) // Show lines to only 5 closest points to avoid clutter
            .map((pickup) => (
            <Polyline
              key={`line-${pickup.id}`}
              positions={[
                [userLocation.lat, userLocation.lng],
                [pickup.lat, pickup.lng]
              ]}
              pathOptions={{
                color: pickup.id === nearestPickup?.id ? '#28a745' : 
                       selectedPickup?.id === pickup.id ? '#dc3545' : '#6c757d',
                weight: pickup.id === nearestPickup?.id ? 4 : 
                        selectedPickup?.id === pickup.id ? 4 : 2,
                opacity: pickup.id === nearestPickup?.id ? 0.8 : 
                         selectedPickup?.id === pickup.id ? 0.8 : 0.4,
                dashArray: pickup.id === nearestPickup?.id ? '0' : '5, 10'
              }}
            />
          ))}
        </MapContainer>
      ) : (
        <div style={{ 
          height: '700px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#666', margin: '0 0 12px 0' }}>🇳🇵 Nepal Vehicle Pickup Network</h3>
            <p style={{ color: '#666', margin: '0 0 20px 0', maxWidth: '500px' }}>
              Access your location to find the nearest pickup points across major cities in Nepal including 
              Kathmandu, Pokhara, Butwal, Narayanghat, and Biratnagar.
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
                fontWeight: 'bold',
                marginBottom: '16px'
              }}
            >
              📍 Get My Location
            </button>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '12px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {nepalCities.map(city => (
                <div key={city.id} style={{
                  backgroundColor: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #dee2e6',
                  textAlign: 'center'
                }}>
                  <h5 style={{ margin: '0 0 4px 0', color: getCityColor(city.name) }}>
                    {city.name}
                  </h5>
                  <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                    {city.pickupPoints.length} pickup points
                  </p>
                  <button
                    onClick={() => setUserLocation({ lat: city.lat, lng: city.lng })}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: getCityColor(city.name),
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      marginTop: '4px'
                    }}
                  >
                    Demo
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Pickup Info Panel */}
      {selectedPickup && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 1000,
          maxWidth: '400px',
          maxHeight: '80vh',
          overflow: 'auto',
          border: `3px solid ${selectedPickup.id === nearestPickup?.id ? '#28a745' : '#007bff'}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, color: selectedPickup.id === nearestPickup?.id ? '#28a745' : '#007bff' }}>
              🚗 Selected Pickup Point
            </h4>
            <button
              onClick={() => setSelectedPickup(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '0'
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <h5 style={{ margin: '0 0 8px 0' }}>
              {selectedPickup.name}
              {selectedPickup.id === nearestPickup?.id && (
                <span style={{ 
                  fontSize: '11px', 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  padding: '2px 6px', 
                  borderRadius: '10px',
                  marginLeft: '8px'
                }}>
                  NEAREST
                </span>
              )}
            </h5>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              📍 {selectedPickup.address}, {selectedPickup.cityName}
            </p>
          </div>

          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '12px', 
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>
              <strong>📊 Travel Information:</strong>
            </div>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              📏 <strong>Distance:</strong> {selectedPickup.distance.toFixed(1)} km
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              🚗 <strong>Drive Time:</strong> ~{selectedPickup.estimatedDriveTime} minutes
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              💰 <strong>Est. Cost:</strong> NPR {selectedPickup.estimatedCost}
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              📞 <strong>Contact:</strong> {selectedPickup.phone}
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              🕒 <strong>Hours:</strong> {selectedPickup.hours}
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              📱 Book Vehicle at This Point
            </button>
            
            <button 
              onClick={() => {
                const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${selectedPickup.lat},${selectedPickup.lng}`;
                window.open(url, '_blank');
              }}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🗺️ Get Directions
            </button>

            <button
              onClick={() => window.open(`tel:${selectedPickup.phone}`)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📞 Call Pickup Point
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .custom-car-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
};

export default NepalPickupMap;