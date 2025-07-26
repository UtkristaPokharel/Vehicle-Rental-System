// Test script to debug host dashboard API
const getApiUrl = (endpoint) => {
  return `http://localhost:3001/${endpoint}`;
};

async function testHostAPI() {
  // Get stored user data
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
  console.log('User ID:', userId);
  console.log('Token exists:', !!token);
  
  if (!userId || !token) {
    console.error('❌ No user ID or token found in localStorage');
    return;
  }
  
  try {
    // Test the corrected endpoint
    console.log('🔍 Testing endpoint:', getApiUrl(`api/user/user/${userId}`));
    
    const response = await fetch(getApiUrl(`api/user/user/${userId}`), {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', data);
      console.log('📊 Vehicles found:', data.data?.length || 0);
      
      if (data.data && data.data.length > 0) {
        console.log('🚗 First vehicle:', data.data[0]);
      } else {
        console.log('⚠️ No vehicles found for this user');
      }
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error);
  }
}

// Run the test
testHostAPI();
