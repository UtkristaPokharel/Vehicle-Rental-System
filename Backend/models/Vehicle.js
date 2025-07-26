const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    validate: {
      validator: (value) => !/^\d/.test(value),
      message: 'Name must not start with a number',
    },
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    validate: {
      validator: (value) => !/^\d/.test(value),
      message: 'Type must not start with a number',
    },
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    validate: {
      validator: (value) => !/^\d/.test(value),
      message: 'Brand must not start with a number',
    },
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price must be a positive number'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  // Vehicle specifications
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    validate: {
      validator: function(value) {
        // For trucks and pickups, allow higher capacity (up to 10000)
        // For other vehicles, limit to 50 seats
        if (this.type === 'truck' || this.type === 'pickup') {
          return value <= 10000;
        }
        return value <= 50;
      },
      message: function(props) {
        if (this.type === 'truck' || this.type === 'pickup') {
          return 'Capacity cannot exceed 10000 for trucks and pickups';
        }
        return 'Seats cannot exceed 50 for passenger vehicles';
      }
    }
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
  },
  mileage: {
    type: Number,
    required: [true, 'Mileage is required'],
    min: [1, 'Mileage must be positive'],
  },
  transmission: {
    type: String,
    required: [true, 'Transmission type is required'],
    enum: ['Automatic', 'Manual'],
  },
  features: {
    Safety: [String],
    'Device connectivity': [String],
    'Additional features': [String],
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
  },
  description: { 
    type: String, 
    required:[ true," Add description"] 
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdById: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);