const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: config.email.user,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to', to);
  } catch (error) {
    console.error('Email send error:', error);
  }
};

module.exports = { sendEmail };
