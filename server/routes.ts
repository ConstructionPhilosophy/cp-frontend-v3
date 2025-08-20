import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
  });

  // SMS/OTP endpoints for phone verification
  app.post("/api/send-otp", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      // In a real implementation, you would integrate with an SMS service like:
      // - Twilio
      // - AWS SNS
      // - Firebase Phone Auth
      // - Any other SMS gateway
      
      // For demo purposes, we'll simulate sending an OTP
      console.log(`Sending OTP to ${phoneNumber}`);
      
      // Generate a random 6-digit OTP (in real app, store this securely)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`Generated OTP: ${otp} for ${phoneNumber}`);
      
      // TODO: Integrate with your SMS service provider
      // Example with Twilio:
      // await twilioClient.messages.create({
      //   body: `Your verification code is: ${otp}`,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: phoneNumber
      // });

      res.json({ 
        success: true, 
        message: "OTP sent successfully",
        // In production, don't send OTP in response
        debug: process.env.NODE_ENV === 'development' ? { otp } : undefined
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  app.post("/api/verify-otp", async (req, res) => {
    try {
      const { phoneNumber, code } = req.body;
      
      if (!phoneNumber || !code) {
        return res.status(400).json({ error: "Phone number and code are required" });
      }

      // In a real implementation, you would:
      // 1. Retrieve the stored OTP for this phone number
      // 2. Check if it matches the provided code
      // 3. Check if it hasn't expired (usually 5-10 minutes)
      // 4. Mark the phone number as verified
      
      // For demo purposes, accept any 6-digit code
      if (code.length === 6 && /^\d{6}$/.test(code)) {
        res.json({ 
          success: true, 
          message: "Phone number verified successfully" 
        });
      } else {
        res.status(400).json({ 
          error: "Invalid verification code" 
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}