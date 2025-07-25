const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['esewa', 'card', 'paypal', 'apple', 'google'],
    required: true
  },
  transactionCode: {
    type: String,
    default: null
  },
  bookingData: {
    startDate: String,
    startTime: String,
    endDate: String,
    endTime: String,
    location: String
  },
  vehicleData: {
    id: String,
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    name: String,
    price: Number,
    image: String,
    model: String,
    type: String,
    location: String
  },
  billingAddress: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  userInfo: {
    name: String,
    email: String,
    phone: String
  },
  userEmail: {
    type: String,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  failedAt: {
    type: Date,
    default: null
  },
  errorMessage: {
    type: String,
    default: null
  }
});

// Create indexes
transactionSchema.index({ uuid: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ userId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
