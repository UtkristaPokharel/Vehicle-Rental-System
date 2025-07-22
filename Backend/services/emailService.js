const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER_Auth, 
    pass: process.env.EMAIL_PASS_Auth, 
  },
  tls: {
    rejectUnauthorized: false 
  }
});

const sendLoginEmail = async (to, name) => {
  let info = await transporter.sendMail({
    from: `"Easy Wheels" <${process.env.EMAIL_USER_Auth}>`,
    to,
    subject: "Login Notification",
    html: `
      <h3>Hello ${name || ""},</h3>
      <p>You have logged in to your account. If this wasn't you, please secure your account immediately.</p>
      <p>Thank you,<br/>Easy Wheels Team</p>
    `,
  });
  return info;
};

const  sendSignupEmail = async (to, name) => {
  let info = await transporter.sendMail({
    from: `"Easy Wheels" <${process.env.EMAIL_USER_Auth}>`,
    to,
    subject: "Welcome to Easy Wheels",
    html: `
      <h3>Hello ${name || ""},</h3>
      <p>Thank you for signing up! We're excited to have you on board.</p>
      <p>Best regards,<br/>Easy Wheels Team</p>
    `,
  });
  return info;
};


module.exports = { sendLoginEmail ,sendSignupEmail };