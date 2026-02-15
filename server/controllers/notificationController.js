import { asyncHandler } from '../middleware/errorHandler.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure NodeMailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error.message);
    console.log('💡 Please configure EMAIL_* variables in .env file');
  } else {
    console.log('✅ Email service ready to send notifications');
  }
});

// Simple file-based storage for email subscriptions
// In production, use a database like MongoDB or PostgreSQL
const SUBSCRIPTIONS_FILE = path.join(__dirname, '../data/email-subscriptions.json');

/**
 * Get all subscriptions
 */
async function getSubscriptions() {
  try {
    const data = await fs.readFile(SUBSCRIPTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

/**
 * Save subscriptions
 */
async function saveSubscriptions(subscriptions) {
  const dir = path.dirname(SUBSCRIPTIONS_FILE);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
  } catch (error) {
    console.error('Error saving subscriptions:', error);
    throw error;
  }
}

/**
 * Subscribe to email notifications
 * POST /api/notifications/subscribe
 */
export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid email address is required',
    });
  }

  const subscriptions = await getSubscriptions();

  // Check if already subscribed
  const existingIndex = subscriptions.findIndex(sub => sub.email.toLowerCase() === email.toLowerCase());

  if (existingIndex >= 0) {
    // Update subscription timestamp
    subscriptions[existingIndex] = {
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      active: true,
    };
  } else {
    // Add new subscription
    subscriptions.push({
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      active: true,
    });
  }

  await saveSubscriptions(subscriptions);

  // Send welcome email
  const isNewSubscription = existingIndex === -1;
  if (isNewSubscription) {
    // Send welcome email for new subscribers
    await sendWelcomeEmail(email.toLowerCase());
  }

  res.json({
    success: true,
    message: 'Successfully subscribed to email notifications',
    email: email.toLowerCase(),
  });
});

/**
 * Unsubscribe from email notifications
 * POST /api/notifications/unsubscribe
 */
export const unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email address is required',
    });
  }

  const subscriptions = await getSubscriptions();
  const updatedSubscriptions = subscriptions.filter(
    sub => sub.email.toLowerCase() !== email.toLowerCase()
  );

  await saveSubscriptions(updatedSubscriptions);

  res.json({
    success: true,
    message: 'Successfully unsubscribed from email notifications',
  });
});

/**
 * Get active subscriptions (for sending emails)
 * GET /api/notifications/active
 */
export const getActiveSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await getSubscriptions();
  const activeSubscriptions = subscriptions.filter(sub => sub.active);

  res.json({
    success: true,
    count: activeSubscriptions.length,
    subscriptions: activeSubscriptions.map(sub => ({
      email: sub.email,
      subscribedAt: sub.subscribedAt,
    })),
  });
});

/**
 * Send a test email (for testing email configuration)
 * POST /api/notifications/test
 */
export const sendTestEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid email address is required',
    });
  }

  // Create a test event
  const testEvent = {
    name: 'ISS Pass Over Your Location',
    type: 'ISS Pass',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    description: 'The International Space Station will pass over your location tomorrow evening. This is a test notification from AstroView to verify your email settings are working correctly.',
    visibility: 'Visible to the naked eye',
    viewingInstructions: 'Look towards the northwestern sky around 7:30 PM local time. The ISS will appear as a bright, fast-moving star. It will be visible for approximately 4-6 minutes.',
  };

  const result = await sendNotificationEmail(email, testEvent);

  if (result.success) {
    res.json({
      success: true,
      message: 'Test email sent successfully! Check your inbox.',
      messageId: result.messageId,
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to send test email. Please check your email configuration in .env file.',
      error: result.error,
    });
  }
});

/**
 * Send welcome email to new subscribers
 */
