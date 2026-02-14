# AstroView - Architecture Documentation

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React SPA (Vite Build)                  │   │
│  │  ┌────────┬─────────┬──────────┬──────────────────┐ │   │
│  │  │ Pages  │Components│ Services │ Context/Hooks    │ │   │
│  │  └────────┴─────────┴──────────┴──────────────────┘ │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │        Static Data (JSON Files)                 │ │   │
│  │  │  missions / glossary / quizzes / impacts       │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/Axios
                         │
┌────────────────────────▼────────────────────────────────────┐
│                       BACKEND LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Express.js REST API (Node.js 18+)            │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │              API Routes                         │ │   │
│  │  │  /nasa  /satellites  /astronomy  /weather  /ai │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │         Middleware Layer                        │ │   │
│  │  │  Cache Check → Controller → Error Handler      │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │        node-cache (In-Memory Cache)             │ │   │
│  │  │    TTL varies by endpoint (10s - 24h)          │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS Requests
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   EXTERNAL APIS LAYER                        │
│  ┌──────────┬─────────┬──────────┬──────────┬──────────┐   │
│  │   NASA   │  N2YO   │Astronomy │OpenWeather│ Gemini  │   │
│  │   APIs   │   API   │   API    │   API     │   AI    │   │
│  └──────────┴─────────┴──────────┴──────────┴──────────┘   │
│  ┌──────────┬────────────┬──────────────────────────────┐   │
│  │   NOAA   │    Open    │        Public Data           │   │
│  │   SWPC   │   Notify   │   (no authentication)        │   │
│  └──────────┴────────────┴──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Request Flow (External API Data)

```
User Action (Click "Tonight's Sky")
    │
    ▼
React Component (HomePage.jsx)
    │
    ▼
Service Layer (nasaService.js)
    │
    ▼
Axios GET request to Backend API
GET /api/nasa/apod
    │
    ▼
Express Route Handler (nasa.js)
    │
    ▼
Cache Middleware checks node-cache
    │
    ├─── Cache HIT ──────► Return cached data (fast path)
    │
    ├─── Cache MISS ─────► Controller (nasaController.js)
                              │
                              ▼
                         Axios request to NASA API
                         https://api.nasa.gov/planetary/apod
                              │
                              ▼
                         Response received
                              │
                              ▼
                         Store in cache (TTL: 24h)
                              │
                              ▼
                         Return { success: true, data }
    │
    ▼
React Component receives data
    │
    ▼
Update state, trigger re-render
    │
    ▼
Display APOD image to user
```

### 2. Static Data Flow (No Backend)

```
User Action (View Mission Details)
    │
    ▼
React Component (MissionDetail.jsx)
    │
    ▼
Import from static data
import missions from '@/data/missions.json'
    │
    ▼
Filter/search in memory
const mission = missions.find(m => m.id === id)
    │
    ▼
Render immediately (no API call)
```

### 3. Real-Time Data Flow (ISS Tracking)

```
Component Mount (TrackerPage.jsx)
    │
    ▼
useEffect with interval
setInterval(() => fetchISSPosition(), 5000)
    │
    ▼ (every 5 seconds)
GET /api/satellites/iss-position
    │
    ▼
Cache Check (TTL: 10 seconds)
    │
    ├─── If < 10s old ──► Return cached position
    │
    ├─── If > 10s old ──► Fetch from Open Notify API
                            │
                            ▼
                       Parse lat/lon coordinates
                            │
                            ▼
                       Cache for 10 seconds
    │
    ▼
React state update
    │
    ▼
Leaflet map marker position updates
    │
    ▼
User sees ISS move on map
```

### 4. AI Simplification Flow

