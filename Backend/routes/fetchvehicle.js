const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle.js'); // adjust path if needed

// GET all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET vehicles by type
router.get('/type/:type', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ type: req.params.type });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