async function sendWelcomeEmail(email) {
  try {
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: email,
      subject: '🎉 Welcome to AstroView Alerts - Subscription Confirmed!',
      html: generateWelcomeEmailHTML(email),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${email}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send notification email (utility function)
 */
export async function sendNotificationEmail(email, event) {
  try {
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: email,
      subject: `🚀 Upcoming Space Event: ${event.name}`,
      html: generateEmailHTML(event),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Generate HTML email template for event notifications
 */
function generateEmailHTML(event) {
  const eventIcon = getEventIcon(event.type);
  const eventColor = getEventColor(event.type);
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${event.name}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0B0D17; color: #E8EAED;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0D17;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1B1D2A; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.3);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #4F9CF7 0%, #7C5CFC 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    ${eventIcon} AstroView Alert
                  </h1>
                </td>
              </tr>
              
              <!-- Event Badge -->
              <tr>
                <td style="padding: 30px 30px 10px 30px;">
                  <div style="display: inline-block; background-color: ${eventColor}15; color: ${eventColor}; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${event.type}
                  </div>
                </td>
              </tr>
              
              <!-- Event Name -->
              <tr>
                <td style="padding: 10px 30px;">
                  <h2 style="margin: 0; color: #E8EAED; font-size: 24px; font-weight: bold;">
                    ${event.name}
                  </h2>
                </td>
              </tr>
              
              <!-- Event Date -->
              <tr>
                <td style="padding: 15px 30px;">
                  <div style="background-color: #252840; border-left: 4px solid ${eventColor}; padding: 15px 20px; border-radius: 8px;">
                    <p style="margin: 0; color: #9AA0A6; font-size: 14px; font-weight: 600;">
                      📅 ${formatEventDate(event.date)}
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Description -->
              <tr>
                <td style="padding: 20px 30px;">
                  <p style="margin: 0; color: #9AA0A6; font-size: 16px; line-height: 1.6;">
                    ${event.description || 'No additional details available.'}
                  </p>
                </td>
              </tr>
              
              ${event.viewingInstructions ? `
              <!-- Viewing Instructions -->
              <tr>
                <td style="padding: 20px 30px;">
                  <div style="background-color: #00E67615; border: 1px solid #00E67630; border-radius: 8px; padding: 20px;">
                    <p style="margin: 0 0 10px 0; color: #00E676; font-size: 14px; font-weight: 600;">
                      👁️ VIEWING INSTRUCTIONS
                    </p>
                    <p style="margin: 0; color: #E8EAED; font-size: 14px; line-height: 1.6;">
                      ${event.viewingInstructions}
                    </p>
                  </div>
                </td>
              </tr>
              ` : ''}
              
              ${event.visibility ? `
              <!-- Visibility Info -->
              <tr>
                <td style="padding: 15px 30px;">
                  <p style="margin: 0; color: #9AA0A6; font-size: 14px;">
                    <strong style="color: #E8EAED;">Visibility:</strong> ${event.visibility}
                  </p>
                </td>
              </tr>
              ` : ''}
              
              <!-- CTA Button -->
              <tr>
                <td style="padding: 30px; text-align: center;">
                  <a href="http://localhost:5173/" style="display: inline-block; background: linear-gradient(135deg, #4F9CF7 0%, #7C5CFC 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                    View in AstroView
                  </a>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #0B0D17; padding: 20px 30px; text-align: center; border-top: 1px solid #252840;">
                  <p style="margin: 0 0 10px 0; color: #5F6368; font-size: 12px;">
                    You're receiving this because you subscribed to AstroView alerts.
                  </p>
                  <p style="margin: 0; color: #5F6368; font-size: 12px;">
                    <a href="http://localhost:5173/" style="color: #4F9CF7; text-decoration: none;">Manage Preferences</a> • 
                    <a href="http://localhost:5173/" style="color: #4F9CF7; text-decoration: none;">Unsubscribe</a>
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Get icon for event type
 */
function getEventIcon(type) {
  const icons = {
    'ISS Pass': '🛰️',
    'Moon Phase': '🌙',
    'Planet': '🪐',
    'Solar Event': '☀️',
    'Aurora': '🌌',
    'Meteor Shower': '☄️',
    'Eclipse': '🌑',
    'Conjunction': '✨',
  };
  return icons[type] || '🚀';
}

/**
 * Get color for event type
 */
function getEventColor(type) {
  const colors = {
    'ISS Pass': '#4F9CF7',
    'Moon Phase': '#FFB800',
    'Planet': '#7C5CFC',
    'Solar Event': '#FF5252',
    'Aurora': '#00E676',
    'Meteor Shower': '#4F9CF7',
    'Eclipse': '#9AA0A6',
    'Conjunction': '#FFB800',
  };
  return colors[type] || '#4F9CF7';
}

/**
 * Format event date for email
 */
function formatEventDate(dateString) {
  const date = new Date(dateString);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  };
  return date.toLocaleString('en-US', options);
}

/**
 * Generate welcome email HTML template
 */
function generateWelcomeEmailHTML(email) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to AstroView</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0B0D17; color: #E8EAED;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0D17;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1B1D2A; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.3);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #4F9CF7 0%, #7C5CFC 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                    🚀 Welcome to AstroView!
                  </h1>
                  <p style="margin: 0; color: #E8EAED; font-size: 16px; opacity: 0.9;">
                    Your cosmic journey begins now
                  </p>
                </td>
              </tr>
              
              <!-- Success Badge -->
              <tr>
                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                  <div style="display: inline-block; background-color: #00E67620; border: 2px solid #00E676; padding: 12px 24px; border-radius: 30px;">
                    <span style="color: #00E676; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">
                      ✓ SUBSCRIPTION CONFIRMED
                    </span>
                  </div>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 10px 40px 30px 40px;">
                  <p style="margin: 0 0 20px 0; color: #E8EAED; font-size: 16px; line-height: 1.6; text-align: center;">
                    Thank you for subscribing to AstroView alerts! You'll now receive email notifications about:
                  </p>
                  
                  <!-- Features List -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                    <tr>
                      <td style="padding: 15px; background-color: #252840; border-left: 4px solid #4F9CF7; border-radius: 8px; margin-bottom: 10px;">
                        <p style="margin: 0; color: #E8EAED; font-size: 15px;">
                          <strong style="color: #4F9CF7;">🛰️ ISS Passes</strong><br>
                          <span style="color: #9AA0A6; font-size: 14px;">Real-time tracking when the International Space Station passes over your location</span>
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 10px 0;">
                    <tr>
                      <td style="padding: 15px; background-color: #252840; border-left: 4px solid #FFB800; border-radius: 8px;">
                        <p style="margin: 0; color: #E8EAED; font-size: 15px;">
                          <strong style="color: #FFB800;">🌙 Moon Phases</strong><br>
                          <span style="color: #9AA0A6; font-size: 14px;">Full moons, new moons, and special lunar events</span>
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 10px 0;">
                    <tr>
                      <td style="padding: 15px; background-color: #252840; border-left: 4px solid #7C5CFC; border-radius: 8px;">
                        <p style="margin: 0; color: #E8EAED; font-size: 15px;">
                          <strong style="color: #7C5CFC;">🪐 Planet Visibility</strong><br>
                          <span style="color: #9AA0A6; font-size: 14px;">When Mars, Jupiter, Venus, and Saturn are visible in your night sky</span>
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 10px 0;">
                    <tr>
                      <td style="padding: 15px; background-color: #252840; border-left: 4px solid #00E676; border-radius: 8px;">
                        <p style="margin: 0; color: #E8EAED; font-size: 15px;">
                          <strong style="color: #00E676;">🌌 Aurora & Solar Events</strong><br>
                          <span style="color: #9AA0A6; font-size: 14px;">Solar flares, geomagnetic storms, and aurora borealis forecasts</span>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Info Box -->
              <tr>
                <td style="padding: 20px 40px;">
                  <div style="background-color: #4F9CF715; border: 1px solid #4F9CF730; border-radius: 12px; padding: 20px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #4F9CF7; font-size: 14px; font-weight: 600;">
                      ⏰ NOTIFICATION TIMING
                    </p>
                    <p style="margin: 0; color: #9AA0A6; font-size: 14px; line-height: 1.5;">
                      You'll receive alerts <strong style="color: #E8EAED;">24 hours before</strong> each celestial event, giving you plenty of time to prepare for viewing.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- CTA Button -->
              <tr>
                <td style="padding: 30px 40px; text-align: center;">
                  <a href="http://localhost:5173/" style="display: inline-block; background: linear-gradient(135deg, #4F9CF7 0%, #7C5CFC 100%); color: #ffffff; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79,156,247,0.3);">
                    Explore AstroView
                  </a>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #0B0D17; padding: 30px 40px; text-align: center; border-top: 1px solid #252840;">
                  <p style="margin: 0 0 15px 0; color: #9AA0A6; font-size: 14px; line-height: 1.6;">
                    <strong style="color: #E8EAED;">Subscribed Email:</strong> ${email}
                  </p>
                  <p style="margin: 0 0 10px 0; color: #5F6368; font-size: 12px;">
                    You're receiving this because you subscribed to AstroView alerts.
                  </p>
                  <p style="margin: 0; color: #5F6368; font-size: 12px;">
                    <a href="http://localhost:5173/" style="color: #4F9CF7; text-decoration: none;">Manage Preferences</a> • 
                    <a href="http://localhost:5173/" style="color: #4F9CF7; text-decoration: none;">Unsubscribe</a>
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Helper: Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
