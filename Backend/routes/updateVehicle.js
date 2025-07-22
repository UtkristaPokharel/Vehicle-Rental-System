const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle"); // Adjust path as needed
const verifyToken = require("../middleware/auth");
const { isAdmin } = require("../middleware/auth");

// Import multer for handling file uploads
const multer = require('multer');
const path = require('path');

const { vehicleStorage } = require("../utils/cloudinary");

// Configure multer for vehicle image uploads using Cloudinary
const upload = multer({ 
  storage: vehicleStorage, // Use vehicle-specific Cloudinary storage
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.put("/update-vehicle", verifyToken, isAdmin, async (req, res) => {
  try {
    const { _id, name, type, brand, price, location, description, features, seats, fuelType, mileage, transmission, isActive } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Vehicle ID is required" });
    }

    const updateData = {
      name,
      type,
      brand,
      price,
      location,
      seats: parseInt(seats),
      fuelType,
      mileage: parseFloat(mileage),
      transmission,
      description,
      features,
    };

    // Include isActive if provided
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    const updated = await Vehicle.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle updated successfully", vehicle: updated });
  } catch (err) {
    console.error("Update vehicle error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to toggle vehicle active status
router.patch("/toggle-vehicle-status/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: "isActive must be a boolean value" });
    }

    const updated = await Vehicle.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ 
      message: `Vehicle ${isActive ? 'activated' : 'deactivated'} successfully`, 
      vehicle: updated 
    });
  } catch (err) {
    console.error("Toggle vehicle status error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete-vehicle/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Vehicle.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("Delete vehicle error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add vehicle image update endpoint
router.post("/update-vehicle-image", verifyToken, isAdmin, upload.single('vehicleImage'), async (req, res) => {
  try {
    const { vehicleId } = req.body;
    
    if (!vehicleId) {
      return res.status(400).json({ message: "Vehicle ID is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // For Cloudinary, use the full URL; for local storage, use filename
    const imageUrl = req.file.path || req.file.filename;
    const filename = req.file.filename;

    // Update the vehicle with the new image URL
    const updated = await Vehicle.findByIdAndUpdate(
      vehicleId,
      { image: imageUrl },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ 
      message: "Vehicle image updated successfully", 
      imageUrl: imageUrl,
      filename: filename,
      vehicle: updated 
    });
  } catch (err) {
    console.error("Update vehicle image error:", err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "File size too large. Maximum 10MB allowed." });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
