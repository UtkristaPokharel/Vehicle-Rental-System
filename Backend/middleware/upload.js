const multer = require('multer');
const path = require('path');
const { vehicleStorage, profileStorage, licenseStorage } = require('../utils/cloudinary');

// Improved file filter with better error messages
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg','image/avif'];
  
  console.log('📁 File upload attempt:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(`Invalid file type. Only JPEG, PNG, JPG, and AVIF files are allowed. Received: ${file.mimetype}`);
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

// Error handling wrapper for multer uploads
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large. Maximum size allowed is 10MB',
        error: 'FILE_TOO_LARGE'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        message: 'Unexpected file field. Please check the form field names.',
        error: 'UNEXPECTED_FIELD'
      });
    }
  }
  
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({ 
      message: err.message,
      error: 'INVALID_FILE_TYPE'
    });
  }
  
  // Pass other errors to the next error handler
  next(err);
};

const profileUpload = multer({
  storage: profileStorage, // Use profile-specific storage
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only allow 1 file
  },
  fileFilter,
});

const vehicleUpload = multer({
  storage: vehicleStorage, // Use vehicle-specific storage
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only allow 1 file
  },
  fileFilter,
});

const licenseUpload = multer({
  storage: licenseStorage, // Use license-specific storage
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 2 // Allow up to 2 files (front and back)
  },
  fileFilter,
});

module.exports = { profileUpload, vehicleUpload, licenseUpload, handleUploadError };
