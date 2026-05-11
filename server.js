const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const moodRoutes = require('./app/api/routes/mood');
const statsRoutes = require('./app/api/routes/stats');
const privacyRoutes = require('./app/api/routes/privacy');
const interventionRoutes = require('./app/api/routes/intervention');
const { setupWebSocket } = require('./app/services/websocketManager');
const { anonymizeRequest } = require('./app/middleware/encryption');
const connectDB = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Privacy-first middleware - anonymize all requests
app.use(anonymizeRequest);

// Connect to database
connectDB();

// Routes
app.use('/api/mood', moodRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/intervention', interventionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    version: '2.0.0',
    privacy: 'zero-pii-enabled'
  });
});

// WebSocket setup for real-time updates
setupWebSocket(io);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    requestId: req.id
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 AuraCampus Backend running on port ${PORT}`);
  console.log(`🔒 Zero PII Mode: Active`);
  console.log(`📡 WebSocket ready for real-time updates`);
});

module.exports = { app, server, io };