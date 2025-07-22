# API Configuration Update

## Summary
Successfully updated all frontend API calls to use the deployed backend URL: `https://vehicle-rental-system-rjvj.onrender.com`

## Changes Made

### 1. Created Configuration File
- **File**: `Front-end/src/config/api.js`
- **Purpose**: Centralized API configuration with helper functions
- **Features**:
  - `API_BASE_URL`: Main backend URL
  - `getApiUrl()`: Helper for constructing API endpoints
  - `getImageUrl()`: Helper for vehicle image URLs
  - `getProfileImageUrl()`: Helper for user profile image URLs

### 2. Updated Files

#### Core Pages
- ✅ `src/utils/vehicleAnalytics.js`
- ✅ `src/pages/PaymentPage.jsx`
- ✅ `src/pages/VehicleDetails.jsx`
- ✅ `src/pages/Browse.jsx`
- ✅ `src/pages/Vehicles.jsx`
- ✅ `src/pages/Auth.jsx`
- ✅ `src/pages/ContactUs.jsx`
- ✅ `src/pages/Api/Logout.jsx`

#### Admin Components
- ✅ `src/pages/admin/AdminLoginPage.jsx`
- ✅ `src/pages/admin/DashboardComponent/VehicleDataComponent.jsx`
- ✅ `src/pages/admin/DashboardComponent/UsersDataComponent.jsx`
- ✅ `src/pages/admin/DashboardComponent/EditVehiclePage.jsx`

#### Renter Components
- ✅ `src/pages/renter/AddVehicleForm.jsx`

#### Shared Components
- ✅ `src/components/VehicleCard.jsx`
- ✅ `src/components/VehicleTypePage.jsx`
- ✅ `src/components/ProfileSidebar.jsx`

### 3. What Changed

**Before**: 
```javascript
const response = await fetch("http://localhost:3001/api/vehicles");
```

**After**:
```javascript
import { getApiUrl } from "../config/api";
const response = await fetch(getApiUrl("api/vehicles"));
```

**Image URLs Before**:
```javascript
src={`http://localhost:3001/uploads/vehicles/${vehicle.image}`}
```

**Image URLs After**:
```javascript
import { getImageUrl } from "../config/api";
src={getImageUrl(vehicle.image)}
```

## Backend URL
Your backend is now deployed at: **https://vehicle-rental-system-rjvj.onrender.com**

## Testing Checklist
After deployment, test these features:
- [ ] User authentication (login/signup)
- [ ] Vehicle browsing and filtering
- [ ] Vehicle details page
- [ ] Admin dashboard
- [ ] Image uploads (profile and vehicle images)
- [ ] Contact form
- [ ] Vehicle click tracking
- [ ] Popular vehicles display

## Environment Switching
To switch between development and production:
1. Edit `Front-end/src/config/api.js`
2. Change `API_BASE_URL` to:
   - Development: `http://localhost:3001`
   - Production: `https://vehicle-rental-system-rjvj.onrender.com`

## Notes
- All API calls now use the centralized configuration
- Image URLs are properly constructed for both development and production
- The configuration supports different image path formats for backward compatibility
- CORS is properly configured in the backend for the Render deployment
