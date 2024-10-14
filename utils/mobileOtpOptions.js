import Twilio from "twilio"; 
import dotenv from 'dotenv';
dotenv.config();

const client = new Twilio(process.env.accountSid, process.env.authToken);

export const sendMobileOtp = async (OTP, phone) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is ${OTP}`,
      from: process.env.twilioPhoneNumber,
      to: `+91${phone}`,
    });

    console.log(`OTP sent with SID: ${message.sid}`);
    return {
      message: "SMS sent successfully",
      sid: message.sid,
      status: message.status,
    };
  } catch (err) {
    console.error("Error sending SMS:", err);
    throw new Error("Failed to send SMS");
  }
};