```
User clicks "Explain Simply" toggle
    │
    ▼
Component (ExplainSimply.jsx)
    │
    ▼
POST /api/ai/simplify
Body: { text: "complex content", context: "space mission" }
    │
    ▼
Cache check (key: hash of text)
    │
    ├─── Cache HIT ──────► Return pre-generated explanation
    │
    ├─── Cache MISS ─────► Controller (aiController.js)
                              │
                              ▼
                         Build Gemini prompt
                         "Explain this to a 5th grader: {text}"
                              │
                              ▼
                         POST to Gemini API
                              │
                              ▼
                         Parse response
                              │
                              ▼
                         Cache for 24 hours
    │
    ▼
Display simplified text in modal
```

---

## Caching Strategy

### Cache Implementation

**Technology:** node-cache (in-memory key-value store)

**Configuration:**
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({
  stdTTL: 600,           // Default 10 minutes
  checkperiod: 120,      // Cleanup every 2 minutes
  useClones: false,      // Store references (faster)
  deleteOnExpire: true   // Auto-delete expired keys
});
```

### Cache TTL by Endpoint

| Endpoint | TTL | Reasoning |
|----------|-----|-----------|
| NASA APOD | 24 hours | Updates once daily at midnight UTC |
| NASA NeoWs (NEO feed) | 6 hours | Asteroid data changes slowly |
| NASA DONKI (space weather) | 1 hour | Moderate update frequency |
| EONET events | 1 hour | Natural events don't change rapidly |
| ISS position | 10 seconds | Real-time tracking needs freshness |
| Satellite passes | 1 hour | Predictions valid for hours |
| "What's above me" | 30 seconds | Overhead satellites change quickly |
| Astronomy (moon phase) | 6 hours | Moon phase changes gradually |
| Astronomy (planet positions) | 1 hour | Positions change throughout day |
| OpenWeather | 30 minutes | Weather updates 4x per hour |
| Aurora forecast | 1 hour | Space weather forecasts hourly |
| AI explanations | 24 hours | Same input = same output (deterministic) |

### Cache Keys Convention

```javascript
// Format: endpoint_params_hash
apod_2024-02-14
neo_2024-02-14_2024-02-21
iss_position
satellite_passes_25544_lat_lon_7days
weather_lat_lon
ai_hash(content_text)
```

### Cache Invalidation

**Manual Invalidation:**
- Admin endpoint (future): DELETE /api/cache/{key}
- Full flush: POST /api/cache/flush (dev only)

**Automatic Invalidation:**
- TTL expiration (handled by node-cache)
- Server restart (acceptable for hackathon)

**No Invalidation Needed:**
- Static data from JSON files (versioned with deployments)

---

## Project Structure

```
astroview/
│
├── client/                              # React Frontend
│   ├── public/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   │   ├── logo.svg
│   │   │   │   ├── placeholder-mission.png
│   │   │   │   └── agency-logos/
│   │   │   │       ├── nasa.svg
│   │   │   │       ├── esa.svg
│   │   │   │       ├── isro.svg
│   │   │   │       └── spacex.svg
│   │   │   └── icons/
│   │   │       ├── favicon.ico
│   │   │       └── favicon-32x32.png
│   │   └── robots.txt
│   │
│   ├── src/
│   │   ├── main.jsx                     # App entry point
│   │   ├── App.jsx                      # Root component with routing
│   │   ├── index.css                    # Tailwind imports + global styles
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx           # Top navigation (mobile)
│   │   │   │   ├── Sidebar.jsx          # Side navigation (desktop)
│   │   │   │   ├── BottomNav.jsx        # Bottom tab bar (mobile)
│   │   │   │   ├── Footer.jsx           # Footer with credits
│   │   │   │   └── Layout.jsx           # Wrapper with nav + outlet
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── Card.jsx             # Reusable card component
│   │   │   │   ├── Button.jsx           # Button variants (primary/secondary/ghost)
│   │   │   │   ├── Badge.jsx            # Status badges
│   │   │   │   ├── CountdownTimer.jsx   # Event countdown
│   │   │   │   ├── Skeleton.jsx         # Loading skeletons
│   │   │   │   ├── Modal.jsx            # Reusable modal
│   │   │   │   ├── ErrorFallback.jsx    # Error boundary UI
│   │   │   │   ├── SearchBar.jsx        # Search input
│   │   │   │   └── EmptyState.jsx       # No data placeholder
│   │   │   │
│   │   │   ├── sky/
│   │   │   │   ├── EventCard.jsx        # Celestial event card
│   │   │   │   ├── EventList.jsx        # List with filters
│   │   │   │   ├── SkyConditions.jsx    # Weather visibility widget
│   │   │   │   └── LocationPicker.jsx   # Location input
│   │   │   │
│   │   │   ├── missions/
│   │   │   │   ├── MissionCard.jsx      # Mission card
│   │   │   │   ├── MissionTimeline.jsx  # Visual timeline
│   │   │   │   └── MissionDetail.jsx    # Detail modal content
│   │   │   │
│   │   │   ├── tracker/
│   │   │   │   ├── ISSMap.jsx           # Leaflet map with ISS
│   │   │   │   ├── SatelliteInfo.jsx    # Satellite details
│   │   │   │   └── PassPrediction.jsx   # Upcoming passes list
│   │   │   │
│   │   │   ├── impact/
│   │   │   │   ├── ImpactCard.jsx       # Impact story card
│   │   │   │   ├── ImpactCategory.jsx   # Category overview
│   │   │   │   └── EarthEventsMap.jsx   # EONET events map
│   │   │   │
│   │   │   ├── learn/
│   │   │   │   ├── QuizCard.jsx         # Quiz question card
│   │   │   │   ├── GlossaryItem.jsx     # Glossary term
│   │   │   │   ├── LearningPath.jsx     # Learning path card
│   │   │   │   └── BadgeDisplay.jsx     # Earned badges
│   │   │   │
│   │   │   └── ai/
│   │   │       └── ExplainSimply.jsx    # AI simplification toggle/modal
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx             # Tonight's Sky (Hero + Events)
│   │   │   ├── TrackerPage.jsx          # Live ISS + Satellites
│   │   │   ├── MissionsPage.jsx         # Mission catalog
│   │   │   ├── ImpactPage.jsx           # Space to Earth impacts
│   │   │   ├── LearnPage.jsx            # Glossary + Quizzes
│   │   │   ├── CalendarPage.jsx         # Event calendar view
│   │   │   └── NotFoundPage.jsx         # 404 page
│   │   │
│   │   ├── context/
│   │   │   ├── LocationContext.jsx      # User location (lat/lon/name)
│   │   │   ├── UserContext.jsx          # Quiz scores, badges, preferences
│   │   │   └── ThemeContext.jsx         # Future: light mode toggle
│   │   │
│   │   ├── hooks/
│   │   │   ├── useLocation.js           # Geolocation wrapper
│   │   │   ├── useApi.js                # Generic API call hook
│   │   │   ├── useCountdown.js          # Countdown timer logic
│   │   │   ├── useLocalStorage.js       # Persistent state
│   │   │   ├── useDebounce.js           # Debounce search
│   │   │   └── useIntersectionObserver.js # Lazy loading
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                   # Axios instance with config
│   │   │   ├── nasaService.js           # NASA API calls
│   │   │   ├── satelliteService.js      # Satellite tracking calls
│   │   │   ├── astronomyService.js      # Astronomy API calls
│   │   │   ├── weatherService.js        # Weather API calls
│   │   │   └── aiService.js             # AI simplification calls
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.js            # Date/number formatting
│   │   │   ├── constants.js             # App constants
│   │   │   └── helpers.js               # Utility functions
│   │   │
│   │   └── data/                        # Static JSON data
│   │       ├── missions.json            # 15-20 curated missions
│   │       ├── glossary.json            # 30-40 space terms
│   │       ├── quizzes.json             # Quiz questions
│   │       ├── learningPaths.json       # Learning paths
│   │       └── impactData.json          # Impact stories
│   │
│   ├── .env                             # Environment variables (gitignored)
│   ├── .env.example                     # Template
│   ├── .gitignore
│   ├── index.html                       # HTML entry point
│   ├── vite.config.js                   # Vite configuration
│   ├── tailwind.config.js               # Tailwind customization
│   ├── postcss.config.js                # PostCSS config
│   ├── package.json
│   └── README.md                        # Client-specific readme
│
├── server/                              # Express Backend
│   ├── index.js                         # Server entry point
│   │
│   ├── routes/
│   │   ├── nasa.js                      # NASA endpoints
│   │   ├── satellites.js                # Satellite tracking endpoints
│   │   ├── astronomy.js                 # Astronomy endpoints
│   │   ├── weather.js                   # Weather endpoints
│   │   └── ai.js                        # AI simplification endpoints
│   │
│   ├── controllers/
│   │   ├── nasaController.js            # NASA API logic
│   │   ├── satelliteController.js       # Satellite API logic
│   │   ├── astronomyController.js       # Astronomy API logic
│   │   ├── weatherController.js         # Weather API logic
│   │   └── aiController.js              # AI API logic
│   │
│   ├── middleware/
│   │   ├── cache.js                     # Cache middleware
│   │   └── errorHandler.js              # Error handling middleware
│   │
│   ├── utils/
│   │   └── apiClients.js                # Pre-configured Axios instances
│   │
│   ├── .env                             # Backend environment variables (gitignored)
│   ├── .env.example                     # Template
│   ├── .gitignore
│   ├── package.json
│   └── README.md                        # Backend-specific readme
│
├── docs/                                # Documentation
│   ├── requirements.md                  # Product requirements
│   ├── tech-stack.md                    # Technology stack details
│   ├── design.md                        # Design system
│   ├── architecture.md                  # THIS FILE
│   ├── tasks.md                         # Task breakdown
│   ├── api-reference.md                 # API documentation
│   └── copilot-instructions.md          # AI assistant guidelines
│
├── .github/
│   └── copilot-instructions.md          # Copilot rules (copy of docs/)
│
├── .gitignore                           # Root gitignore
├── .env.example                         # Root template (both client & server)
└── README.md                            # Main project README
```

---

## Component Architecture

### Component Hierarchy Example (HomePage)

```
HomePage
├── Helmet (page metadata)
├── Hero Section
│   ├── APOD Image (background)
│   ├── Overlay Gradient
│   ├── Headline
│   └── CTA Button
│
├── LocationPicker
│   ├── Auto-detect button
│   ├── Manual input
│   └── Display current location
│
├── SkyConditions
│   ├── Weather Icon
│   ├── Cloud cover %
│   ├── Visibility rating
│   └── Aurora indicator
│
└── EventList
    ├── Filter buttons (by type)
    ├── Sort dropdown
    ├── EventCard (repeated)
    │   ├── Event icon
    │   ├── Event name
    │   ├── CountdownTimer
    │   ├── Viewing instructions
    │   └── ExplainSimply toggle
    └── EmptyState (if no events)
