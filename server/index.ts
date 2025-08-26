import express from "express";
import { registerRoutes } from "./routes";
import path from "path";
import fs from "fs";

// Create Express app
const app = express();

// API routes middleware
app.use('/api', express.json());

// Register API routes FIRST - before static files
registerRoutes(app);

// Debug endpoint to check server state
app.get('/api/debug', (req, res) => {
  const staticPath = path.join(process.cwd(), 'dist', 'public');
  res.json({ 
    timestamp: new Date().toISOString(),
    message: 'Server running with emergency inline CSS fix',
    staticPath,
    deployment: !!process.env.REPLIT_DEPLOYMENT,
    nodeEnv: process.env.NODE_ENV,
    htmlExists: fs.existsSync(path.join(staticPath, 'index.html'))
  });
});

// Test route to verify CSS is working
app.get('/test-css', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html>
<head>
    <title>CSS Test</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/index-DmExVhvI.css">
    <style>
      body { font-family: 'Inter', sans-serif; margin: 20px; }
      .test-bg { background-color: var(--cmo-bg-main, #f8f9fa); padding: 20px; }
      .test-text { color: var(--cmo-primary, #4285f4); font-size: 24px; }
    </style>
</head>
<body>
    <div class="test-bg">
        <h1 class="test-text">CSS Test Page</h1>
        <p>If you see styled text with Inter font and light gray background, CSS is working.</p>
        <div class="bg-blue-500 text-white p-4 rounded-lg mt-4">
            This should be blue with white text if Tailwind CSS is working.
        </div>
    </div>
</body>
</html>`);
});

// Serve static files from the built client directory with cache-busting headers
const staticPath = path.join(process.cwd(), 'dist', 'public');
app.use(express.static(staticPath, {
  maxAge: 0,
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Force fresh CSS and JS files - no caching during development
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));



// Fallback for SPA routes - serve the built React app for all routes
app.use((req, res, next) => {
  // Skip API routes and assets
  if (req.path.startsWith('/api/') || req.path.startsWith('/assets/') || req.path === '/test-css') {
    return next();
  }
  
  // Serve the built React app
  const indexPath = path.join(staticPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

// Deployment-ready server configuration
// Use port 5000 for development, port 80 for production deployment
const PORT = parseInt(process.env.PORT || (process.env.NODE_ENV === 'production' ? '80' : '5000'), 10);

console.log(`Starting server on port ${PORT}...`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Replit Deployment: ${process.env.REPLIT_DEPLOYMENT || 'false'}`);
console.log(`Port from env: ${process.env.PORT || 'not set'}`);
console.log(`Node version: ${process.version}`);
console.log(`Available memory: ${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});

server.on('error', (error: any) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
  } else if (error.code === 'EACCES') {
    console.error(`Permission denied to bind to port ${PORT}. Try running with elevated privileges or use a port >= 1024.`);
  } else if (error.code === 'ENOTFOUND') {
    console.error(`Unable to bind to address 0.0.0.0. Check network configuration.`);
  }
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