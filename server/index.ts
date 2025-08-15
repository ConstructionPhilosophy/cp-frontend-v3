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

    // Cloud Run deployment configuration
    const isDeployment = process.env.REPLIT_DEPLOYMENT === '1';
    const isProduction = process.env.NODE_ENV === 'production' || isDeployment;
    
    // For Cloud Run: use PORT env var, fallback to 80 for production, 5000 for dev
    let PORT: number;
    if (process.env.PORT) {
      PORT = parseInt(process.env.PORT, 10);
    } else {
      PORT = isProduction ? 80 : 5000;
    }
    
    // Always bind to 0.0.0.0 for Cloud Run compatibility - never localhost
    const HOST = '0.0.0.0';
    
    console.log(`Environment Detection:`);
    console.log(`  REPLIT_DEPLOYMENT: ${process.env.REPLIT_DEPLOYMENT || 'undefined'}`);
    console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
    console.log(`  PORT env var: ${process.env.PORT || 'undefined'}`);
    console.log(`  Is Deployment: ${isDeployment}`);
    console.log(`  Is Production: ${isProduction}`);
    console.log(`Server Configuration:`);
    console.log(`  Host: ${HOST}`);
    console.log(`  Port: ${PORT}`);
    
    const server = app.listen(PORT, HOST, (error?: Error) => {
      if (error) {
        console.error("❌ Failed to start server:", error);
        console.error("❌ Error details:", error.message);
        process.exit(1);
      }
      console.log(`✅ Server successfully bound to ${HOST}:${PORT}`);
      console.log(`✅ Server address: ${server.address()}`);
      console.log(`✅ Environment: ${isProduction ? 'production' : 'development'} mode`);
      console.log(`✅ Deployment context: ${isDeployment ? 'Cloud Run' : 'Local'}`);
      console.log(`✅ Ready to accept connections`);
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