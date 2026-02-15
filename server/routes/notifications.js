import express from 'express';
import { subscribe, unsubscribe, getActiveSubscriptions, sendTestEmail } from '../controllers/notificationController.js';

const router = express.Router();

// Subscribe to email notifications
router.post('/subscribe', subscribe);

// Unsubscribe from email notifications
router.post('/unsubscribe', unsubscribe);

// Get active subscriptions (for admin/debugging)
router.get('/active', getActiveSubscriptions);

// Send a test email (for testing email configuration)
router.post('/test', sendTestEmail);

export default router;
