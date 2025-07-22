const { sendLoginEmail, sendSignupEmail } = require('./services/emailService');

async function testEmails() {
  console.log('🧪 Testing email functionality...');
  
  try {
    // Test signup email
    console.log('📧 Testing signup email...');
    const signupResult = await sendSignupEmail('test@example.com', 'Test User');
    console.log('✅ Signup email sent successfully!');
    console.log('📧 Message ID:', signupResult.messageId);
    
    // Test login email
    console.log('📧 Testing login email...');
    const loginResult = await sendLoginEmail('test@example.com', 'Test User');
    console.log('✅ Login email sent successfully!');
    console.log('📧 Message ID:', loginResult.messageId);
    
    console.log('🎉 All email tests passed!');
    
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error message:', error.message);
    console.error('Error details:', error);
  }
}

testEmails();
