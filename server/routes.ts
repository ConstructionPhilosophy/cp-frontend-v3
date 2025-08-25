import type { Express } from "express";
import { createServer, type Server } from "http";
import { API_ENDPOINTS } from "../shared/config";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
  });

  // Custom Geo API endpoints
  app.get("/api/countries", async (req, res) => {
    try {
      const response = await fetch(API_ENDPOINTS.GEO_COUNTRIES);
      if (response.ok) {
        const data = await response.json();
        res.json(data);
      } else {
        throw new Error('Failed to fetch countries');
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      res.status(500).json({ error: "Failed to fetch countries" });
    }
  });

  app.get("/api/states", async (req, res) => {
    try {
      const { country_code } = req.query;
      if (!country_code) {
        return res.status(400).json({ error: "country_code parameter is required" });
      }

      const response = await fetch(`${API_ENDPOINTS.GEO_STATES}?country_code=${country_code}`);
      if (response.ok) {
        const data = await response.json();
        res.json(data);
      } else {
        throw new Error('Failed to fetch states');
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      res.status(500).json({ error: "Failed to fetch states" });
    }
  });

  app.get("/api/cities", async (req, res) => {
    try {
      const { country_code, state_code } = req.query;
      if (!country_code || !state_code) {
        return res.status(400).json({ error: "country_code and state_code parameters are required" });
      }

      const response = await fetch(`${API_ENDPOINTS.GEO_CITIES}?country_code=${country_code}&state_code=${state_code}`);
      if (response.ok) {
        const data = await response.json();
        res.json(data);
      } else {
        throw new Error('Failed to fetch cities');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ error: "Failed to fetch cities" });
    }
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

  // User endpoints for chat fallback
  app.get("/api/users/:uid", async (req, res) => {
    try {
      const { uid } = req.params;
      
      // Create a mock user for any Firebase UID  
      const mockUser = {
        id: uid,
        uid: uid,
        email: `user${uid.slice(0, 8)}@example.com`,
        firstName: `User`,
        lastName: uid.slice(0, 8),
        username: `user_${uid.slice(0, 8)}`,
        photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(`User ${uid.slice(0, 8)}`)}&background=0D8ABC&color=fff`,
        profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(`User ${uid.slice(0, 8)}`)}&background=0D8ABC&color=fff`,
        isActive: Math.random() > 0.5, // Random online status
        hasBasicInfo: true,
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      res.json(mockUser);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}