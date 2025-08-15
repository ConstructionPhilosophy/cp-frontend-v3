import express from "express";
import { registerRoutes } from "./routes";
import path from "path";

async function startServer() {
  try {
    // Create Express app for API routes
    const app = express();
    
    // API routes middleware - add JSON parsing
    app.use('/api', express.json());
    
    // Register API routes
    registerRoutes(app);
    
    // Serve static files from the built client directory
    const staticPath = path.join(process.cwd(), 'dist', 'public');
    app.use(express.static(staticPath));
    
    // Handle root route
    app.get('/', (req, res) => {
      res.sendFile(path.join(staticPath, 'index.html'));
    });

    const PORT = parseInt(process.env.PORT || '5000', 10);
    
    const server = app.listen(PORT, (error?: Error) => {
      if (error) {
        console.error("Failed to start server:", error);
        return;
      }
      console.log(`Dev server running on 0.0.0.0:${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error("Server error:", error);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});