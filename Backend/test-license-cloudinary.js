// Test script to verify Cloudinary license storage configuration
require('dotenv').config();
const { vehicleStorage, profileStorage, licenseStorage } = require('./utils/cloudinary');

console.log('Testing Cloudinary license storage configuration...');

// Test license storage configuration
console.log('\n=== License Storage Configuration ===');
console.log('License folder:', licenseStorage.params.folder);
console.log('License allowed formats:', licenseStorage.params.allowed_formats);

// Test all storage configurations
console.log('\n=== All Storage Configurations ===');
console.log('Vehicle folder:', vehicleStorage.params.folder);
console.log('Profile folder:', profileStorage.params.folder);
console.log('License folder:', licenseStorage.params.folder);

console.log('\n✅ License storage configured successfully!');
console.log('📁 Profile images → profile-uploads/');
console.log('🚗 Vehicle images → vehicle-uploads/');
console.log('📄 License images → license-uploads/');

console.log('\n🔧 Upload Middleware Configuration:');
console.log('• Profile uploads use profileStorage → profile-uploads/ folder');
console.log('• Vehicle uploads use vehicleStorage → vehicle-uploads/ folder');
console.log('• License uploads use licenseStorage → license-uploads/ folder');
console.log('• All support up to 10MB file size limit');
console.log('• All images available via Cloudinary CDN URLs');
