import express from 'express';
import { cacheMiddleware } from '../middleware/cache.js';
import { simplifyText, askQuestion } from '../controllers/aiController.js';

const router = express.Router();

// Simplify Text - Cache for 24 hours (based on text hash)
router.post('/simplify', cacheMiddleware(86400), simplifyText);

// Ask Question - Cache for 24 hours
router.post('/simplify/ask', cacheMiddleware(86400), askQuestion);

export default router;
