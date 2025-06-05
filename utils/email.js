const nodemailer = require('nodemailer');

const sendMail = async ({ email, subject, message }) => {
  try {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'cdfe726d862ea8',
        pass: 'bd741651e8341b',
      },
    });
    const mailOptions = {
      from: 'raushan01@gmail.com',
      to: email,
      text: message,
      subject,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent');
    //
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

module.exports = sendMail;
