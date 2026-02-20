// Load environment variables FIRST - before any other imports
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

console.log('📂 Loading .env from:', envPath);
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
  console.error('❌ Error loading .env:', envResult.error);
} else {
  console.log('✅ .env loaded successfully');
}

console.log('=== Environment Variables Loaded ===');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 15)}...` : 'NOT SET');
console.log('N2YO_API_KEY:', process.env.N2YO_API_KEY ? `${process.env.N2YO_API_KEY.substring(0, 15)}...` : 'NOT SET');
console.log('NASA_API_KEY:', process.env.NASA_API_KEY ? `${process.env.NASA_API_KEY.substring(0, 15)}...` : 'NOT SET');
console.log('====================================');

// Now import everything else
import express from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';

// Import routes
import nasaRoutes from './routes/nasa.js';
import satelliteRoutes from './routes/satellite.js';
import astronomyRoutes from './routes/astronomy.js';
import weatherRoutes from './routes/weather.js';
import aiRoutes from './routes/ai.js';
import notificationRoutes from './routes/notifications.js';

// Import error handlers
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize cache (TTL in seconds, check period in seconds)
export const cache = new NodeCache({ 
  stdTTL: 600, // Default 10 minutes
  checkperiod: 120 // Check for expired keys every 2 minutes
});

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'AstroView API',
    version: '1.0.0',
    status: 'running',
    docs: '/api',
    health: '/health',
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    cache: {
      keys: cache.keys().length,
      stats: cache.getStats()
    }
  });
});

// Base API route - info endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'AstroView API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      nasa: {
        apod: '/api/nasa/apod',
        neo: '/api/nasa/neo',
        solarFlares: '/api/nasa/solar-flares',
        geomagneticStorms: '/api/nasa/geomagnetic-storms',
        cme: '/api/nasa/cme',
        eonet: '/api/nasa/eonet',
      },
      satellite: {
        iss: '/api/satellite/iss',
        passes: '/api/satellite/passes',
        overhead: '/api/satellite/overhead',
      },
      astronomy: {
        moonPhase: '/api/astronomy/moon-phase',
        planets: '/api/astronomy/planets',
      },
      weather: {
        sky: '/api/weather/sky',
      },
      ai: {
        simplify: '/api/ai/simplify [POST]',
        ask: '/api/ai/simplify/ask [POST]',
      },
      notifications: {
        subscribe: '/api/notifications/subscribe [POST]',
        unsubscribe: '/api/notifications/unsubscribe [POST]',
        active: '/api/notifications/active [GET]',
      },
    }
  });
});

// Register API routes
app.use('/api/nasa', nasaRoutes);
app.use('/api/satellite', satelliteRoutes);
app.use('/api/astronomy', astronomyRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AstroView API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
