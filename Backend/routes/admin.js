const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle'); // You will create this new model
const bodyParser = require('body-parser');

router.use(bodyParser.json());

// Hardcoded credentials
const ADMIN_CREDENTIALS = {
  username: 'houlers',
  password: 'void2uta'
};

let isAdminLoggedIn = false;

// Admin login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    isAdminLoggedIn = true;
    return res.status(200).json({ message: 'Login successful' });

  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

// Admin panel route to add vehicles
router.post('/add-vehicle', (req, res) => {
  if (!isAdminLoggedIn) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const vehicleData = req.body;

  const newVehicle = new Vehicle(vehicleData);

  newVehicle.save()
    .then(savedVehicle => {
      res.status(201).json({ message: 'Vehicle added', vehicle: savedVehicle });
    })
    .catch(err => {
      res.status(500).json({ message: 'Error saving vehicle', error: err });
    });
});

module.exports = router;
