# 📧 Email Notification Setup Guide

NodeMailer is now integrated into AstroView! Follow these steps to configure email notifications.

## 🚀 Quick Setup (Gmail)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)** → Enter "AstroView"
4. Click **Generate**
5. Copy the 16-character app password (no spaces)

### Step 3: Update .env File
Open `server/.env` and update these values:

```env
# Email Configuration (NodeMailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com          # Your Gmail address
EMAIL_PASSWORD=abcd efgh ijkl mnop        # Your 16-character app password
EMAIL_FROM_NAME=AstroView Alerts
EMAIL_FROM_ADDRESS=your-email@gmail.com  # Same as EMAIL_USER
```

### Step 4: Restart Server
```bash
cd server
npm start
```

You should see: `✅ Email service ready to send notifications`

---

## 🧪 Testing Email Configuration

### Method 1: Via Frontend UI
1. Open http://localhost:5173/
2. Click the hamburger menu (☰) in top-right
3. Enter your email address
4. Click **"Send Test Email"**
5. Check your inbox (and spam folder)

### Method 2: Via API (Postman/Thunder Client)
```http
POST http://localhost:3001/api/notifications/test
Content-Type: application/json

{
  "email": "your-email@gmail.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully! Check your inbox.",
  "messageId": "<unique-id>"
}
```

---

## 📬 What Gets Sent

Test emails include:
- **Subject:** 🚀 Upcoming Space Event: ISS Pass Over Your Location
- **Styled HTML template** with AstroView branding
- Event details (name, date, description, viewing instructions)
- Unsubscribe link

---

## 🔧 Using Other Email Providers

### Outlook/Office 365
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Custom SMTP Server
```env
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587               # or 465 for SSL
EMAIL_SECURE=false           # true for port 465
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-smtp-password
```

---

## ❌ Troubleshooting

### Error: "Invalid login: 535-5.7.8"
- ❌ Using regular Gmail password (won't work)
- ✅ **Solution:** Generate and use App Password (see Step 2)

### Error: "Connection timeout"
- Check firewall settings
- Verify EMAIL_HOST and EMAIL_PORT
- Try EMAIL_PORT=465 with EMAIL_SECURE=true

### Error: "Self-signed certificate"
```javascript
// Add to nodemailer config (not recommended for production)
tls: {
  rejectUnauthorized: false
}
```

### Emails Going to Spam
- Add AstroView to your contacts
- Mark first email as "Not Spam"
- Configure SPF/DKIM records (for production)

---

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications/subscribe` | POST | Subscribe to email alerts |
| `/api/notifications/unsubscribe` | POST | Unsubscribe from alerts |
| `/api/notifications/active` | GET | List active subscriptions |
| `/api/notifications/test` | POST | Send test email |

---

## 🎯 Next Steps

1. **Set up scheduled notifications** - Use node-cron to send emails 24h before events
2. **Implement email templates** - Create multiple templates for different event types
3. **Add email verification** - Send confirmation email on subscription
4. **Track email analytics** - Log open rates, clicks, etc.
5. **Production deployment** - Use SendGrid/Mailgun for better deliverability

---

## 📚 Resources

- [NodeMailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Email Template Best Practices](https://www.emailonacid.com/blog/article/email-development/)

---

**Need help?** Check server console for detailed error messages or create an issue on GitHub.
