import express from 'express';
import { cacheMiddleware } from '../middleware/cache.js';
import {
  getISSPosition,
  getSatellitePasses,
  getOverheadSatellites,
} from '../controllers/satelliteController.js';

const router = express.Router();

// ISS Position - Cache for 10 seconds (real-time)
router.get('/iss', cacheMiddleware(10), getISSPosition);

// Satellite Passes - Cache for 12 hours
router.get('/passes', cacheMiddleware(43200), getSatellitePasses);

// Overhead Satellites - Cache for 5 minutes
router.get('/overhead', cacheMiddleware(300), getOverheadSatellites);

export default router;
