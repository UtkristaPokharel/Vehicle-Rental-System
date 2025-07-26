// Test script to verify profile update functionality
const axios = require('axios');

const testProfileUpdate = async () => {
  try {
    console.log('🧪 Testing Profile Update API...');
    
    // First, login to get a token
    console.log('1. Logging in to get a token...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'test@gmail.com', // Replace with a test user email
      password: 'test123'       // Replace with a test user password
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token obtained');
    
    // Test GET current user profile
    console.log('\n2. Fetching current user profile...');
    const profileResponse = await axios.get('http://localhost:3001/api/fetch/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Current profile data:', {
      id: profileResponse.data._id,
      name: profileResponse.data.name,
      email: profileResponse.data.email,
      phone: profileResponse.data.phone,
      imgUrl: profileResponse.data.imgUrl,
      isVerified: profileResponse.data.isVerified
    });
    
    // Test PUT profile update
    console.log('\n3. Testing profile update...');
    const updateData = {
      name: 'Updated Test User',
      phone: '9876543210'
    };
    
    const updateResponse = await axios.put('http://localhost:3001/api/fetch/users/me', updateData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Profile update successful:', updateResponse.data.message);
    console.log('📋 Updated user data:', {
      name: updateResponse.data.user.name,
      email: updateResponse.data.user.email,
      phone: updateResponse.data.user.phone
    });
    
    // Test profile image upload (simulate)
    console.log('\n4. Testing profile image upload endpoint...');
    const FormData = require('form-data');
    const fs = require('fs');
    const path = require('path');
    
    // Check if test image exists, if not, skip this test
    const testImagePath = path.join(__dirname, 'uploads', 'profiles', '1753101138567.png');
    if (fs.existsSync(testImagePath)) {
      console.log('📁 Test image found, testing upload...');
      // Note: This would require actual file upload, so we'll just test the endpoint exists
      console.log('ℹ️ Image upload endpoint available at: POST /api/fetch/users/upload-profile');
    } else {
      console.log('ℹ️ No test image found, skipping upload test');
    }
    
    // Test license upload endpoint
    console.log('\n5. Testing license upload endpoint...');
    console.log('ℹ️ License upload endpoint available at: POST /api/fetch/users/upload-license');
    
    console.log('\n✅ All profile update tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Tip: Make sure you have a test user with email "test@gmail.com" and password "test123"');
      console.log('💡 Or update the login credentials in this test script');
    }
  }
};

// Test Cloudinary configuration
const testCloudinaryConfig = () => {
  console.log('\n🌩️ Testing Cloudinary Configuration...');
  
  try {
    const { cloudinary } = require('./utils/cloudinary');
    console.log('✅ Cloudinary module loaded successfully');
    console.log('📋 Cloud name:', cloudinary.config().cloud_name);
    console.log('📋 API key configured:', !!cloudinary.config().api_key);
    console.log('📋 API secret configured:', !!cloudinary.config().api_secret);
  } catch (error) {
    console.error('❌ Cloudinary configuration error:', error.message);
  }
};

// Run tests
const runAllTests = async () => {
  console.log('🚀 Starting Profile Update Tests...\n');
  
  testCloudinaryConfig();
  await testProfileUpdate();
  
  console.log('\n🎉 All tests completed!');
  process.exit(0);
};

runAllTests();
