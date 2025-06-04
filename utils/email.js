const nodemailer = require('nodemailer');

const sendMail = async (options) => {
  //create a transporter
  const transporter = nodemailer.createTransport({
    host: live.smtp.mailtrap.io,
    port: 587,
    auth: {
      user: 'smtp@mailtrap.io',
      pass: 'YOUR_API_TOKEN',
    },
  });

  //define the email options
  const mailOptions = {
    from: 'raushanraie01@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
