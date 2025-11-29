import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

export default twilioClient;
