const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com', // Zoho SMTP server
  port: 587, // Zoho SMTP port
  secure: false, // false for TLS
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  },
  tls: {
    rejectUnauthorized: false
  }
});

const generateUserEmailContent = (name, email, address, phone, country, message) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
        <h1>Thank you for contacting EasyWheels!</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb;">
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
        
        <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Your Message Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Address:</strong> ${address}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
            ${message}
          </div>
        </div>
        
        <p>Our team will review your inquiry and respond within 24-48 hours.</p>
        
        <div style="margin-top: 30px;">
          <h4 style="color: #1e40af;">Contact Information:</h4>
          <p>📍 Butwal, Rupandehi, Nepal</p>
          <p>📞 +977 71537999</p>
          <p>📱 +977 9806418493</p>
          <p>✉️ info@easywheels.com.np</p>
        </div>
        
        <p style="margin-top: 30px;">Best regards,<br><strong>EasyWheels Team</strong></p>
      </div>
      <div style="background-color: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
        <p>© 2024 EasyWheels. All rights reserved.</p>
      </div>
    </div>
  `;
};

const generateAdminEmailContent = (name, email, address, phone, country, message) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1>New Contact Form Submission</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb;">
        <p>A new contact form has been submitted on the EasyWheels website.</p>
        
        <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #dc2626; margin-top: 0;">Customer Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Address:</strong> ${address}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          
          <h4 style="color: #dc2626; margin-top: 20px;">Message:</h4>
          <div style="background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
            ${message}
          </div>
        </div>
        
        <p style="color: #dc2626; font-weight: bold;">Please respond to this inquiry promptly.</p>
      </div>
    </div>
  `;
};

// Function to send contact form emails
const sendContactEmails = async (contactData) => {
  const { name, email, address, phone, message, country } = contactData;

  // Generate email content
  const userEmailContent = generateUserEmailContent(name, email, address, phone, country, message);
  const adminEmailContent = generateAdminEmailContent(name, email, address, phone, country, message);

  // Prepare email options
  const userMailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: email,
    subject: 'Thank you for contacting EasyWheels - We received your message',
    html: userEmailContent
  };

  const adminMailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: process.env.ADMIN_EMAIL || 'pokharelutkrista@gmail.com',
    subject: `New Contact Form Submission from ${name}`,
    html: adminEmailContent
  };

  // Send both emails
  try {
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);
    return { success: true, message: 'Emails sent successfully' };
  } catch (error) {
    console.error('Error sending contact emails:', error);
    throw error;
  }
};

module.exports = {
  sendContactEmails,
  generateUserEmailContent,
  generateAdminEmailContent
};
