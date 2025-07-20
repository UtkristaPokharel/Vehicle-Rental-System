const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

const { vehicleUpload } = require('../middleware/upload');

router.post('/add-vehicle', vehicleUpload.single('vehicleImage'), async (req, res) => {
  try {
    const { name, type, brand, price, location, features, description, seats, fuelType, mileage, transmission, isActive, createdById } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res.status(400).json({ message: 'Vehicle image is required' });
    }

    const vehicle = new Vehicle({
      name,
      type,
      brand,
      price: parseFloat(price),
      location,
      seats: parseInt(seats),
      fuelType,
      mileage: parseFloat(mileage),
      transmission,
      features: JSON.parse(features),
      image,
      description,
      isActive: isActive !== undefined ? isActive : true, // Default to true if not provided
      createdBy: req.body.createdBy || 'admin',
      createdById: createdById || 'admin',
    });

    await vehicle.save();
    res.status(201).json({ message: 'Vehicle added successfully' });
  } catch (error) {
    console.error('Error adding vehicle:', error.message);
    res.status(400).json({ message: error.message });
  }
});




module.exports = router;