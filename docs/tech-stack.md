# AstroView - Technology Stack

## Overview

AstroView is built using a modern JAMstack architecture with a React frontend and Express.js backend. All external API calls are proxied through the backend for security and caching.

---

## Frontend Stack

### Core Framework

**React 18.2.0**
- **Purpose:** UI library for building component-based interface
- **Why:** Virtual DOM for performance, huge ecosystem, excellent developer experience
- **Alternatives considered:** Vue.js, Svelte (chose React for team familiarity and library ecosystem)

**Vite 5.0.0**
- **Purpose:** Build tool and dev server
- **Why:** Lightning-fast HMR, optimized production builds, better DX than CRA
- **Alternatives considered:** Create React App (deprecated), Webpack (slower)

### Routing

**React Router v6.20.0**
- **Purpose:** Client-side routing and navigation
- **Why:** Standard for React SPAs, supports nested routes and layouts
- **Key features used:** 
  - BrowserRouter for clean URLs
  - Route-based code splitting with lazy()
  - useNavigate, useParams, useLocation hooks
  - Nested layouts

### Styling

**Tailwind CSS 3.4.0**
- **Purpose:** Utility-first CSS framework
- **Why:** Rapid development, consistency, small production bundle with purging
- **Configuration:** Custom color palette, font families, extended spacing
- **Plugins:** @tailwindcss/forms, @tailwindcss/typography

**PostCSS 8.4.32**
- **Purpose:** CSS processing (required by Tailwind)
- **Plugins:** autoprefixer, tailwindcss

**Autoprefixer 10.4.16**
- **Purpose:** Add vendor prefixes for browser compatibility

### Animations

**Framer Motion 10.16.0**
- **Purpose:** Production-ready animation library for React
- **Why:** Declarative API, gesture support, layout animations
- **Key features used:**
  - Page transitions (AnimatePresence)
  - Stagger animations for lists
  - Scroll-triggered animations
  - Hover and tap gestures
  - Spring physics for natural motion

### Mapping

**React Leaflet 4.2.1**
- **Purpose:** Interactive maps for satellite tracking and Earth events
- **Why:** Lightweight, open-source, great documentation
- **Dependencies:** leaflet 1.9.4
- **Tile Provider:** CartoDB Dark Matter (dark theme)
- **Features used:**
  - Real-time marker updates (ISS position)
  - Custom markers and popups
  - Auto-centering and zoom controls
  - Trajectory polylines

**Leaflet 1.9.4**
- **Purpose:** Core mapping library (peer dependency of react-leaflet)

### Charts & Data Visualization

**Recharts 2.10.0**
- **Purpose:** Composable charting library built on React
- **Why:** React-native API, responsive, good documentation
- **Chart types used:**
  - Line charts (space weather trends)
  - Bar charts (event frequency by type)
  - Radial charts (mission completion progress)
  - Area charts (aurora probability over time)

### Icons

**Lucide React 0.294.0**
- **Purpose:** Beautiful, consistent icon set with 1000+ icons
- **Why:** Tree-shakeable, actively maintained, better than Font Awesome for bundle size
- **Alternative considered:** React Icons, Heroicons

### HTTP Client

**Axios 1.6.2**
- **Purpose:** HTTP client for API requests
- **Why:** Better error handling than fetch, request/response interceptors, automatic JSON parsing
- **Configuration:**
  - Base URL from environment variable
  - 10-second timeout
  - Retry logic for failed requests (axios-retry 3.9.1)

**axios-retry 3.9.1**
- **Purpose:** Automatic retry mechanism for failed requests
- **Configuration:** 3 retries with exponential backoff

### Date Handling

**date-fns 3.0.0**
- **Purpose:** Modern date utility library
- **Why:** Tree-shakeable, immutable, better than Moment.js for bundle size
- **Functions used:**
  - format, formatDistance, formatDistanceToNow
  - addDays, subDays, startOfDay, endOfDay
  - parseISO, isWithinInterval, isFuture

### Notifications

**React Hot Toast 2.4.1**
- **Purpose:** Lightweight toast notification library
- **Why:** Tiny bundle (3KB), headless styling, accessible
- **Usage:** Success/error/info toasts for user actions

### State Management

