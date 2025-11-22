//@ts-ignore
import { Request, Response } from "express";
import User from "../models/User.js";
import client from "../utils/s3Client.js";
import jwt from "jsonwebtoken";

const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

/**
 * Send OTP via WhatsApp using Twilio Verify API
 */
export const sendOtp = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber)
    return res.status(400).json({ error: "Phone number is required" });

  try {
    await client.verify.services(verifyServiceSid).verifications.create({
      to: `whatsapp:${phoneNumber}`,
      channel: "whatsapp",
    });

    res.status(200).json({ message: "OTP sent via WhatsApp" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP", details: error });
  }
};

/**
 * Verify OTP code and register/login user, returning JWT token
 */
export const verifyOtp = async (req: Request, res: Response) => {
  const { phoneNumber, code, name, email } = req.body;

  if (!phoneNumber || !code) {
    return res
      .status(400)
      .json({ error: "Phone number and OTP code are required" });
  }

  try {
    const verificationCheck = await client.verify
      .services(verifyServiceSid)
      .verificationChecks.create({ to: `whatsapp:${phoneNumber}`, code });

    if (verificationCheck.status === "approved") {
      // Find or create user
      let user = await User.findOne({ phoneNumber });

      if (!user) {
        user = new User({ phoneNumber, isVerified: true, name, email });
        await user.save();
      } else if (!user.isVerified) {
        user.isVerified = true;
        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();
      }

      // Generate JWT token valid for 1 day
      const token = jwt.sign(
        { userId: user._id, phoneNumber: user.phoneNumber },
        jwtSecret,
        {
          expiresIn: "1d",
        }
      );

      res
        .status(200)
        .json({ message: "User authenticated successfully", token });
    } else {
      res.status(400).json({ error: "Invalid OTP code" });
    }
  } catch (error) {
    res.status(500).json({ error: "OTP verification failed", details: error });
  }
};
