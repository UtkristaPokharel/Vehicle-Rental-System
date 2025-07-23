// Test script to verify transaction flow
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
const User = require('./models/User');

async function testTransactionFlow() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Vehicle_Rental_System');
    console.log('✅ Connected to MongoDB for testing');

    // 1. Test creating a transaction with user info
    console.log('\n=== Test 1: Creating Transaction with User Info ===');
    
    // First, let's find a test user or create one
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('Creating test user...');
      testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        phone: '9800000000',
        password: 'test123',
        isVerified: true
      });
      await testUser.save();
      console.log('Test user created:', testUser._id);
    } else {
      console.log('Found existing test user:', testUser._id);
    }

    // Create a test transaction
    const testTransaction = new Transaction({
      uuid: 'test-uuid-' + Date.now(),
      amount: 5000,
      status: 'pending',
      userInfo: {
        userId: testUser._id,
        name: testUser.name,
        email: testUser.email,
        phone: testUser.phone
      },
      vehicleData: {
        _id: 'test-vehicle-id',
        name: 'Test Vehicle',
        model: 'Test Model',
        type: 'Car',
        location: 'Test Location',
        price: 4000
      },
      bookingData: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000), // +1 day
        startTime: '10:00',
        endTime: '10:00'
      },
      billingAddress: {
        name: testUser.name,
        email: testUser.email,
        phone: testUser.phone
      }
    });

    await testTransaction.save();
    console.log('✅ Test transaction created:', testTransaction.uuid);
    console.log('   Status:', testTransaction.status);
    console.log('   User ID:', testTransaction.userInfo.userId);
    console.log('   User Name:', testTransaction.userInfo.name);

    // 2. Test updating transaction status to completed
    console.log('\n=== Test 2: Updating Transaction Status ===');
    
    const updateResult = await Transaction.updateOne(
      { uuid: testTransaction.uuid },
      { 
        status: 'completed',
        transactionCode: 'test-esewa-code-123',
        completedAt: new Date()
      }
    );
    
    console.log('Update result:', updateResult);
    
    // Verify the update
    const updatedTransaction = await Transaction.findOne({ uuid: testTransaction.uuid });
    console.log('✅ Transaction after update:');
    console.log('   Status:', updatedTransaction.status);
    console.log('   Transaction Code:', updatedTransaction.transactionCode);
    console.log('   Completed At:', updatedTransaction.completedAt);
    console.log('   User ID still present:', updatedTransaction.userInfo.userId ? 'Yes' : 'No');

    // 3. Check all pending transactions
    console.log('\n=== Test 3: Checking Pending Transactions ===');
    const pendingCount = await Transaction.countDocuments({ status: 'pending' });
    console.log(`Found ${pendingCount} pending transactions`);

    if (pendingCount > 0) {
      const pendingTransactions = await Transaction.find({ status: 'pending' })
        .sort({ createdAt: -1 })
        .limit(5);
      
      console.log('Recent pending transactions:');
      pendingTransactions.forEach((tx, index) => {
        console.log(`  ${index + 1}. UUID: ${tx.uuid}`);
        console.log(`     Amount: रु${tx.amount}`);
        console.log(`     Created: ${tx.createdAt}`);
        console.log(`     User Info: ${tx.userInfo ? 'Present' : 'Missing'}`);
        console.log(`     User ID: ${tx.userInfo?.userId || 'Not set'}`);
        console.log('     ---');
      });
    }

    // 4. Test transaction retrieval by UUID
    console.log('\n=== Test 4: Transaction Retrieval ===');
    const retrievedTransaction = await Transaction.findOne({ uuid: testTransaction.uuid });
    if (retrievedTransaction) {
      console.log('✅ Transaction retrieved successfully');
      console.log('   All user info preserved:', JSON.stringify(retrievedTransaction.userInfo, null, 2));
    } else {
      console.log('❌ Transaction not found');
    }

    // Cleanup test transaction
    await Transaction.deleteOne({ uuid: testTransaction.uuid });
    console.log('✅ Test transaction cleaned up');

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run the test
console.log('Starting transaction flow test...');
testTransactionFlow();
