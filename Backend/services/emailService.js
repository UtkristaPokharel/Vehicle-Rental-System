const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendLoginEmail = async (to, name) => {
  let info = await transporter.sendMail({
    from: `"Easy Wheels" <${process.env.FROM_EMAIL}>`,
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
    from: `"Easy Wheels" <${process.env.FROM_EMAIL}>`,
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