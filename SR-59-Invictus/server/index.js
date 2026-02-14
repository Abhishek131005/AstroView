import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

// Import routes
import nasaRoutes from './routes/nasa.js';
import satelliteRoutes from './routes/satellite.js';
import astronomyRoutes from './routes/astronomy.js';
import weatherRoutes from './routes/weather.js';
import aiRoutes from './routes/ai.js';

// Import error handlers
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

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
    }
  });
});

// Register API routes
app.use('/api/nasa', nasaRoutes);
app.use('/api/satellite', satelliteRoutes);
app.use('/api/astronomy', astronomyRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/ai', aiRoutes);

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
