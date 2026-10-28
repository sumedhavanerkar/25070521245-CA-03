import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import itemRoutes from './routes/items.js';
import authRoutes from './routes/auth.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & utilities ──────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow mobile apps, curl, Postman, server-to-server requests
      if (!origin) return callback(null, true);

      // Allow any localhost, 127.0.0.1, or Vercel preview/production domains
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.vercel.app') ||
        (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
      ) {
        return callback(null, true);
      }

      // Safe fallback: allow origin for student project
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ── Ensure DB Connection for Serverless & Containers ──────────────────────────
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api') && req.path !== '/api/health') {
    try {
      await connectDB();
    } catch (err) {
      console.error('Database connection middleware error:', err.message);
      return res.status(503).json({
        success: false,
        message:
          'Database connection unavailable. Please check that MONGODB_URI is added in Vercel Project Settings > Environment Variables, and that MongoDB Atlas allows access from all IPs (0.0.0.0/0).',
        error: err.message,
      });
    }
  }
  next();
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  let dbStatus = dbStates[mongoose.connection.readyState] || 'unknown';

  // Attempt connection if disconnected
  if (mongoose.connection.readyState === 0) {
    try {
      await connectDB();
      dbStatus = dbStates[mongoose.connection.readyState] || 'connected';
    } catch (err) {
      dbStatus = `connection failed: ${err.message}`;
    }
  }

  res.json({
    success: true,
    status: 'ok',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    serverless: !!process.env.VERCEL,
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ message: 'Campus Lost & Found API is running 🎓' }));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server (Local execution only; Vercel handles invocation) ─────────────
if (!process.env.VERCEL) {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`\n🚀 Server running on http://localhost:${PORT}`);
        console.log(`📡 API base: http://localhost:${PORT}/api`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
      });
    } catch (err) {
      console.error('❌ Failed to start server locally:', err.message);
      console.error('\n💡 Make sure you have:');
      console.error('   1. Copied server/.env.example to server/.env');
      console.error('   2. Set a valid MONGODB_URI in server/.env');
      console.error('   3. Whitelisted your IP in MongoDB Atlas Network Access\n');
    }
  };

  startServer();
}

export default app;
