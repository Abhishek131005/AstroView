# AstroView Deployment Guide

This guide covers deploying AstroView to production using **Render** for both the backend API (Web Service) and the frontend (Static Site).

## Prerequisites

- Node.js 18+ installed locally
- Git repository pushed to GitHub
- A [Render](https://render.com) account (free tier works)
- All API keys ready (see section below)

---

## API Keys Required

| Variable | Service | Get it from | Free Tier |
|---|---|---|---|
| `NASA_API_KEY` | NASA Open APIs | https://api.nasa.gov/ | Yes – 1 000 req/hr |
| `N2YO_API_KEY` | N2YO Satellite | https://www.n2yo.com/api/ | Limited |
| `OPENWEATHER_API_KEY` | OpenWeatherMap | https://openweathermap.org/api | Yes – 1 000 calls/day |
| `ASTRONOMY_APP_ID` | Astronomy API | https://astronomyapi.com/ | Limited |
| `ASTRONOMY_APP_SECRET` | Astronomy API | https://astronomyapi.com/ | Limited |
| `GEMINI_API_KEY` | Google Gemini AI | https://ai.google.dev/ | Yes |

---

## Local Environment Variables

### Backend — `server/.env`

```env
# Server
PORT=3001
NODE_ENV=production

# NASA
NASA_API_KEY=your_nasa_api_key_here

# Satellite Tracking
N2YO_API_KEY=your_n2yo_api_key_here

# Weather
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Astronomy
ASTRONOMY_APP_ID=your_astronomy_app_id_here
ASTRONOMY_APP_SECRET=your_astronomy_app_secret_here

# AI (optional)
GEMINI_API_KEY=your_gemini_api_key_here

# CORS — comma-separated allowed origins
ALLOWED_ORIGINS=https://astroview-client.onrender.com
```

### Frontend — `client/.env`

```env
# Points at your Render backend service
VITE_API_BASE_URL=https://astroview-api.onrender.com
```

---

## Deployment on Render

You can deploy using the **Blueprint (render.yaml)** — the fastest method — or manually via the dashboard.

---

### Option A: Blueprint Deployment (Recommended)

The repository already contains a `render.yaml` at the project root that defines both services.

#### 1. Push code to GitHub

```bash
git add .
git commit -m "Add render.yaml for deployment"
git push origin main
```

#### 2. Create a New Blueprint on Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Blueprint**
3. Connect your GitHub account and select the **AstroView** repository
4. Render will detect `render.yaml` automatically
5. Click **Apply**

#### 3. Set Secret Environment Variables

After Render creates the services, set the variables marked `sync: false` in the dashboard:

**For `astroview-api` (Web Service):**
- `NASA_API_KEY`
- `N2YO_API_KEY`
- `OPENWEATHER_API_KEY`
- `ASTRONOMY_APP_ID`
- `ASTRONOMY_APP_SECRET`
- `GEMINI_API_KEY`
- `ALLOWED_ORIGINS` → set to your static site URL, e.g. `https://astroview-client.onrender.com`

**For `astroview-client` (Static Site):**
- `VITE_API_BASE_URL` → set to your web service URL, e.g. `https://astroview-api.onrender.com`

#### 4. Trigger Redeploy

After setting all environment variables, click **Manual Deploy** → **Deploy latest commit** on both services.

---

### Option B: Manual Dashboard Deployment

#### Step 1 — Deploy the Backend

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:

   | Setting | Value |
   |---|---|
   | **Name** | `astroview-api` |
   | **Root Directory** | `server` |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | Free |

4. Add all backend environment variables (table above)
5. Click **Create Web Service**
6. Copy the generated URL (e.g. `https://astroview-api.onrender.com`)

#### Step 2 — Deploy the Frontend

1. Go to **New** → **Static Site**
2. Connect the same GitHub repository
3. Configure:

   | Setting | Value |
   |---|---|
   | **Name** | `astroview-client` |
   | **Root Directory** | `client` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |

4. Add environment variable:
   - `VITE_API_BASE_URL` = `https://astroview-api.onrender.com` (URL from Step 1)
5. Click **Create Static Site**

#### Step 3 — Update CORS on Backend

Go back to `astroview-api` → **Environment** and update:
- `ALLOWED_ORIGINS` = `https://astroview-client.onrender.com`

Then redeploy the backend.

---

## Post-Deployment Checklist

### Frontend

- [ ] Site loads at Render static site URL
- [ ] All pages work: Home, Tracker, Missions, Impact, Learn, Calendar
- [ ] No 404 errors in browser console
- [ ] Fonts load (Google Fonts)
- [ ] Tailwind styles applied correctly
- [ ] Mobile responsive (test at 375 px, 768 px, 1024 px)

### Backend

- [ ] Health check responds: `GET https://astroview-api.onrender.com/health`
- [ ] CORS allows frontend origin
- [ ] Core routes respond:
  - `GET /api/nasa/apod`
  - `GET /api/satellite/iss`
  - `GET /api/weather/sky?lat=40&lon=-74`
- [ ] Caching headers present on repeated requests
- [ ] Error responses are JSON (not HTML)

### Integration

- [ ] HomePage displays APOD image
- [ ] TrackerPage shows live ISS position
- [ ] MissionsPage loads mission data
- [ ] ImpactPage shows Earth events map
- [ ] LearnPage loads glossary and quizzes
- [ ] CalendarPage displays events
- [ ] Notification bell shows upcoming events

### Performance

- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95
- [ ] Lighthouse Best Practices > 90
- [ ] Lighthouse SEO = 100
- [ ] Page load < 3 s
- [ ] Time to Interactive < 5 s

```
Chrome DevTools → Lighthouse → Generate report
```

---

## Troubleshooting

### CORS errors on frontend

- Confirm `ALLOWED_ORIGINS` in the backend service includes the exact static site URL (no trailing slash)
- Confirm `VITE_API_BASE_URL` has no trailing slash
- Redeploy both services after changing env vars

### Environment variables not taking effect

- Render requires a **redeploy** after changing env vars
- For the static site, `VITE_` prefix is required for client-side access
- Check the **Logs** tab on Render for startup errors

### Build fails on Render

```bash
# Test locally before pushing
cd client && npm run build
cd ../server && npm install && node index.js
```

- Ensure all dependencies are listed in `package.json` (not just `devDependencies`)
- Check the **Build Logs** tab in the Render dashboard

### Backend returning 500 errors

- Open **Logs** tab on the `astroview-api` service
- Verify all API keys are set and non-empty
- Test keys locally with `node server/test-env.js`

### Render free tier spin-down

Free web services spin down after 15 minutes of inactivity and take ~30 s to restart.  
To avoid cold starts, use a free uptime monitor like [UptimeRobot](https://uptimerobot.com/) to ping `/health` every 14 minutes.

---

## Custom Domain (Optional)

1. Render Dashboard → your service → **Settings** → **Custom Domains**
2. Add your domain (e.g. `astroview.app`)
3. Update DNS:
   - For Static Site: add a `CNAME` record pointing to the Render-provided hostname
   - For Web Service: add a `CNAME` record pointing to the Render-provided hostname
4. Render provisions an SSL certificate automatically

Update `ALLOWED_ORIGINS` on the backend to include the new domain.

---

## Rollback

**Render Dashboard → your service → Events tab**

1. Find the last working deploy
2. Click **Redeploy** next to that commit

Or via Git:

```bash
git revert HEAD
git push origin main
# Render auto-deploys on push
```

---

## Scaling (If Traffic Grows)

| Layer | Action |
|---|---|
| Frontend (Static Site) | Render CDN auto-scales; no action needed |
| Backend (Web Service) | Upgrade to **Starter** or **Standard** instance to eliminate spin-down |
| Caching | Replace `node-cache` with Redis (Render offers Redis add-on) |
| API limits | Monitor dashboards; upgrade tiers or add request batching |

---

## Security Best Practices

- ✅ `.env` files are in `.gitignore` — never commit secrets
- ✅ All secrets set via Render environment variables
- ✅ HTTPS enforced automatically by Render
- ✅ CORS restricted to known frontend origin
- ✅ Rate limiting implemented in Express middleware
- ✅ Keep dependencies up to date: `npm audit fix`
- ✅ Rotate API keys periodically

---

## Monitoring

### Render Built-in

- **Logs:** Real-time log streaming per service
- **Metrics:** CPU / memory charts on paid plans
- **Alerts:** Configure deploy failure notifications via **Notifications** settings

### Free External Tools

- **[UptimeRobot](https://uptimerobot.com/)** — uptime monitoring + alerts (also prevents free-tier spin-down)
- **[Sentry](https://sentry.io)** — error tracking

```bash
# Add Sentry to frontend
npm install @sentry/react
```

```javascript
// client/src/main.jsx
import * as Sentry from '@sentry/react';
Sentry.init({ dsn: 'YOUR_SENTRY_DSN', tracesSampleRate: 1.0 });
```

---

## Resources

- [Render Docs](https://render.com/docs)
- [Render Blueprint (render.yaml) reference](https://render.com/docs/blueprint-spec)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy)
- [React Docs](https://react.dev)

---

## Deployment Status

- [ ] `render.yaml` pushed to `main`
- [ ] Blueprint applied on Render dashboard
- [ ] Secret env vars set on both services
- [ ] Backend health check passing
- [ ] Frontend loading at Render URL
- [ ] CORS verified (no console errors)
- [ ] Custom domain connected (optional)
- [ ] UptimeRobot monitor active (optional)

🎉 **AstroView is live on Render!**
