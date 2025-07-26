// Debug script to check vehicles in database
const mongoose = require('mongoose');
require('dotenv').config();

// Vehicle model (copy from your model)
const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  fuelType: { type: String, required: true, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
  mileage: { type: Number, required: true },
  transmission: { type: String, required: true, enum: ['Automatic', 'Manual'] },
  features: {
    Safety: [String],
    'Device connectivity': [String],
    'Additional features': [String],
  },
  image: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdById: { type: String, required: false },
  isActive: { type: Boolean, default: true },
  clickCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

async function debugVehicles() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/easywheels";
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all vehicles
    const allVehicles = await Vehicle.find({});
    console.log(`📊 Total vehicles in database: ${allVehicles.length}`);

    if (allVehicles.length > 0) {
      console.log('\n🚗 First 3 vehicles:');
      allVehicles.slice(0, 3).forEach((vehicle, index) => {
        console.log(`\n--- Vehicle ${index + 1} ---`);
        console.log('ID:', vehicle._id.toString());
        console.log('Name:', vehicle.name);
        console.log('Type:', vehicle.type);
        console.log('CreatedBy:', vehicle.createdBy);
        console.log('CreatedById:', vehicle.createdById);
        console.log('IsActive:', vehicle.isActive);
        console.log('Created At:', vehicle.createdAt);
      });

      // Group by createdById
      const groupedByCreatedById = {};
      allVehicles.forEach(vehicle => {
        const createdById = vehicle.createdById || 'null';
        if (!groupedByCreatedById[createdById]) {
          groupedByCreatedById[createdById] = [];
        }
        groupedByCreatedById[createdById].push(vehicle);
      });

      console.log('\n📊 Vehicles grouped by createdById:');
      Object.keys(groupedByCreatedById).forEach(createdById => {
        console.log(`${createdById}: ${groupedByCreatedById[createdById].length} vehicles`);
      });
    }

    // Test the specific API endpoint logic
    console.log('\n🔍 Testing API query logic:');
    const testUserId = "507f1f77bcf86cd799439011"; // Example user ID
    console.log(`Looking for vehicles where createdById = "${testUserId}"`);
    
    const userVehicles = await Vehicle.find({ createdById: testUserId });
    console.log(`Found ${userVehicles.length} vehicles for test user ID`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

debugVehicles();
