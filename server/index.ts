import { createServer } from "vite";
import express from "express";
import { registerRoutes } from "./routes";
import path from "path";

async function startServer() {
  // Create Express app for API routes
  const app = express();
  
  // Create Vite dev server first
  const vite = await createServer({
    root: path.resolve("."),
    server: { middlewareMode: true },
    resolve: {
      alias: {
        "@": path.resolve("./src"),
        "@assets": path.resolve("./attached_assets"),
        "@shared": path.resolve("./shared"),
      },
    },
  });

  // Use Vite's connect instance as middleware for frontend
  app.use(vite.ssrFixStacktrace);
  
  // API routes middleware - add JSON parsing
  app.use('/api', express.json());
  
  // Register API routes
  registerRoutes(app);
  
  // Use Vite middleware for everything else (frontend)
  app.use(vite.middlewares);

  const PORT = parseInt(process.env.PORT || '5000', 10);
  const HOST = process.env.HOST || '0.0.0.0';
  
  app.listen(PORT, HOST, () => {
    console.log(`Dev server running on ${HOST}:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});