require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Debug: Check if environment variables are loaded
console.log('Cloudinary Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');

// Validate required environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Missing Cloudinary environment variables. Please check your .env file.');
  console.error('Required variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test the configuration
console.log('Cloudinary configured successfully');
console.log('Cloud name:', cloudinary.config().cloud_name);

// Storage configuration for vehicle images
const vehicleStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'vehicle-uploads',
    allowed_formats: ['jpeg', 'jpg', 'png', 'avif'],
  },
});

// Storage configuration for profile images
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profile-uploads',
    allowed_formats: ['jpeg', 'jpg', 'png'],
  },
});

// Default storage (for backward compatibility)
const storage = vehicleStorage;

module.exports = { cloudinary, storage, vehicleStorage, profileStorage };
