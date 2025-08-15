import express from "express";
import { registerRoutes } from "./routes";

async function startSimpleServer() {
  const app = express();
  
  // Enable JSON parsing
  app.use(express.json());
  
  // Test endpoint
  app.get("/", (req, res) => {
    res.json({ message: "Server is running!", timestamp: new Date().toISOString() });
  });
  
  // Register API routes
  registerRoutes(app);
  
  const PORT = parseInt(process.env.PORT || '5000', 10);
  const HOST = process.env.HOST || '0.0.0.0';
  
  app.listen(PORT, HOST, () => {
    console.log(`Simple server running on ${HOST}:${PORT}`);
  });
}

startSimpleServer().catch(console.error);