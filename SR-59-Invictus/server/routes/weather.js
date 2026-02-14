import express from 'express';
import { cacheMiddleware } from '../middleware/cache.js';
import { getSkyConditions } from '../controllers/weatherController.js';

const router = express.Router();

// Sky Conditions - Cache for 30 minutes
router.get('/sky', cacheMiddleware(1800), getSkyConditions);

export default router;
