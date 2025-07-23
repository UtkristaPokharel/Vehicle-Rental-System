const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');

async function debugTransactions() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/Vehicle_Rental_System');
    console.log('✅ Connected to MongoDB');

    // Find all transactions
    const transactions = await Transaction.find({}).sort({ createdAt: -1 }).limit(10);
    
    console.log('\n=== Recent Transactions ===');
    console.log(`Found ${transactions.length} transactions`);
    
    transactions.forEach((transaction, index) => {
      console.log(`\n--- Transaction ${index + 1} ---`);
      console.log(`UUID: ${transaction.uuid}`);
      console.log(`Status: ${transaction.status}`);
      console.log(`Amount: रु${transaction.amount}`);
      console.log(`User Info:`, transaction.userInfo || 'Not available');
      console.log(`Created: ${transaction.createdAt}`);
      console.log(`Updated: ${transaction.updatedAt}`);
      if (transaction.transactionCode) {
        console.log(`eSewa Code: ${transaction.transactionCode}`);
      }
    });

    // Check for pending transactions
    const pendingTransactions = await Transaction.find({ status: 'pending' });
    console.log(`\n🔍 Found ${pendingTransactions.length} pending transactions`);

    if (pendingTransactions.length > 0) {
      console.log('\n=== Pending Transaction Analysis ===');
      pendingTransactions.forEach((tx, index) => {
        console.log(`Pending Transaction ${index + 1}:`);
        console.log(`  UUID: ${tx.uuid}`);
        console.log(`  Amount: रु${tx.amount}`);
        console.log(`  Created: ${tx.createdAt}`);
        console.log(`  Time since creation: ${Math.round((Date.now() - tx.createdAt.getTime()) / 1000 / 60)} minutes`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

debugTransactions();
