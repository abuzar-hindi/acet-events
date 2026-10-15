// server.js — Express application entry point
require('dotenv').config();

const express      = require('express');
const mongoose     = require('mongoose');
const cors         = require('cors');
const helmet       = require('helmet');
const path         = require('path');
const rateLimit    = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const eventRoutes      = require('./routes/eventRoutes');
const facultyRoutes    = require('./routes/facultyRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const organizerRoutes  = require('./routes/organizerRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security & parsing middleware ──────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow serving uploads
}));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173,http://localhost:3001')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl) or whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('CORS: origin not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-organizer-token', 'x-organizer-password'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' })); // Support base64 photos in organizer management
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Rate limiting ──────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ── Static: serve uploaded signature images ────────────────
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), { maxAge: '1d' })
);

// ── API routes ─────────────────────────────────────────────
app.use('/api/events',      eventRoutes);
app.use('/api/faculty',     facultyRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/organizer',   organizerRoutes);

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ── Global error handler ───────────────────────────────────
app.use(errorHandler);

// ── MongoDB connection + server start ──────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/acet_dandiya';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`✅  MongoDB connected: ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });
