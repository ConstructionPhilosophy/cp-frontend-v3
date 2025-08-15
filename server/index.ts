import express from "express";
import { registerRoutes } from "./routes";
import path from "path";

// Create Express app
const app = express();

// API routes middleware
app.use('/api', express.json());

// Register API routes
registerRoutes(app);

// Serve static files from the built client directory
const staticPath = path.join(process.cwd(), 'dist', 'public');
app.use(express.static(staticPath));

// SPA fallback - serve index.html for non-API routes
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Fallback for SPA routes (avoid catch-all that causes path-to-regexp issues)
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(staticPath, 'index.html'));
  } else {
    next();
  }
});

// Deployment-ready server configuration
const PORT = parseInt(process.env.PORT || '8080', 10);

console.log(`Starting server on port ${PORT}...`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Replit Deployment: ${process.env.REPLIT_DEPLOYMENT || 'false'}`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});