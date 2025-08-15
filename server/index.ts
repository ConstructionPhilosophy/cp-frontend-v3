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

// Emergency HTML with inline CSS - serve BEFORE static files
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>Professional Networking Platform - STYLED</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      :root {
        --background: hsl(0 0% 100%);
        --foreground: hsl(0 0% 10.2%);
        --primary: hsl(217 89% 61%);
        --border: hsl(0 0% 87.8%);
        --cmo-primary: hsl(217 89% 61%);
        --cmo-bg-main: hsl(0 0% 98%);
        --cmo-bg-card: hsl(0 0% 100%);
        --cmo-text-primary: hsl(0 0% 10.2%);
        --cmo-text-secondary: hsl(0 0% 40%);
        --cmo-border: hsl(0 0% 87.8%);
        --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
      }
      * { 
        box-sizing: border-box; 
        margin: 0; 
        padding: 0; 
      }
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: var(--font-sans);
        color: var(--cmo-text-primary);
        line-height: 1.5;
        min-height: 100vh;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      #root { 
        min-height: 100vh; 
        background: var(--cmo-bg-main);
      }
      .test-message {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ff0000;
        color: white;
        padding: 10px;
        text-align: center;
        font-weight: bold;
        z-index: 9999;
      }
    </style>
</head>
<body>
    <div class="test-message">CSS IS WORKING - STYLED VERSION LOADED!</div>
    <div id="root"></div>
    <script type="module" crossorigin src="/assets/index-DRud4M9E.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-DmExVhvI.css">
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



// Fallback for SPA routes - only for non-API and non-asset routes
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/assets/')) {
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