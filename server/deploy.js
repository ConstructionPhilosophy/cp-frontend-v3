// Minimal deployment-focused server for troubleshooting
const express = require('express');
const path = require('path');

const app = express();

// Basic middleware
app.use('/api', express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: process.env.PORT,
    host: '0.0.0.0',
    deployment: process.env.REPLIT_DEPLOYMENT === '1'
  });
});

// Serve static files
const staticPath = path.join(process.cwd(), 'dist', 'public');
app.use(express.static(staticPath));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Simple port and host configuration
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

console.log(`Starting minimal server...`);
console.log(`PORT: ${PORT}, HOST: ${HOST}`);
console.log(`REPLIT_DEPLOYMENT: ${process.env.REPLIT_DEPLOYMENT}`);

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});