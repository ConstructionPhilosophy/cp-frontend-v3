import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertSecurityAssessmentSchema } from "../shared/schema";

export function registerRoutes(app: Express): Server {
  // Get current user (mocked for now)
  app.get("/api/user", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser("user-1");
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user's security assessments
  app.get("/api/security/assessments", async (req: Request, res: Response) => {
    try {
      const userId = "user-1"; // In real app, get from auth
      const assessments = await storage.getUserAssessments(userId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  // Get specific assessment with recommendations
  app.get("/api/security/assessments/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const assessment = await storage.getSecurityAssessment(id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      const recommendations = await storage.getAssessmentRecommendations(id);
      res.json({ ...assessment, recommendations });
    } catch (error) {
      console.error("Error fetching assessment:", error);
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  // Get security metrics for user
  app.get("/api/security/metrics", async (req: Request, res: Response) => {
    try {
      const userId = "user-1"; // In real app, get from auth
      const { metricType } = req.query;
      const metrics = await storage.getUserMetrics(userId, metricType as string);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Update recommendation implementation status
  app.patch("/api/security/recommendations/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateSchema = z.object({
        isImplemented: z.boolean().optional(),
        implementationNotes: z.string().optional(),
      });

      const updateData = updateSchema.parse(req.body);
      if (updateData.isImplemented) {
        (updateData as any).implementedAt = new Date();
      }

      const updated = await storage.updateRecommendation(id, updateData);
      if (!updated) {
        return res.status(404).json({ message: "Recommendation not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating recommendation:", error);
      res.status(500).json({ message: "Failed to update recommendation" });
    }
  });

  // Create new security assessment (for demo purposes)
  app.post("/api/security/assessments", async (req: Request, res: Response) => {
    try {
      const assessmentData = insertSecurityAssessmentSchema.parse(req.body);
      const assessment = await storage.createSecurityAssessment(assessmentData);
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}