import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendVerificationEmail = async (email, otp) => {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent to email');
  } catch (error) {
    console.error('Failed to send OTP:', error.message);
    throw error;
  }
};
export const handleMessageFromCustomer = async (email, subject , review) => {

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: subject,
    text: review ,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('customer message sended');
  } catch (error) {
    console.error('Failed to send message:', error.message);
    throw error;
  }
};