```

### State Management Pattern

**Local State (useState):**
- Component-specific UI state (modal open/closed, dropdown expanded)
- Form inputs
- Loading states for individual components

**Context State:**
- User location (LocationContext) - shared across multiple pages
- Quiz scores & badges (UserContext) - persisted to localStorage
- Theme preference (ThemeContext) - future enhancement

**Server State (via hooks):**
- API data fetched via useApi hook
- Automatic loading/error handling
- No global state needed (each page fetches its own data)

---

## Routing Architecture

### Route Definitions

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const TrackerPage = lazy(() => import('./pages/TrackerPage'));
const MissionsPage = lazy(() => import('./pages/MissionsPage'));
const ImpactPage = lazy(() => import('./pages/ImpactPage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="tracker" element={<TrackerPage />} />
      <Route path="missions" element={<MissionsPage />} />
      <Route path="impact" element={<ImpactPage />} />
      <Route path="learn" element={<LearnPage />} />
      <Route path="calendar" element={<CalendarPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

### URL Structure

```
/ → HomePage (Tonight's Sky)
/tracker → TrackerPage (Live ISS + Satellites)
/missions → MissionsPage (Mission catalog)
/missions?filter=active → Filtered missions
/missions?search=artemis → Search results
/impact → ImpactPage (Space to Earth)
/impact/climate → Category view (future)
/learn → LearnPage (Glossary + Quizzes)
/learn/quiz/1 → Specific quiz (future)
/calendar → CalendarPage (Event calendar)
```

---

## API Architecture

### Backend Route Structure

```javascript
// server/index.js
const express = require('express');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/nasa', require('./routes/nasa'));
app.use('/api/satellites', require('./routes/satellites'));
app.use('/api/astronomy', require('./routes/astronomy'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/ai', require('./routes/ai'));

// Error handler (must be last)
app.use(require('./middleware/errorHandler'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Standardized Response Format

**Success:**
```json
{
  "success": true,
  "data": { /* actual data */ },
  "cached": true,          // optional: indicates cache hit
  "timestamp": "2024-02-14T10:30:00Z"  // optional
}
```

**Error:**
```json
{
  "success": false,
  "error": "User-friendly error message",
  "code": "NASA_API_ERROR",  // optional error code
  "timestamp": "2024-02-14T10:30:00Z"
}
```

### Error Handling Middleware

```javascript
// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err.stack);

  // Don't leak error details to client
  const message = process.env.NODE_ENV === 'production'
    ? 'An error occurred while fetching data'
    : err.message;

  res.status(err.status || 500).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
};
```

---

## Security Architecture

### API Key Management

**Storage:**
- All API keys in `.env` files (never committed)
- Backend `.env`: NASA_API_KEY, N2YO_API_KEY, GEMINI_API_KEY, etc.
- Frontend `.env`: VITE_API_BASE_URL (backend URL only, no keys)

**Access Pattern:**
```javascript
// BAD: Exposing key in frontend
const response = await axios.get(
  `https://api.nasa.gov/apod?api_key=${VITE_NASA_KEY}` // ❌ NEVER
);

// GOOD: Proxying through backend
const response = await axios.get('/api/nasa/apod'); // ✅ Backend adds key
```

### CORS Configuration

```javascript
// server/index.js
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL  // Whitelist production domain
    : '*',                      // Allow all in development
  credentials: true
};

app.use(cors(corsOptions));
```

### Input Validation

```javascript
// Example: Validate location coordinates
if (isNaN(lat) || lat < -90 || lat > 90) {
  throw new Error('Invalid latitude');
}
if (isNaN(lon) || lon < -180 || lon > 180) {
  throw new Error('Invalid longitude');
}
```

### Rate Limiting (Future)

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 100,                  // 100 requests per window
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

---

## Performance Optimizations

### Frontend

1. **Code Splitting:** Lazy load pages with React.lazy()
2. **Image Optimization:** Use WebP format, lazy load images
3. **Bundle Analysis:** Keep main bundle < 300KB gzipped
4. **Memoization:** Use React.memo for expensive components
5. **Debouncing:** Debounce search inputs (300ms delay)
6. **Virtual Scrolling:** If lists exceed 100 items (future)

### Backend

1. **Caching:** Aggressive caching with node-cache
2. **Response Compression:** Use gzip/brotli (handled by hosting)
3. **Keep-Alive:** Reuse HTTP connections to external APIs
4. **Timeout Handling:** 10s timeout on all external requests
5. **Parallel Requests:** Use Promise.all() for independent API calls

### Network

1. **CDN:** Vercel Edge Network for static assets
2. **HTTP/2:** Enabled by default on Vercel
3. **Prefetch:** Prefetch next likely navigation (future)

---

## Monitoring & Logging

### Development

```javascript
// Console logging with context
console.log('[NASA API] Fetching APOD for 2024-02-14');
console.error('[Cache] Failed to retrieve key: apod_2024-02-14');
```

### Production (Future)

- **Error Tracking:** Sentry for backend errors
- **Analytics:** Vercel Analytics for pageviews
- **Performance:** Web Vitals monitoring
- **Uptime:** UptimeRobot for backend health checks

---

## Deployment Architecture

### Frontend (Vercel)

```
GitHub Push to main branch
    │
    ▼
Vercel detects commit
    │
    ▼
Build: npm run build in /client
    │
    ▼
Static files output to /client/dist
    │
    ▼
Deploy to Vercel Edge Network (CDN)
    │
    ▼
Auto-assign preview URL
    │
    ▼
Production site updated (if main branch)
```

### Backend (Vercel Serverless)

```
GitHub Push to main branch
    │
    ▼
Vercel detects /api directory
    │
    ▼
Each route becomes serverless function
/server/routes/nasa.js → /api/nasa/*
    │
    ▼
Environment variables injected from Vercel dashboard
    │
    ▼
Functions deployed to Vercel Edge
    │
    ▼
Auto-scaling based on requests
```

### Environment Variables Setup

**Vercel Dashboard:**
1. Add all API keys from `.env.example`
2. Set NODE_ENV=production
3. Set FRONTEND_URL to production domain
4. Each environment variable encrypted at rest

---

## Scalability Considerations

### Current Architecture (Hackathon)

- Single backend instance (serverless auto-scales)
- In-memory cache (lost on cold starts)
- No database (static JSON + external APIs)
- No user authentication

**Limitations:**
- Cache resets on serverless cold starts (~5 min idle)
- User data lost on browser cache clear
- Can't handle 10,000+ concurrent users

### Future Enhancements

**Phase 2 (Post-Hackathon):**
- Replace node-cache with Redis (persistent cache)
- Add PostgreSQL for user accounts, bookmarks, custom events
- Implement user authentication (NextAuth.js)
- Add analytics and monitoring
- Set up CI/CD pipeline with tests

**Phase 3 (Scale):**
- Migrate to Next.js for SSR/SSG
- Use CDN for API responses (Cloudflare Workers)
- Implement service workers for offline support
- Add WebSocket for real-time ISS updates
- Multi-region deployment

---

## Development Workflow

### Local Development

1. Clone repository
2. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. Copy `.env.example` to `.env` in both directories
4. Add API keys to `.env` files
5. Start backend: `cd server && npm run dev` (PORT 3001)
6. Start frontend: `cd client && npm run dev` (PORT 5173)
7. Open http://localhost:5173

### Git Workflow

```
main (production) ← Deploy to Vercel
 │
 └─ develop (WIP) ← Active development
     ├─ feature/iss-tracker
     ├─ feature/quiz-system
     └─ bugfix/countdown-timer
```

### Build & Deploy

**Frontend:**
```bash
cd client
npm run build      # Vite builds to /dist
npm run preview    # Preview production build locally
```

**Backend:**
```bash
cd server
npm start          # Production mode (no nodemon)
```

**Deployment:** Push to GitHub `main` branch → Auto-deploy via Vercel

---

## Testing Strategy (Future)

### Unit Tests (Jest)

- Utils: formatters, helpers
- Hooks: useCountdown, useLocalStorage
- Services: API error handling

### Integration Tests (React Testing Library)

- Component rendering
- User interactions (click, type, submit)
- Context providers

### E2E Tests (Playwright)

- Critical user flows:
  1. View tonight's events from homepage
  2. Track ISS on map
  3. Complete a quiz
  4. AI explain a mission

### Manual Testing Checklist

- [ ] All pages load without errors
- [ ] Navigation works (desktop + mobile)
- [ ] Forms validate inputs
- [ ] API errors show user-friendly messages
- [ ] Loading states display correctly
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1024px+)
- [ ] Accessibility: keyboard navigation, screen reader
- [ ] Performance: Lighthouse score > 90

---

## Backup & Recovery

**Hackathon Strategy:**
- Git commits every 30 minutes
- Push to GitHub every hour
- No database to backup (stateless)
- User data in localStorage (client responsibility)

**Future Strategy:**
- Database backups (daily automated)
- Disaster recovery plan (multi-region)
- Incident response procedures
