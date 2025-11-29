import User from "../models/User.js";
import jwt from "jsonwebtoken";
import twilioClient, { verifyServiceSid } from "../utils/twilio.js";

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

/**
 * Send OTP via WhatsApp using Twilio Verify
 */
export const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
      await twilioClient.verify.v2
        .services(verifyServiceSid)
        .verifications.create({
          to: `whatsapp:${phoneNumber}`,
          channel: "whatsapp",
        });

    res.status(200).json({ message: "OTP sent via WhatsApp" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP", details: error });
  }
};

/**
 * Verify OTP code and register/login user, returning JWT token
 */
export const verifyOtp = async (req, res) => {
  const { phoneNumber, code, name, email } = req.body;

  if (!phoneNumber || !code) {
    return res
      .status(400)
      .json({ error: "Phone number and OTP code are required" });
  }

  try {
     const verificationCheck = await twilioClient.verify.v2
       .services(verifyServiceSid)
       .verificationChecks.create({
         to: `whatsapp:${phoneNumber}`,
         code,
       });


    if (verificationCheck.status !== "approved") {
      return res.status(400).json({ error: "Invalid OTP code" });
    }

    let user = await User.findOne({ phoneNumber });

    if (!user) {
      user = new User({ phoneNumber, name, email, isVerified: true });
      await user.save();
    } else {
      user.isVerified = true;
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, phoneNumber: user.phoneNumber },
      jwtSecret,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "User authenticated successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: "OTP verification failed", details: error });
  }
};
