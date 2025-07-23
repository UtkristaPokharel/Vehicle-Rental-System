const axios = require('axios');

// Test the verification endpoint
async function testVerification() {
  try {
    // First, let's get all users to find one to test with
    console.log('🔍 Fetching users...');
    const usersResponse = await axios.get('http://localhost:3001/api/fetch/users');
    const users = usersResponse.data;
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    const testUser = users[0]; // Use the first user for testing
    console.log(`📋 Testing with user: ${testUser.name} (${testUser.email})`);
    console.log(`📊 Current verification status: ${testUser.isVerified || false}`);
    
    // Get admin token (you'll need to replace this with actual admin login)
    // For now, let's assume we have admin credentials
    console.log('🔐 Logging in as admin...');
    const adminLogin = await axios.post('http://localhost:3001/admin/login', {
      username: 'houlers',
      password: 'void2uta'
    });
    
    const adminToken = adminLogin.data.token;
    console.log('✅ Admin login successful');
    
    // Test verification toggle
    const newVerifiedStatus = !(testUser.isVerified || false);
    console.log(`🔄 Setting verification status to: ${newVerifiedStatus}`);
    
    const verifyResponse = await axios.patch(
      `http://localhost:3001/api/fetch/users/verify/${testUser._id}`,
      { verified: newVerifiedStatus },
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Verification update successful!');
    console.log('📋 Response:', verifyResponse.data);
    
    // Verify the change was saved
    console.log('🔍 Checking if changes were saved...');
    const updatedUsersResponse = await axios.get('http://localhost:3001/api/fetch/users');
    const updatedUser = updatedUsersResponse.data.find(u => u._id === testUser._id);
    
    console.log(`📊 Updated verification status: ${updatedUser.isVerified}`);
    console.log(`📅 Verified at: ${updatedUser.verifiedAt}`);
    console.log(`👤 Verified by: ${updatedUser.verifiedBy}`);
    
    if (updatedUser.isVerified === newVerifiedStatus) {
      console.log('🎉 SUCCESS: Database was updated correctly!');
    } else {
      console.log('❌ FAILED: Database was not updated');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testVerification();
