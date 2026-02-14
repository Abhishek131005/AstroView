# GitHub Copilot Instructions for AstroView

## Project Context

You are assisting in building **AstroView**, an interactive web platform that transforms complex space data into accessible insights for students, educators, and space enthusiasts. This is a 24-hour hackathon project where **speed and working functionality** matter more than perfection.

**Target Audience:** 14+ years old, no science background required  
**Reading Level:** 8th grade, jargon-free language  
**Theme:** Dark space theme, visual-first design  

---

## Core Technologies

### Frontend
- **React 18** (functional components + hooks only, no class components)
- **Vite** (build tool)
- **Tailwind CSS** (utility-first styling, no inline styles or CSS modules)
- **Framer Motion** (all animations)
- **React Router v6** (client-side routing)
- **Lucide React** (all icons)
- **Axios** (HTTP client)
- **date-fns** (date formatting)
- **React Leaflet** (mapping)
- **Recharts** (data visualization)

### Backend
- **Node.js + Express.js**
- **node-cache** (in-memory caching)
- **Axios** (external API requests)
- **cors, dotenv**

---

## Coding Standards

### General Rules

1. **Functional Components Only**
   - Use React hooks (useState, useEffect, useContext, custom hooks)
   - No class components

2. **Tailwind CSS Exclusively**
   - Use Tailwind utility classes for all styling
   - No inline styles (`style={}`)
   - No CSS modules or separate CSS files (except global index.css)
   - Use custom theme colors from config (electric-blue, cosmic-purple, etc.)

3. **Named Exports**
   - All components use named exports: `export { ComponentName }`
   - Import as: `import { ComponentName } from '...'`

4. **Import Order**
   - React imports first
   - Third-party libraries
   - Components
   - Hooks
   - Services
   - Utils/constants
   - Separate groups with blank line

   ```javascript
   import { useState, useEffect } from 'react';
   import { motion } from 'framer-motion';
   
   import { Button } from '@/components/common/Button';
   
   import { useApi } from '@/hooks/useApi';
   
   import { nasaService } from '@/services/nasaService';
   import { formatDate } from '@/utils/formatters';
   ```

5. **Component File Structure**
   - Keep components under 150 lines
   - If larger, split into smaller components
   - One component per file
   - Component name matches filename

### Component Requirements

**Every component MUST include:**

1. **Loading State**
   - Use Skeleton component or spinner
   - Never show blank space while loading

2. **Error State**
   - User-friendly error message (no technical jargon)
   - Retry button when applicable
   - Fallback content when possible

3. **Empty State**
   - When data is empty (no events, no results, etc.)
   - Use EmptyState component with icon, message, and optional CTA

4. **Responsive Design**
   - Mobile-first approach
   - Test at: 375px (mobile), 768px (tablet), 1024px (desktop)
   - Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`

### Animation Guidelines

- **All animations via Framer Motion** (not CSS transitions)
- **Duration:** Under 300ms for snappy feel
- **Easing:** `ease-in-out` for most transitions
- **Page transitions:** Fade + slide (y: 20px)
- **Card entrance:** Staggered children (0.1s delay)
- **Respect reduced motion:**
  ```javascript
  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  ```

### Date Formatting

- **Use date-fns exclusively** (not moment.js or native Date methods)
  ```javascript
  import { format, formatDistance, formatDistanceToNow } from 'date-fns';
  
  format(new Date(), 'PPP'); // "February 14, 2024"
  formatDistanceToNow(futureDate); // "in 5 days"
  ```

### Icon Usage

- **Use Lucide React** for all icons
  ```javascript
  import { Rocket, MapPin, Calendar, AlertCircle } from 'lucide-react';
  
  <Rocket className="w-6 h-6 text-electric-blue" />
  ```
- Default size: 24px (w-6 h-6)
- Smaller: 20px (w-5 h-5), Larger: 32px (w-8 h-8)

---

## Design System

### Colors (Use Tailwind Classes)

```javascript
// Primary colors
bg-bg-primary      // #0B0D17 - main background
bg-bg-secondary    // #1B1D2A - cards
bg-bg-tertiary     // #252840 - hover states

// Accent colors
text-electric-blue // #4F9CF7 - primary accent
text-cosmic-purple // #7C5CFC - secondary accent
text-solar-amber   // #FFB800 - alerts, countdowns
text-aurora-green  // #00E676 - success, live indicators

