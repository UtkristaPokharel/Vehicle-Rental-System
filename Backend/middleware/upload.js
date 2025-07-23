const multer = require('multer');
const path = require('path');
const { vehicleStorage, profileStorage } = require('../utils/cloudinary');

// Removed local storage configurations as we're using Cloudinary
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg','image/avif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and JPG files are allowed'), false);
  }
};

const profileUpload = multer({
  storage: profileStorage, // Use profile-specific storage
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

const vehicleUpload = multer({
  storage: vehicleStorage, // Use vehicle-specific storage
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

module.exports = { profileUpload, vehicleUpload };
