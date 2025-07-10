const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  id: Number,
  name: String,
  type: String,
  brand: String,
  imageUrl: String,
  price: Number,
  location: String,
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
