const { sendLoginEmail, sendSignupEmail } = require('./services/emailService');

async function testEmail() {
  console.log('🧪 Testing email functionality...');
  console.log('📧 Sending test emails to kathayat626282@gmail.com');
  
  try {
    // Test login email
    console.log('Sending login email...');
    const loginResult = await sendLoginEmail('kathayat626282@gmail.com', 'Test User');
    console.log('✅ Login email sent successfully!');
    console.log('Message ID:', loginResult.messageId);
    
    // Wait a bit between emails
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test signup email
    console.log('Sending signup email...');
    const signupResult = await sendSignupEmail('kathayat626282@gmail.com', 'Test User');
    console.log('✅ Signup email sent successfully!');
    console.log('Message ID:', signupResult.messageId);
    
    console.log('🎉 All test emails sent successfully!');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Full error:', error);
  }
  
  process.exit(0);
}

testEmail();