**React Context API (built-in)**
- **Purpose:** Global state management
- **Why:** Sufficient for this app's needs, no external library needed
- **Contexts:**
  - LocationContext (user's lat/long, location name)
  - UserContext (quiz scores, badges, preferences)
  - ThemeContext (future: light mode support)

### Custom Hooks

**useLocation** - Geolocation API wrapper with permission handling  
**useApi** - Generic hook for API calls with loading/error states  
**useCountdown** - Real-time countdown to events  
**useLocalStorage** - Persistent state in localStorage with JSON serialization  
**useDebounce** - Debounce search inputs  
**useIntersectionObserver** - Lazy load images and components

### Development Tools

**ESLint 8.55.0**
- **Purpose:** JavaScript linting
- **Config:** eslint-config-react-app
- **Rules:** Relaxed for hackathon (warn instead of error)

**Prettier 3.1.0** (optional)
- **Purpose:** Code formatting
- **Config:** 2-space indent, single quotes, trailing commas

---

## Backend Stack

### Runtime & Framework

**Node.js 18+ LTS**
- **Purpose:** JavaScript runtime for backend
- **Why:** Same language as frontend, huge ecosystem, good performance
- **Required version:** >= 18.0.0

**Express.js 4.18.2**
- **Purpose:** Web framework for Node.js
- **Why:** Minimal, flexible, industry standard
- **Middleware used:**
  - cors (cross-origin requests)
  - express.json() (parse JSON bodies)
  - Custom error handler
  - Custom cache middleware

### Caching

**node-cache 5.1.2**
- **Purpose:** In-memory caching to reduce external API calls
- **Why:** Simple, fast, no external dependencies (Redis not needed for hackathon)
- **Configuration:**
  - TTL varies by endpoint (10s for ISS, 24h for APOD)
  - stdTTL: 600 (default 10 minutes)
  - checkperiod: 120 (cleanup every 2 minutes)

### HTTP Client (Backend)

**Axios 1.6.2**
- **Purpose:** Make HTTP requests to external APIs
- **Why:** Same as frontend reasoning, familiar API

### Environment Variables

**dotenv 16.3.1**
- **Purpose:** Load environment variables from .env file
- **Why:** Standard for Node.js projects, keeps secrets out of code

### CORS

**cors 2.8.5**
- **Purpose:** Enable cross-origin requests from frontend
- **Configuration:**
  - Development: Allow all origins
  - Production: Whitelist only production frontend domain

### Error Handling

**Custom Middleware**
- Centralized error handler in middleware/errorHandler.js
- Standardized error responses { success: false, error: "message" }
- Logs errors to console (future: log to service like Sentry)

---

## External APIs

### NASA APIs

**API Key:** Single key for all NASA APIs (free, 1000 req/hour)  
**Documentation:** https://api.nasa.gov

1. **APOD (Astronomy Picture of the Day)**
   - Endpoint: GET /planetary/apod
   - Rate limit: Share 1000 req/hour with other NASA APIs
   - Cache TTL: 24 hours

2. **NeoWs (Near Earth Object Web Service)**
   - Endpoint: GET /neo/rest/v1/feed
   - Rate limit: Shared NASA limit
   - Cache TTL: 6 hours

3. **DONKI (Space Weather Database)**
   - Endpoints: /DONKI/FLR, /DONKI/GST, /DONKI/CME
   - Rate limit: Shared NASA limit
   - Cache TTL: 1 hour

4. **EONET (Earth Observatory Natural Event Tracker)**
   - Endpoint: GET /api/v3/events
   - Rate limit: No authentication required, reasonable use
   - Cache TTL: 1 hour

### Satellite Tracking

**N2YO API**
- **Purpose:** Satellite positions, passes, visual predictions
- **Authentication:** API key in URL parameter
- **Rate limit:** 1000 req/hour (free tier)
- **Key endpoints:**
  - /positions/{id}/{lat}/{lon}/{alt}/{seconds}
  - /visualpasses/{id}/{lat}/{lon}/{alt}/{days}/{min_visibility}
  - /above/{lat}/{lon}/{alt}/{search_radius}/{category}
- **Cache TTL:** 10 seconds (positions), 1 hour (passes)
- **ISS NORAD ID:** 25544

**Open Notify**
- **Purpose:** ISS position (backup/alternative to N2YO)
- **Authentication:** None
- **Endpoint:** GET /iss-now.json
- **Rate limit:** None specified, reasonable use
- **Cache TTL:** 10 seconds

### Astronomy Data

**Astronomy API**
- **Purpose:** Planet positions, moon phase, star charts
- **Authentication:** Basic Auth (username + password)
- **Rate limit:** 1000 req/day (free tier)
- **Endpoints:**
  - /bodies/positions/{body}
  - /moon-phase
  - /studio/star-chart
- **Cache TTL:** 6 hours

### Weather

**OpenWeatherMap API**
- **Purpose:** Sky conditions for visibility (cloud cover, precipitation)
- **Authentication:** API key in URL parameter
- **Rate limit:** 60 calls/minute (free tier)
- **Endpoint:** GET /data/2.5/weather
- **Cache TTL:** 30 minutes

### Space Weather

**NOAA SWPC (Space Weather Prediction Center)**
- **Purpose:** Aurora forecasts, K-index, solar activity
- **Authentication:** None
- **Endpoints:**
  - /json/ovation_aurora_latest.json
  - /products/noaa-planetary-k-index.json
- **Rate limit:** None, government public data
- **Cache TTL:** 1 hour

### AI

**Google Gemini API**
- **Purpose:** Simplify complex space content to 5th-grade level
- **Model:** gemini-pro
- **Authentication:** API key in URL parameter
- **Rate limit:** 60 req/minute (free tier)
- **Endpoint:** POST /v1beta/models/gemini-pro:generateContent
- **Cache TTL:** 24 hours (same input = same output)
- **Max tokens:** 150 tokens per response

---

## Deployment

### Frontend Hosting

**Vercel**
- **Why:** Zero-config for Vite, automatic deployments, excellent DX, free SSL
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variables:** VITE_API_BASE_URL
- **Features used:**
  - Automatic preview deployments for PRs
  - Edge network (CDN)
  - Analytics (optional)

**Alternative:** Netlify (similar features)

### Backend Hosting

**Option 1: Vercel Serverless Functions**
- **Why:** Same platform as frontend, zero cold start for first request
- **Structure:** /api routes map to /server/routes
- **Limitations:** Max 10-second execution time (sufficient for our use case)

**Option 2: Railway**
- **Why:** Simple deployment for Express apps, always-on server, free tier available
- **Build command:** `npm start`
- **Environment variables:** All API keys, PORT
- **Health check:** GET /health endpoint

**Chosen:** Vercel Serverless Functions (simpler for hackathon)

---

## Development Environment

### Required Software

- Node.js 18+ LTS
- npm 9+ or yarn 1.22+
- Git
- VS Code (recommended) or any code editor

### VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Path Intellisense

### Environment Variables

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:3001
```

**Backend (.env)**
```
PORT=3001
NASA_API_KEY=your_key_here
N2YO_API_KEY=your_key_here
ASTRONOMY_API_ID=your_id_here
ASTRONOMY_API_SECRET=your_secret_here
OPENWEATHER_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## Package Management

**Frontend package.json (dependencies)**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "framer-motion": "^10.16.0",
  "react-leaflet": "^4.2.1",
  "leaflet": "^1.9.4",
  "recharts": "^2.10.0",
  "lucide-react": "^0.294.0",
  "axios": "^1.6.2",
  "axios-retry": "^3.9.1",
  "date-fns": "^3.0.0",
  "react-hot-toast": "^2.4.1"
}
```

**Frontend package.json (devDependencies)**
```json
{
  "@vitejs/plugin-react": "^4.2.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.32",
  "autoprefixer": "^10.4.16",
  "eslint": "^8.55.0",
  "eslint-config-react-app": "^7.0.1"
}
```

**Backend package.json (dependencies)**
```json
{
  "express": "^4.18.2",
  "axios": "^1.6.2",
  "node-cache": "^5.1.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

**Backend package.json (devDependencies)**
```json
{
  "nodemon": "^3.0.2"
}
```

---

## Browser Support

- Chrome 90+ (primary development browser)
- Firefox 88+
- Safari 14+ (iOS 14+)
- Edge 90+
- No IE11 support (ESM builds)

---

## Performance Budget

- Initial bundle size: < 300KB (gzipped)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Total page weight: < 2MB
- API response time: < 2s (with caching)

---

## Security Considerations

- All API keys server-side only
- CORS configured for production domain
- Input sanitization for user inputs
- HTTPS enforced in production
- No sensitive data in localStorage (only preferences/scores)
- Rate limiting on backend (future: use express-rate-limit)

---

## Data Storage

**Browser (Frontend)**
- localStorage: User preferences, quiz scores, badges, learning progress
- sessionStorage: Temporary data (current search, filters)
- No cookies needed

**Backend**
- node-cache: In-memory cache (lost on restart, acceptable for hackathon)
- No database needed (all data from external APIs or static JSON)

---

## Static Data Files

Located in client/src/data/:

1. **missions.json** - 15-20 curated space missions with details
2. **glossary.json** - 30-40 space terms with definitions
3. **quizzes.json** - 5-7 quizzes with questions and answers
4. **learningPaths.json** - 3-5 learning paths with steps
5. **impactData.json** - Impact stories and satellite applications

All JSON files manually created and maintained (no CMS needed for hackathon).

---

## Version Control

**Git + GitHub**
- Repository: Private during hackathon, public after
- Branch strategy: main (production), develop (WIP)
- Commit convention: Conventional Commits (optional)
- .gitignore: node_modules, .env, dist, build

---

## Future Technology Considerations

### Post-Hackathon Upgrades

- **TypeScript:** Add type safety as project grows
- **Redis:** Replace node-cache for persistent, distributed caching
- **PostgreSQL:** Store user data, bookmarks, custom events
- **NextAuth.js:** Add user authentication
- **React Query:** Better server state management and caching
- **Sentry:** Error tracking and monitoring
- **GitHub Actions:** CI/CD pipeline with automated tests
- **Jest + React Testing Library:** Unit and integration tests
- **Playwright:** End-to-end tests
