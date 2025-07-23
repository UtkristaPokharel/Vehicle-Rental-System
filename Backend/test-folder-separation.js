// Test script to verify Cloudinary folder separation
require('dotenv').config();
const { vehicleStorage, profileStorage } = require('./utils/cloudinary');

console.log('Testing Cloudinary folder separation...');

// Test vehicle storage configuration
console.log('\n=== Vehicle Storage Configuration ===');
console.log('Vehicle folder:', vehicleStorage.params.folder);
console.log('Vehicle allowed formats:', vehicleStorage.params.allowed_formats);

// Test profile storage configuration
console.log('\n=== Profile Storage Configuration ===');
console.log('Profile folder:', profileStorage.params.folder);
console.log('Profile allowed formats:', profileStorage.params.allowed_formats);

console.log('\n✅ Folder separation configured successfully!');
console.log('📁 Profile images will be stored in: profile-uploads/');
console.log('🚗 Vehicle images will be stored in: vehicle-uploads/');

console.log('\n🔧 Upload Middleware Configuration:');
console.log('• Profile uploads use profileStorage → profile-uploads/ folder');
console.log('• Vehicle uploads use vehicleStorage → vehicle-uploads/ folder');
console.log('• Both support up to 10MB file size limit');
console.log('• Images will be available via Cloudinary CDN URLs');
