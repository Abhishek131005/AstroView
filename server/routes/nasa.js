import express from 'express';
import { cacheMiddleware } from '../middleware/cache.js';
import {
  getAPOD,
  getNearEarthObjects,
  getSolarFlares,
  getGeomagneticStorms,
  getCME,
  getEONETEvents,
} from '../controllers/nasaController.js';

const router = express.Router();

// APOD - Cache for 24 hours
router.get('/apod', cacheMiddleware(86400), getAPOD);

// Near Earth Objects - Cache for 6 hours
router.get('/neo', cacheMiddleware(21600), getNearEarthObjects);

// Solar Flares - Cache for 2 hours (increased from 30 min)
router.get('/solar-flares', cacheMiddleware(7200), getSolarFlares);

// Geomagnetic Storms - Cache for 2 hours (increased from 30 min)
router.get('/geomagnetic-storms', cacheMiddleware(7200), getGeomagneticStorms);

// Coronal Mass Ejections - Cache for 2 hours (increased from 30 min)
router.get('/cme', cacheMiddleware(7200), getCME);

// EONET Events - Cache for 1 hour
router.get('/eonet', cacheMiddleware(3600), getEONETEvents);

export default router;
