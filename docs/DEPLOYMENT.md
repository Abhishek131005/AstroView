# AstroView Deployment Guide

This guide covers deploying AstroView to production using Vercel (frontend) and Railway or Vercel Serverless (backend).

## Prerequisites

- Node.js 18+ installed
- Git repository on GitHub
- Accounts created on:
  - [Vercel](https://vercel.com)
  - [Railway](https://railway.app) (optional, for backend)
- API Keys obtained (see API Keys section below)

---

## API Keys Required

Before deploying, obtain the following API keys:

### NASA API
- **Service:** NASA Open APIs
- **URL:** https://api.nasa.gov/
- **Keys needed:**
  - `NASA_API_KEY` (get from https://api.nasa.gov/)
- **Free tier:** Yes (1000 requests/hour)

### N2YO Satellite Tracking
- **Service:** N2YO Satellite Database
- **URL:** https://www.n2yo.com/api/
- **Keys needed:**
  - `N2YO_API_KEY`
- **Free tier:** Limited

### OpenWeatherMap
- **Service:** Weather API
- **URL:** https://openweathermap.org/api
- **Keys needed:**
  - `OPENWEATHER_API_KEY`
- **Free tier:** Yes (1000 calls/day)

### Astronomy API
- **Service:** Astronomy API
- **URL:** https://astronomyapi.com/
- **Keys needed:**
  - `ASTRONOMY_APP_ID`
  - `ASTRONOMY_APP_SECRET`
- **Free tier:** Limited

### Google Gemini AI (Optional)
- **Service:** Google AI Studio
- **URL:** https://ai.google.dev/
- **Keys needed:**
  - `GEMINI_API_KEY`
- **Free tier:** Yes

---

## Environment Variables

### Backend (.env)

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# NASA APIs
NASA_API_KEY=your_nasa_api_key_here

# Satellite Tracking (N2YO)
N2YO_API_KEY=your_n2yo_api_key_here

# Weather API (OpenWeatherMap)
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Astronomy API
ASTRONOMY_APP_ID=your_astronomy_app_id_here
ASTRONOMY_APP_SECRET=your_astronomy_app_secret_here

# AI Service (Google Gemini) - Optional
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### Frontend (client/.env)

Create a `.env` file in the `client/` directory:

```env
# API Base URL (update after backend deployment)
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

---

## Deployment Steps

### Option 1: Deploy Backend to Railway

#### 1. Push Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Deploy to Railway

1. Go to [Railway](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect Node.js
6. Configure the following:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
7. Add environment variables:
   - Click on your service → Variables
   - Add all variables from your `.env` file
8. Deploy!

#### 3. Get Backend URL

- After deployment, Railway will provide a public URL like:
  `https://astroview-production.up.railway.app`
- Copy this URL for frontend configuration

### Option 2: Deploy Backend to Vercel Serverless

Vercel Serverless Functions have a 10-second timeout, which might be limiting for some API calls. Railway is recommended for the backend.

#### 1. Adapt Server to Serverless Format

Create `api/` directory in project root and convert Express routes to Vercel serverless functions.

Example: `api/nasa/apod.js`
```javascript
import { nasaController } from '../../server/controllers/nasaController.js';

export default async function handler(req, res) {
  return nasaController.getAPOD(req, res);
}
```

#### 2. Create `vercel.json`

```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 10
    }
  },
  "env": {
    "NASA_API_KEY": "@nasa_api_key",
    "N2YO_API_KEY": "@n2yo_api_key"
  }
}
```

#### 3. Deploy

```bash
vercel --prod
```

---

### Deploy Frontend to Vercel

#### 1. Update API Base URL

In `client/.env`, set the backend URL:

```env
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

#### 2. Deploy to Vercel

**Method A: Vercel CLI**

```bash
cd client
npm install -g vercel
vercel --prod
```

**Method B: Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Add environment variable:
   - Key: `VITE_API_BASE_URL`
   - Value: Your backend URL
6. Click "Deploy"

#### 3. Configure Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your custom domain (e.g., `astroview.app`)
3. Update DNS records as instructed

---

## Post-Deployment Checklist

### ✅ Frontend Checks

- [ ] Site loads at Vercel URL
- [ ] All pages accessible (Home, Tracker, Missions, Impact, Learn, Calendar)
- [ ] No 404 errors in console
- [ ] Fonts load correctly (Google Fonts)
- [ ] Images load correctly
- [ ] Tailwind styles applied
- [ ] Mobile responsive (test on phone)

### ✅ Backend Checks

- [ ] Health check endpoint works: `GET /health`
- [ ] CORS configured (frontend can access backend)
- [ ] All API routes respond:
  - `/api/nasa/apod`
  - `/api/satellite/iss`
  - `/api/weather/sky?lat=40&lon=-74`
- [ ] Caching works (check response headers)
- [ ] Error handling works (test with invalid params)

### ✅ Integration Checks

- [ ] HomePage displays APOD image
- [ ] TrackerPage shows live ISS position
- [ ] MissionsPage loads mission data
- [ ] ImpactPage shows Earth events map
- [ ] LearnPage loads glossary and quizzes
- [ ] CalendarPage displays events
- [ ] Notification bell shows upcoming events

### ✅ Performance Checks

- [ ] Lighthouse score > 90 (Performance)
- [ ] Lighthouse score > 95 (Accessibility)
- [ ] Lighthouse score > 90 (Best Practices)
- [ ] Lighthouse score > 100 (SEO)
- [ ] Page load time < 3 seconds
- [ ] Time to Interactive < 5 seconds

Run Lighthouse in Chrome DevTools:
```
Right-click → Inspect → Lighthouse → Generate report
```

---

## Troubleshooting

### Frontend Issues

**Problem:** API calls failing with CORS errors  
**Solution:**
- Check `ALLOWED_ORIGINS` in backend .env includes frontend URL
- Verify `VITE_API_BASE_URL` in frontend .env is correct

**Problem:** Environment variables not working  
**Solution:**
- In Vercel, redeploy after adding environment variables
- Ensure variables are prefixed with `VITE_` for client-side access

**Problem:** Build fails on Vercel  
**Solution:**
- Check build logs for errors
- Ensure all dependencies are in `package.json`
- Try building locally: `npm run build`

### Backend Issues

**Problem:** API endpoints returning 500 errors  
**Solution:**
- Check Railway logs for error details
- Verify all API keys are correctly set
- Test API keys locally first

**Problem:** Slow API responses  
**Solution:**
- Check if caching is working (should see cached responses)
- Consider upgrading Railway plan for more resources
- Optimize database queries (if using database)

**Problem:** Railway deployment fails  
**Solution:**
- Ensure `package.json` has correct start script
- Check Node.js version compatibility
- Review Railway build logs

---

## Monitoring & Maintenance

### Analytics (Optional)

Add Google Analytics or Vercel Analytics:

1. In Vercel project → Analytics → Enable
2. Or add Google Analytics to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Error Tracking (Optional)

Use Sentry for error monitoring:

```bash
npm install @sentry/react @sentry/tracing
```

Initialize in `main.jsx`:

```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com/) (free)
- [Ping](https://ping.gg/)
- Railway built-in monitoring

---

## Scaling Considerations

### If traffic increases:

**Frontend (Vercel):**
- Vercel auto-scales automatically
- Upgrade to Pro plan for higher limits
- Add CDN caching headers

**Backend (Railway):**
- Upgrade to paid plan for more resources
- Add database for caching instead of in-memory
- Consider Redis for distributed caching
- Implement rate limiting

**API Limits:**
- Monitor API usage (most have dashboards)
- Implement request batching
- Cache aggressively (NASA APOD changes daily)
- Consider upgrading API tiers

---

## Rollback Plan

### If something breaks in production:

**Vercel (Frontend):**
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

**Railway (Backend):**
1. Go to Railway Dashboard → Deployments
2. Select previous deployment
3. Click "Redeploy"

**Or use Git:**
```bash
git revert HEAD
git push origin main
```

Both platforms will auto-redeploy from the new commit.

---

## Security Best Practices

- ✅ Never commit `.env` files (use `.gitignore`)
- ✅ Use environment variables for all secrets
- ✅ Rotate API keys periodically
- ✅ Enable HTTPS (Vercel/Railway do this automatically)
- ✅ Implement rate limiting on backend
- ✅ Sanitize user inputs
- ✅ Keep dependencies updated: `npm audit fix`

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Vite Docs:** https://vitejs.dev/guide
- **React Docs:** https://react.dev

For issues, check:
1. Deployment logs (Vercel/Railway dashboards)
2. Browser console (F12)
3. Network tab (check API responses)
4. GitHub Issues (if open source)

---

**Deployment Status:**

- ✅ Backend deployed to Railway
- ✅ Frontend deployed to Vercel
- ✅ Environment variables configured
- ✅ Custom domain connected (optional)
- ✅ SSL certificate active
- ✅ Monitoring enabled

🎉 **Your AstroView app is now live!**
