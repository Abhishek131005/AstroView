import express from 'express';
import { cacheMiddleware } from '../middleware/cache.js';
import {
  getMoonPhase,
  getPlanetPositions,
} from '../controllers/astronomyController.js';

const router = express.Router();

// Moon Phase - Cache for 1 hour
router.get('/moon-phase', cacheMiddleware(3600), getMoonPhase);

// Planet Positions - Cache for 1 hour
router.get('/planets', cacheMiddleware(3600), getPlanetPositions);

export default router;