// Text colors
text-star-white    // #E8EAED - primary text
text-muted-gray    // #9AA0A6 - secondary text
text-faint-gray    // #5F6368 - disabled text

// Semantic colors
text-danger-red    // #FF5252 - errors
```

### Typography

```javascript
// Headings (font-heading = Space Grotesk)
className="text-4xl font-bold font-heading text-star-white"

// Body text (font-body = Inter)
className="text-base font-body text-star-white"

// Data/monospace (font-mono = JetBrains Mono)
className="text-base font-mono text-electric-blue tabular-nums"
```

### Common Component Patterns

**Card:**
```jsx
<div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 hover:border-electric-blue/30 hover:shadow-[0_0_20px_rgba(79,156,247,0.1)] transition-all duration-200">
  {/* content */}
</div>
```

**Primary Button:**
```jsx
<button className="bg-gradient-to-br from-electric-blue to-cosmic-purple text-white px-6 py-3 rounded-lg font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(79,156,247,0.3)]">
  {children}
</button>
```

**Badge:**
```jsx
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora-green/10 text-aurora-green text-xs font-semibold uppercase tracking-wide">
  <Activity className="w-4 h-4" />
  Active
</span>
```

---

## Backend Patterns

### Route Structure

```javascript
// routes/nasa.js
const express = require('express');
const router = express.Router();
const { getAPOD } = require('../controllers/nasaController');
const cache = require('../middleware/cache');

router.get('/apod', cache(86400), getAPOD); // 24h cache

module.exports = router;
```

### Controller Pattern

```javascript
// controllers/nasaController.js
const axios = require('axios');

const getAPOD = async (req, res, next) => {
  try {
    const { date } = req.query;
    const apiKey = process.env.NASA_API_KEY;
    
    const response = await axios.get('https://api.nasa.gov/planetary/apod', {
      params: { api_key: apiKey, date },
      timeout: 10000
    });
    
    res.json({
      success: true,
      data: response.data,
      cached: false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error); // Pass to error handler
  }
};

module.exports = { getAPOD };
```

### Cache Middleware

```javascript
// middleware/cache.js
const NodeCache = require('node-cache');
const cache = new NodeCache();

const cacheMiddleware = (ttl) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }
    
    // Override res.json to cache response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cache.set(key, data, ttl);
      originalJson(data);
    };
    
    next();
  };
};

module.exports = cacheMiddleware;
```

### Error Handler

```javascript
// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  
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

## API Integration Rules

### Frontend Service Pattern

```javascript
// services/nasaService.js
import { api } from './api';

export const nasaService = {
  async getAPOD(date) {
    const response = await api.get('/api/nasa/apod', {
      params: { date }
    });
    return response.data;
  },
  
  async getNearEarthObjects(startDate, endDate) {
    const response = await api.get('/api/nasa/neo', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  }
};
```

### API Hook Pattern

```javascript
// hooks/useApi.js
import { useState, useEffect } from 'react';

export function useApi(apiFunction, autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);
  
  return { data, loading, error, refetch: fetchData };
}
```

---

## Language & Tone

### User-Facing Content Rules

1. **No Jargon** - Explain like you're talking to a 14-year-old
   - ❌ "Apogee and perigee define the elliptical orbit"
   - ✅ "The satellite is farthest from Earth at its highest point and closest at its lowest point"

2. **Active Voice** - Use "you" and action verbs
   - ❌ "The ISS can be observed"
   - ✅ "You can see the ISS pass overhead"

3. **Short Sentences** - Max 20 words per sentence
   - ❌ "The Mars Perseverance rover, which is part of NASA's Mars Exploration Program, is searching for signs of ancient microbial life and collecting rock samples for potential return to Earth."
   - ✅ "The Perseverance rover is exploring Mars. It's looking for signs of ancient life. It also collects rock samples to bring back to Earth."

4. **Positive Tone** - Exciting, not scary
   - ❌ "Near-Earth objects pose a potential threat"
   - ✅ "Scientists track asteroids to keep Earth safe"

5. **Error Messages** - Friendly, not technical
   - ❌ "ERR_CONNECTION_REFUSED: ECONNREFUSED"
   - ✅ "We couldn't load the data right now. Please try again."

