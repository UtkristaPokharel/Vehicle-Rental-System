// Debug script to check bookings in database
const mongoose = require('mongoose');
require('dotenv').config();

// Booking model (simplified)
const bookingSchema = new mongoose.Schema({
  bookingId: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  userEmail: String,
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  vehicleName: String,
  vehicleType: String,
  startDate: Date,
  endDate: Date,
  pricing: {
    totalAmount: Number
  },
  bookingStatus: String,
  paymentStatus: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

// Vehicle model (simplified)
const vehicleSchema = new mongoose.Schema({
  name: String,
  type: String,
  createdById: String,
  isActive: Boolean
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

async function debugBookings() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/easywheels";
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all bookings
    const allBookings = await Booking.find({});
    console.log(`📋 Total bookings in database: ${allBookings.length}`);

    if (allBookings.length > 0) {
      console.log('\n📋 First 3 bookings:');
      allBookings.slice(0, 3).forEach((booking, index) => {
        console.log(`\n--- Booking ${index + 1} ---`);
        console.log('Booking ID:', booking.bookingId || booking._id.toString());
        console.log('Vehicle ID:', booking.vehicleId?.toString());
        console.log('Vehicle Name:', booking.vehicleName);
        console.log('User Name:', booking.userName);
        console.log('Status:', booking.bookingStatus);
        console.log('Amount:', booking.pricing?.totalAmount);
        console.log('Created:', booking.createdAt);
      });

      // Test host booking query
      console.log('\n🔍 Testing host booking query:');
      const testHostId = "6874ddbe50da03653d65f766"; // From vehicle debug
      
      // Find vehicles for this host
      const hostVehicles = await Vehicle.find({ createdById: testHostId });
      console.log(`Found ${hostVehicles.length} vehicles for host ${testHostId}`);
      
      if (hostVehicles.length > 0) {
        const vehicleIds = hostVehicles.map(v => v._id);
        const hostBookings = await Booking.find({ vehicleId: { $in: vehicleIds } });
        console.log(`Found ${hostBookings.length} bookings for host's vehicles`);
      }
    } else {
      console.log('⚠️ No bookings found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

debugBookings();