---

## File Naming Conventions

### Components
- PascalCase: `EventCard.jsx`, `MissionTimeline.jsx`
- Matches component name exactly

### Hooks
- camelCase with "use" prefix: `useLocation.js`, `useCountdown.js`

### Services
- camelCase with "Service" suffix: `nasaService.js`, `satelliteService.js`

### Utils
- camelCase: `formatters.js`, `helpers.js`, `constants.js`

### Data Files
- camelCase: `missions.json`, `glossary.json`, `quizzes.json`

---

## Context & State Management

### When to Use Context

**LocationContext** - User's geographic location
```javascript
const { location, setLocation, autoDetect } = useContext(LocationContext);
```

**UserContext** - Quiz scores, badges, preferences
```javascript
const { scores, badges, updateScore, addBadge } = useContext(UserContext);
```

### When to Use Local State

- Component-specific UI (modal open/closed, dropdown expanded)
- Form inputs
- Loading states for individual components

### When to Use Custom Hooks

- Reusable logic (countdown timer, API calls, localStorage)
- Side effects that multiple components need

---

## Testing & Validation

### Before Every Commit

- [ ] No console.log statements (except intentional logging)
- [ ] No unused imports or variables
- [ ] All components render without errors
- [ ] Responsive on mobile (375px minimum)
- [ ] Animations work smoothly
- [ ] Error states display correctly
- [ ] Loading states show skeletons/spinners

### Accessibility Checklist

- [ ] All images have `alt` text
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have labels (visible or `aria-label`)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA (4.5:1 for text)

---

## Common Pitfalls to Avoid

### ❌ DON'T

```javascript
// Don't use inline styles
<div style={{ backgroundColor: '#1B1D2A' }}>

// Don't use var
var count = 0;

// Don't use class components
class EventCard extends React.Component { }

// Don't expose API keys in frontend
const NASA_KEY = 'abc123';

// Don't use moment.js
moment(date).format('YYYY-MM-DD');

// Don't use plain HTML buttons
<button onClick={handleClick}>Click</button>

// Don't ignore loading states
return <div>{data.map(...)}</div>

// Don't use technical error messages
<p>Error: ECONNREFUSED</p>

// Don't use setTimeout for intervals
setTimeout(() => fetchData(), 5000);

// Don't mutate state directly
state.count++;
```

### ✅ DO

```javascript
// Use Tailwind classes
<div className="bg-bg-secondary">

// Use const/let
const count = 0;

// Use functional components
function EventCard() { }

// Keep API keys in backend
// Access via /api routes

// Use date-fns
format(date, 'yyyy-MM-dd');

// Use Button component
<Button onClick={handleClick}>Click</Button>

// Always show loading state
return loading ? <Skeleton /> : <div>{data.map(...)}</div>

// Use friendly error messages
<p>We couldn't load the data. Please try again.</p>

// Use setInterval in useEffect
useEffect(() => {
  const interval = setInterval(() => fetchData(), 5000);
  return () => clearInterval(interval);
}, []);

// Use state setters
setCount(prev => prev + 1);
```

---

## AI Prompt Engineering (Gemini API)

### Effective Prompts for "Explain Simply"

**Template:**
```
You are explaining space concepts to a 5th grader (10-11 years old). 

Simplify the following text:
- Use simple words (no jargon)
- Keep it under 100 words
- Use analogies to everyday things
- Make it exciting and engaging

Text to simplify:
{CONTENT_HERE}
```

**Example:**
```
Input: "The James Webb Space Telescope uses infrared wavelengths to observe distant galaxies, allowing it to peer through cosmic dust and detect light from the earliest stars formed after the Big Bang."

Good Output: "The James Webb Space Telescope is like a super powerful camera that can see things regular telescopes can't! It uses special 'infrared' vision (kind of like night vision goggles) to look through space dust and see the very first stars that ever existed. It's helping us learn about how the universe was born!"
```

---

## Performance Guidelines

### Bundle Size

- Main bundle: < 300KB (gzipped)
- Lazy load pages with `React.lazy()`
- Use dynamic imports for heavy libraries

### Images

- Use WebP format when possible
- Lazy load with `loading="lazy"` attribute
- Provide width/height to prevent layout shift

### API Calls

- Cache aggressively on backend (check cache first)
- Debounce search inputs (300ms)
- Use AbortController for cleanup

### Animations

- Use `transform` and `opacity` (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Keep duration under 300ms

---

## Security Rules

### API Keys

- **NEVER** commit `.env` files
- **NEVER** expose keys in frontend code
- **ALWAYS** use environment variables
- **ALWAYS** proxy through backend

### Input Validation

```javascript
// Validate coordinates
if (isNaN(lat) || lat < -90 || lat > 90) {
  throw new Error('Invalid latitude');
}

// Sanitize user input
const sanitized = userInput.trim().substring(0, 100);
```

### CORS

```javascript
// Backend only
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : '*'
};
app.use(cors(corsOptions));
```

---

## Debug Guidelines

### Console Logging (Development Only)

```javascript
// Good logging (informative, prefixed)
console.log('[NASA API] Fetching APOD for date:', date);
console.error('[Cache] Failed to retrieve key:', key, error);

// Remove all console.logs before production build
// Or use a logger library like winston
```

### Error Boundaries

```javascript
// Wrap app with error boundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

---

## Documentation

### Component Documentation

```javascript
/**
 * EventCard Component
 * 
 * Displays a celestial event with countdown timer and viewing instructions.
 * 
 * @param {Object} event - Event data
 * @param {string} event.name - Event name
 * @param {Date} event.date - Event date/time
 * @param {string} event.type - Event type (meteor-shower, eclipse, etc.)
 * @param {string} event.instructions - Viewing instructions
 */
export function EventCard({ event }) {
  // ...
}
```

### Function Documentation

```javascript
/**
 * Calculate sky visibility rating based on cloud cover
 * @param {number} cloudCover - Cloud cover percentage (0-100)
 * @returns {string} Rating: "excellent" | "good" | "fair" | "poor"
 */
export function calculateVisibility(cloudCover) {
  if (cloudCover < 20) return 'excellent';
  if (cloudCover < 50) return 'good';
  if (cloudCover < 80) return 'fair';
  return 'poor';
}
```

---

## Deployment Checklist

### Before Deploying

- [ ] All environment variables set in hosting platform
- [ ] Build succeeds without errors (`npm run build`)
- [ ] All API keys working
- [ ] CORS configured for production domain
- [ ] No console.logs in production code
- [ ] All placeholder content replaced with real content
- [ ] README updated with live demo URL
- [ ] Lighthouse score > 90

---

## Quick Reference

### Tailwind Custom Classes

```javascript
// From tailwind.config.js
colors: {
  'bg-primary': '#0B0D17',
  'bg-secondary': '#1B1D2A',
  'bg-tertiary': '#252840',
  'electric-blue': '#4F9CF7',
  'cosmic-purple': '#7C5CFC',
  'solar-amber': '#FFB800',
  'aurora-green': '#00E676',
  'star-white': '#E8EAED',
  'muted-gray': '#9AA0A6',
  'faint-gray': '#5F6368',
  'danger-red': '#FF5252',
}

fontFamily: {
  heading: ['"Space Grotesk"', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'monospace'],
}
```

### Common Lucide Icons

```javascript
import {
  Home,           // Home page
  Satellite,      // Tracker
  Rocket,         // Missions
  Earth,          // Impact
  GraduationCap,  // Learn
  Calendar,       // Calendar
  MapPin,         // Location
  Clock,          // Time/countdown
  Activity,       // Live indicator
  AlertCircle,    // Error
  Info,           // Info
  X,              // Close
  Search,         // Search
  ExternalLink,   // External link
  Download        // Download
} from 'lucide-react';
```

---

## When in Doubt

1. **Check the docs folder** - requirements.md, design.md, architecture.md
2. **Keep it simple** - This is a hackathon, not production software
3. **Prioritize working features** over perfect code
4. **Mobile-first** - Always design for smallest screen first
5. **User-friendly language** - Explain like you're talking to a 14-year-old
6. **Reuse components** - Don't reinvent the wheel
7. **Test on real devices** - Not just browser DevTools
8. **Ask for clarification** - Better than guessing wrong

---

**Remember:** The goal is a working demo in 24 hours. Focus on P0 features first, polish later!
