# AstroView - Task Breakdown

## Build Priority Order

**P0 (Must Have):** Core functionality that demonstrates the concept  
**P1 (Should Have):** Enhances the experience significantly  
**P2 (Nice to Have):** Polish and additional features  

---

## Phase 0: Documentation & Setup ✓

### Documentation
- [x] Create requirements.md
- [x] Create tech-stack.md
- [x] Create design.md
- [x] Create architecture.md
- [x] Create tasks.md (this file)
- [x] Create api-reference.md
- [x] Create copilot-instructions.md

### Project Setup
- [x] Create .gitignore (root + client + server)
- [x] Create .env.example (root + client + server)
- [x] Create README.md (comprehensive with setup instructions)
- [x] Copy copilot-instructions.md to .github/

---

## Phase 1: Foundation (Project Initialization) ✓

**Priority:** P0  
**Time Estimate:** 2 hours  
**Dependencies:** None

### Client Setup
- [x] Initialize Vite React project in /client
- [x] Install dependencies:
  - [x] react, react-dom, react-router-dom
  - [x] tailwindcss, postcss, autoprefixer
  - [x] framer-motion
  - [x] axios, axios-retry
  - [x] date-fns
  - [x] lucide-react
  - [x] react-hot-toast
- [x] Configure Tailwind with custom theme
  - [x] Add custom colors (electric-blue, cosmic-purple, etc.)
  - [x] Add font families (Space Grotesk, Inter, JetBrains Mono)
  - [x] Configure breakpoints
  - [x] Add custom animations (shimmer, pulse-slow)
- [x] Set up Google Fonts in index.html
- [x] Create index.css with Tailwind imports and global styles
- [x] Configure Vite (alias paths, build settings)
- [x] Set up React Router in App.jsx
- [x] Create basic folder structure (components, pages, hooks, services, utils, data, context)

### Server Setup
- [x] Initialize Node.js project in /server
- [x] Install dependencies:
  - [x] express
  - [x] cors
  - [x] dotenv
  - [x] node-cache
  - [x] axios
- [x] Install dev dependencies:
  - [x] nodemon
- [x] Create index.js with Express server
- [x] Set up CORS middleware
- [x] Create folder structure (routes, controllers, middleware, utils)
- [x] Create cache middleware (cache.js)
- [x] Create error handler middleware (errorHandler.js)
- [x] Create .env.example with all API key placeholders

### Environment Configuration
- [x] Create client/.env with VITE_API_BASE_URL
- [x] Create server/.env with PORT and API key placeholders
- [x] Test local development setup (client + server running concurrently)

---

## Phase 2: Core Components & Layout ✓

**Priority:** P0  
**Time Estimate:** 3 hours  
**Dependencies:** Phase 1

### Layout Components
- [x] Create Layout.jsx (wrapper with sidebar/bottom nav)
- [x] Create Sidebar.jsx (desktop navigation)
  - [x] Logo/title at top
  - [x] 5 nav items with icons (Home, Tracker, Missions, Impact, Learn)
  - [x] Active state styling
  - [x] Smooth transitions
- [x] Create BottomNav.jsx (mobile navigation)
  - [x] Same 5 nav items
  - [x] Icon + label (label optional on small screens)
  - [x] Active indicator
- [x] Create Navbar.jsx (mobile top bar with logo + menu)
- [x] Create Footer.jsx (credits, API attributions, links)

### Common/Reusable Components
- [x] Create Card.jsx
  - [x] Variants: default, hover-glow, selected
  - [x] Optional: title, description, footer slots
- [x] Create Button.jsx
  - [x] Variants: primary (gradient), secondary (border), ghost
  - [x] Sizes: sm, md, lg
  - [x] Loading state (spinner)
  - [x] Icon support (leading/trailing)
- [x] Create Badge.jsx
  - [x] Variants: active, completed, planned, live
  - [x] Color coding by status
  - [x] Optional pulse animation
- [x] Create Skeleton.jsx
  - [x] Variants: text, card, image, circular
  - [x] Shimmer animation
- [x] Create Modal.jsx
  - [x] Overlay with backdrop blur
  - [x] Close button (X icon)
  - [x] Focus trap
  - [x] Close on ESC key
- [x] Create ErrorFallback.jsx
  - [x] Error icon (AlertCircle)
  - [x] Message + retry button
  - [x] "Go Home" fallback option
- [x] Create EmptyState.jsx
  - [x] Icon prop
  - [x] Message + description
  - [x] Optional CTA button
- [x] Create SearchBar.jsx
  - [x] Magnifying glass icon
  - [x] Clear button (X) when has value
  - [x] Debounced onChange
- [x] Create CountdownTimer.jsx
  - [x] Display: days, hours, minutes, seconds
  - [x] Update every second
  - [x] Amber gradient styling
  - [x] Auto-stop when reached

### Page Scaffolds (Empty)
- [x] Create HomePage.jsx (empty scaffold)
- [x] Create TrackerPage.jsx (empty scaffold)
- [x] Create MissionsPage.jsx (empty scaffold)
- [x] Create ImpactPage.jsx (empty scaffold)
- [x] Create LearnPage.jsx (empty scaffold)
- [x] Create CalendarPage.jsx (empty scaffold)
- [x] Create NotFoundPage.jsx (styled 404 with navigation)

### Routing
- [x] Set up routes in App.jsx
- [ ] Add Suspense with loading fallback
- [ ] Lazy load all pages
- [ ] Test navigation between pages

---

## Phase 3: Context, Hooks & Services ✓

**Priority:** P0  
**Time Estimate:** 2 hours  
**Dependencies:** Phase 2

### Context Providers
- [x] Create LocationContext.jsx
  - [x] State: lat, lon, locationName, isLoading, error
  - [x] Methods: setLocation, autoDetect, clearLocation
  - [x] Persist to localStorage
- [x] Create UserContext.jsx
  - [x] State: quizScores, badges, completedPaths
  - [x] Methods: updateScore, addBadge, completeStep
  - [x] Persist to localStorage
- [x] Wrap App with providers

### Custom Hooks
- [x] Create useLocation.js
  - [x] Wrapper for Geolocation API
  - [x] Permission handling
  - [x] Error handling (denied, unavailable, timeout)
  - [x] Return: { location, loading, error, getLocation }
- [x] Create useApi.js
  - [x] Generic API call hook
  - [x] Return: { data, loading, error, refetch }
  - [x] Auto-retry on failure (3x)
- [x] Create useCountdown.js
  - [x] Input: target date
  - [x] Output: { days, hours, minutes, seconds, isExpired }
  - [x] Update every 1 second
- [x] Create useLocalStorage.js
  - [x] Wrapper for localStorage with JSON serialization
  - [x] Return: [value, setValue, removeValue]
- [x] Create useDebounce.js
  - [x] Debounce value changes (300ms default)
  - [x] Return: debouncedValue
- [x] Create useIntersectionObserver.js
  - [x] For lazy loading images
  - [x] Return: { ref, isIntersecting }

### Service Layer (Frontend API Clients)
- [x] Create api.js (Axios instance)
  - [x] Base URL from env
  - [x] 10s timeout
  - [x] Request/response interceptors
  - [x] Error handling
- [x] Create nasaService.js
  - [x] getAPOD()
  - [x] getNearEarthObjects(startDate, endDate)
  - [x] getSolarFlares(), getGeomagneticStorms(), getCME()
  - [x] getEONETEvents()
- [x] Create satelliteService.js
  - [x] getISSPosition()
  - [x] getSatellitePasses(noradId, lat, lon, days)
  - [x] getOverheadSatellites(lat, lon, radius)
- [x] Create astronomyService.js
  - [x] getMoonPhase(date)
  - [x] getPlanetPositions(lat, lon)
- [x] Create weatherService.js
  - [x] getSkyConditions(lat, lon)
- [x] Create aiService.js
  - [x] simplifyText(text, context)

### Utilities
- [x] Create formatters.js
  - [x] formatDate(date, format)
  - [x] formatDistance(distance)
  - [x] formatCoordinates(lat, lon)
  - [x] formatDuration(seconds)
- [x] Create constants.js
  - [x] Event type colors
  - [x] NORAD IDs (ISS: 25544)
  - [x] API endpoints
  - [x] Cache TTLs
- [x] Create helpers.js
  - [x] calculateVisibility(cloudCover)
  - [x] getEventIcon(eventType)
  - [x] getStatusColor(status)

---

## Phase 4: Backend API Routes ✓

**Priority:** P0  
**Time Estimate:** 4 hours  
**Dependencies:** Phase 3

### NASA Routes & Controllers
- [x] Create routes/nasa.js
  - [x] GET /api/nasa/apod (optional date param)
  - [x] GET /api/nasa/neo (start_date, end_date params)
  - [x] GET /api/nasa/solar-flares
  - [x] GET /api/nasa/geomagnetic-storms
  - [x] GET /api/nasa/cme
  - [x] GET /api/nasa/eonet
- [x] Create controllers/nasaController.js
  - [x] Implement all NASA API calls
  - [x] Error handling for each
  - [x] Response formatting

### Satellite Routes & Controllers
- [x] Create routes/satellite.js
  - [x] GET /api/satellite/iss
  - [x] GET /api/satellite/passes (query: noradId, lat, lon, days)
  - [x] GET /api/satellite/overhead (query: lat, lon, radius)
- [x] Create controllers/satelliteController.js
  - [x] Integrate N2YO API
  - [x] Demo mode for missing API keys
  - [x] Transform data to consistent format

### Astronomy Routes & Controllers
- [x] Create routes/astronomy.js
  - [x] GET /api/astronomy/moon-phase (query: date)
  - [x] GET /api/astronomy/planets (query: lat, lon, date)
- [x] Create controllers/astronomyController.js
  - [x] Integrate Astronomy API
  - [x] Handle Basic Auth for Astronomy API
  - [x] Demo data fallback

### Weather Routes & Controllers
- [x] Create routes/weather.js
  - [x] GET /api/weather/sky (query: lat, lon, days)
- [x] Create controllers/weatherController.js
  - [x] Integrate OpenWeatherMap API
  - [x] Extract relevant data (cloud cover, visibility, conditions)
  - [x] Support both current and forecast

### AI Routes & Controllers
- [x] Create routes/ai.js
  - [x] POST /api/ai/simplify (body: { text, context })
  - [x] POST /api/ai/simplify/ask (body: { question })
- [x] Create controllers/aiController.js
  - [x] Integrate Google Gemini API
  - [x] Build prompt for 14-year-old level
  - [x] Fallback to original text if unavailable

### Server Integration
- [x] Implement cache.js (already scaffolded)
  - [x] Check cache before controller
  - [x] Set cache after successful response
  - [x] Vary TTL by endpoint
- [x] Register all routes in server/index.js
- [x] Health check endpoint working: GET /health
- [x] Create server/README.md with API documentation

---

## Phase 5: Tonight's Sky (HomePage)

**Priority:** P0 (Core Feature)  
**Time Estimate:** 4 hours  
**Dependencies:** Phase 4

### Hero Section
- [ ] Fetch NASA APOD on mount
- [ ] Display full-width background image
- [ ] Add gradient overlay for readability
- [ ] Show title, date, and description
- [ ] Add "Explain Simply" toggle
- [ ] Loading skeleton for image
- [ ] Error handling with fallback image

### Location Picker
- [ ] Create LocationPicker.jsx component
- [ ] Auto-detect button (uses useLocation hook)
- [ ] Manual input (city search or lat/lon)
- [ ] Display current location with MapPin icon
- [ ] Update LocationContext on change
- [ ] Loading state during detection
- [ ] Permission denied handling

### Sky Conditions Widget
- [ ] Create SkyConditions.jsx component
- [ ] Fetch weather based on user location
- [ ] Display cloud cover percentage
- [ ] Show visibility rating (excellent/good/fair/poor)
- [ ] Weather icon (sun/cloud/rain)
- [ ] Best viewing time recommendation
- [ ] Refresh button

### Upcoming Events List
- [ ] Create EventCard.jsx component
  - [ ] Event icon (based on type)
  - [ ] Event name
  - [ ] Date/time
  - [ ] CountdownTimer component
  - [ ] Viewing instructions (collapsible)
  - [ ] "Explain Simply" toggle
- [ ] Create EventList.jsx component
  - [ ] Fetch events (hardcoded JSON for now, later integrate API)
  - [ ] Filter by event type (buttons)
  - [ ] Sort dropdown (date, visibility, type)
  - [ ] Grid layout (responsive)
  - [ ] EmptyState when no events
  - [ ] Skeleton loaders
- [ ] Create static celestial events data (next 7 days)
  - [ ] Include: meteor showers, planet visibility, ISS passes
  - [ ] Store in /client/src/data/events.json (temporary)

### Integration
- [ ] Connect all components in HomePage
- [ ] Add Framer Motion page transition
- [ ] Add stagger animation for event cards
- [ ] Mobile responsive layout
- [ ] Test with real Location and Weather APIs

---

## Phase 6: Live Sky Tracker (TrackerPage)

**Priority:** P0 (Core Feature)  
**Time Estimate:** 5 hours  
**Dependencies:** Phase 4

### ISS Real-Time Map
- [ ] Install react-leaflet and leaflet
- [ ] Create ISSMap.jsx component
  - [ ] Initialize Leaflet map with dark tiles (CartoDB Dark Matter)
  - [ ] Fetch ISS position on mount
  - [ ] Set interval to fetch every 5 seconds
  - [ ] Display ISS marker at current position
  - [ ] Show trajectory path (polyline from last 10 positions)
  - [ ] Auto-center map on ISS
  - [ ] Display lat/lon, altitude, velocity in overlay
  - [ ] Add live indicator (pulsing green dot)
  - [ ] Handle loading and error states
  - [ ] Clean up interval on unmount

### Satellite Info Panel
- [ ] Create SatelliteInfo.jsx component
  - [ ] Display ISS details (mission, crew, purpose)
  - [ ] Show current stats (velocity, altitude, orbit)
  - [ ] Next visible pass (time, direction)
  - [ ] Refresh button

### What's Above Me
- [ ] Create "What's Above Me" button
- [ ] Fetch overhead satellites on click
- [ ] Display list with:
  - [ ] Satellite name
  - [ ] Type/purpose (color-coded category)
  - [ ] Altitude
  - [ ] Velocity
- [ ] Auto-refresh every 30 seconds
- [ ] EmptyState if none overhead
- [ ] Loading spinner during fetch

### Pass Predictions
- [ ] Create PassPrediction.jsx component
- [ ] Fetch next 5 visible ISS passes for user location
- [ ] Display each pass:
  - [ ] Start time (with countdown)
  - [ ] Duration
  - [ ] Max elevation (degrees)
  - [ ] Compass directions (rise/set)
  - [ ] Brightness magnitude
- [ ] Only show visible passes (magnitude < 2.5)
- [ ] Add to calendar button (future)

### Integration
- [ ] Assemble TrackerPage with all components
- [ ] Layout: Map on left/top, info panels on right/bottom
- [ ] Responsive (stacked on mobile)
- [ ] Framer Motion animations
- [ ] Test with real satellite APIs

---

## Phase 7: Mission Control (MissionsPage)

**Priority:** P1 (Should Have)  
**Time Estimate:** 3 hours  
**Dependencies:** Phase 2

### Static Mission Data
- [ ] Create /client/src/data/missions.json
- [ ] Add 15-20 missions with:
  - [ ] id, name, agency, status, launchDate
  - [ ] description (simple language)
  - [ ] spacecraft, missionType
  - [ ] timeline (array of events)
  - [ ] impact (how it helps Earth/science)
  - [ ] images (array of URLs or placeholders)
  - [ ] crew (if applicable)

### Mission Card
- [ ] Create MissionCard.jsx component
  - [ ] Agency logo badge
  - [ ] Mission image
  - [ ] Mission name
  - [ ] Status badge (active/completed/planned)
  - [ ] Launch date
  - [ ] Hover animation (scale + glow)
  - [ ] Click to open modal

### Mission List & Filters
- [ ] Create search bar (SearchBar component)
- [ ] Create filter buttons (by agency)
- [ ] Create filter buttons (by status)
- [ ] Create sort dropdown (launch date, alphabetical)
- [ ] Filter logic (client-side)
- [ ] Display filtered missions in grid
- [ ] EmptyState when no matches
- [ ] Skeleton loaders

### Mission Detail Modal
- [ ] Create MissionDetail.jsx component (modal content)
- [ ] Tabs: Overview, Timeline, Impact, Media
- [ ] Overview tab:
  - [ ] Mission objective (simplified)
  - [ ] Spacecraft details
  - [ ] Crew (if human mission)
- [ ] Timeline tab:
  - [ ] Create MissionTimeline.jsx
  - [ ] Visual timeline with events (launch, milestones, completion)
  - [ ] Date markers
- [ ] Impact tab:
  - [ ] Plain-language explanation of mission's importance
  - [ ] Real-world applications
- [ ] Media tab:
  - [ ] Image gallery (3-5 images)
  - [ ] Lightbox on click
- [ ] "Explain Simply" toggle on overview

### Integration
- [ ] Assemble MissionsPage
- [ ] Test search, filter, sort
- [ ] Test modal open/close
- [ ] Responsive layout
- [ ] Animations

---

## Phase 8: Space to Earth (ImpactPage)

**Priority:** P1 (Should Have)  
**Time Estimate:** 3 hours  
**Dependencies:** Phase 4

### Static Impact Data
- [ ] Create /client/src/data/impactData.json
- [ ] Categories: Climate, Agriculture, Disaster, Navigation, Communication
- [ ] Each category:
  - [ ] Icon, description, satellite count
  - [ ] 3-5 impact stories with:
    - [ ] title, description, satellites, example, image

### Impact Categories
- [ ] Create ImpactCategory.jsx component
  - [ ] Category icon (Earth, Leaf, AlertTriangle, Navigation, Radio)
  - [ ] Category name
  - [ ] Description
  - [ ] Satellite count badge
  - [ ] Click to expand stories

### Impact Cards
- [ ] Create ImpactCard.jsx component
  - [ ] Title
  - [ ] Description
  - [ ] Satellites involved (badges)
  - [ ] Real-world example
  - [ ] Image (optional)
  - [ ] "Explain Simply" toggle

### Live Earth Events Map
- [ ] Create EarthEventsMap.jsx component
- [ ] Fetch EONET events
- [ ] Display on Leaflet map
- [ ] Color-code by category (wildfires, storms, etc.)
- [ ] Custom markers with icons
- [ ] Click event for details popup
- [ ] Auto-refresh every 10 minutes
- [ ] Filter by event type

### Near-Earth Objects Section
- [ ] Fetch NEO data from NASA NeoWs
- [ ] Display upcoming asteroids (next 30 days)
- [ ] Show: name, size, closest approach date, miss distance
- [ ] Visual size comparison icons
- [ ] Safety indicator (green/amber)
- [ ] Sort by approach date

### Integration
- [ ] Assemble ImpactPage
- [ ] Layout: Categories at top, map in middle, NEO at bottom
- [ ] Responsive
- [ ] Animations
- [ ] Test with EONET and NeoWs APIs

---

## Phase 9: Learn & Explore (LearnPage)

**Priority:** P1 (Should Have)  
**Time Estimate:** 4 hours  
**Dependencies:** Phase 2, Phase 3

### Static Learning Data
- [ ] Create /client/src/data/glossary.json
  - [ ] 30-40 terms with: term, pronunciation, definition, category, visualExample
- [ ] Create /client/src/data/quizzes.json
  - [ ] 5-7 quizzes with: id, title, description, questions[]
  - [ ] Each question: question, options[], correctAnswer, explanation
- [ ] Create /client/src/data/learningPaths.json
  - [ ] 3-5 paths with: id, title, description, steps[]
  - [ ] Each step: title, type (content/quiz/external), content/link

### Glossary Section
- [ ] Create GlossaryItem.jsx component
  - [ ] Term (heading)
  - [ ] Pronunciation (muted)
  - [ ] Category badge
  - [ ] Definition
  - [ ] Expandable for visual example
  - [ ] "Explain Simply" toggle
- [ ] Search bar for glossary
- [ ] Filter by category (dropdown)
- [ ] Alphabetical index navigation (A-Z)
- [ ] Responsive grid

### Quiz Section
- [ ] Create QuizCard.jsx component (quiz selector)
  - [ ] Quiz title
  - [ ] Description
  - [ ] Question count
  - [ ] High score (from localStorage)
  - [ ] "Start Quiz" button
- [ ] Create Quiz.jsx component (active quiz)
  - [ ] Progress bar (question x of y)
  - [ ] Question text
  - [ ] Answer buttons (4 options)
  - [ ] Immediate feedback (correct/incorrect)
  - [ ] Explanation after answer
  - [ ] Next question button
  - [ ] Score display at end
  - [ ] Retry button
  - [ ] Save score to UserContext
- [ ] Quiz list/grid on LearnPage
- [ ] Modal for active quiz

### Learning Paths Section
- [ ] Create LearningPath.jsx component
  - [ ] Path title
  - [ ] Description
  - [ ] Progress bar (steps completed / total)
  - [ ] "Start" or "Continue" button
- [ ] Create LearningPathDetail.jsx (modal)
  - [ ] List of steps with completion checkmarks
  - [ ] Click step to expand content
  - [ ] Mark step as complete button
  - [ ] Track progress in UserContext
  - [ ] Completion badge on finish

### Badge System
- [ ] Create BadgeDisplay.jsx component
  - [ ] Show earned badges with icons
  - [ ] Badge types: Quiz Master, Path Completer, Streak badges
  - [ ] Locked vs. unlocked states
  - [ ] Tooltips with unlock requirements
- [ ] Logic to award badges:
  - [ ] Quiz score 100% = Quiz Master badge
  - [ ] Complete learning path = Path Completer badge
  - [ ] Store in UserContext

### Integration
- [ ] Assemble LearnPage with tabs or sections
- [ ] Layout: Glossary, Quizzes, Learning Paths, Badges
- [ ] Responsive
- [ ] Animations (flip for badges, confetti on quiz completion)
- [ ] Test persistence in localStorage

---

## Phase 10: AI Explain Simply Feature

**Priority:** P2 (Nice to Have)  
**Time Estimate:** 2 hours  
**Dependencies:** Phase 4 (AI backend)

### AI Component
- [ ] Create ExplainSimply.jsx component
  - [ ] Toggle button with sparkle icon
  - [ ] Click sends text to AI service
  - [ ] Display simplified response in modal or expandable section
  - [ ] Loading spinner (up to 5s)
  - [ ] Error handling with retry
  - [ ] Fallback to pre-written simple explanations

### Pre-written Fallbacks
- [ ] Create /client/src/data/simplifications.json
- [ ] Add pre-written simple explanations for:
  - [ ] Common terms (orbit, trajectory, aphelion, etc.)
  - [ ] Common missions (Artemis, Mars 2020, etc.)
  - [ ] Use as fallback if AI fails

### Integration
- [ ] Add ExplainSimply toggle to:
  - [ ] EventCard (celestial events)
  - [ ] MissionDetail (mission descriptions)
  - [ ] GlossaryItem (term definitions)
  - [ ] ImpactCard (impact stories)
- [ ] Cache AI responses in backend (test caching works)
- [ ] Test with Gemini API

---

## Phase 11: Calendar & Alerts (CalendarPage)

**Priority:** P2 (Nice to Have)  
**Time Estimate:** 3 hours  
**Dependencies:** Phase 5 (events data)

### Calendar View
- [ ] Create CalendarPage.jsx
- [ ] Month grid layout (7 columns, 5-6 rows)
- [ ] Display current month/year with navigation arrows
- [ ] Highlight today
- [ ] Show events on calendar dates (colored dots)
- [ ] Color-code by event type
- [ ] Click date to see events for that day

### Event Details (Click Date)
- [ ] Modal or side panel showing all events for selected date
- [ ] EventCard components (reuse from HomePage)
- [ ] "Add to Calendar" button per event

### Calendar Export
- [ ] Generate Google Calendar URL
  - [ ] Format: https://calendar.google.com/calendar/render?action=TEMPLATE&text={title}&dates={start}/{end}&details={description}
- [ ] Download .ics file (iCalendar format)
  - [ ] Library: ics.js or manual generation
  - [ ] Include: title, start time, duration, location (sky), description
- [ ] "Add All to Calendar" bulk export (generate single .ics with all events)

### Notification Center
- [ ] Create NotificationCenter.jsx component (dropdown)
- [ ] Bell icon in header with unread count badge
- [ ] List upcoming events (within 48 hours)
- [ ] Mark as read functionality
- [ ] Clear all button
- [ ] Store read status in localStorage

### Integration
- [ ] Add NotificationCenter to Navbar/Sidebar
- [ ] Test calendar navigation
- [ ] Test export functionality
- [ ] Responsive layout

---

## Phase 12: Polish & Responsiveness

**Priority:** P1  
**Time Estimate:** 3 hours  
**Dependencies:** All previous phases

### Responsive Design Review
- [ ] Test all pages on mobile (375px)
- [ ] Test all pages on tablet (768px)
- [ ] Test all pages on desktop (1024px, 1440px)
- [ ] Fix layout issues (overflow, alignment, spacing)
- [ ] Ensure touch targets are 44x44px minimum
- [ ] Test navigation (sidebar → bottom tab on mobile)

### Animation Polish
- [ ] Add page transitions (fade + slide)
- [ ] Add card entrance animations (stagger)
- [ ] Add hover states to all interactive elements
- [ ] Add loading animations (skeletons, spinners)
- [ ] Ensure all animations under 300ms
- [ ] Test `prefers-reduced-motion` support

### Accessibility Audit
- [ ] All images have alt text
- [ ] All icon buttons have aria-labels
- [ ] All form inputs have labels
- [ ] Keyboard navigation works (tab, enter, escape)
- [ ] Focus indicators visible
- [ ] Color contrast ratios meet WCAG AA (use tool)
- [ ] Test with screen reader (NVDA or VoiceOver)
- [ ] Add skip to content link

### Error Handling Review
- [ ] All API calls have error states
- [ ] User-friendly error messages (no jargon)
- [ ] Retry buttons where applicable
- [ ] Global error boundary (catch React errors)
- [ ] Toast notifications for user actions

### Performance Optimization
- [ ] Lazy load images (use loading="lazy" or IntersectionObserver)
- [ ] Code split routes (React.lazy already done)
- [ ] Audit bundle size (npm run build → check dist size)
- [ ] Remove unused dependencies
- [ ] Minify production build (Vite does this)
- [ ] Test loading times on slow 3G (Chrome DevTools)

### Content Review
- [ ] All text is jargon-free and suitable for age 14+
- [ ] No Lorem Ipsum remaining
- [ ] All data accurate (double-check mission details)
- [ ] Credits/attributions for APIs and images
- [ ] Privacy policy placeholder (if collecting location)

---

## Phase 13: Testing & Bug Fixes

**Priority:** P0  
**Time Estimate:** 2 hours  
**Dependencies:** Phase 12

### Manual Testing Checklist
- [ ] All links/buttons work
- [ ] All forms validate inputs correctly
- [ ] All API integrations working (NASA, satellites, weather, AI)
- [ ] Caching working (check network tab, should see reduced calls)
- [ ] LocalStorage persisting data (location, scores, badges)
- [ ] Modals open/close correctly
- [ ] Maps render and update
- [ ] Timers count down accurately
- [ ] Search and filters work
- [ ] No console errors or warnings

### Cross-Browser Testing
- [ ] Chrome (primary)
- [ ] Firefox
- [ ] Safari (macOS and iOS)
- [ ] Edge
- [ ] Fix browser-specific issues

### Bug Fix Sprint
- [ ] Prioritize critical bugs (blocking functionality)
- [ ] Fix layout bugs (responsive issues)
- [ ] Fix animation bugs (janky transitions)
- [ ] Fix data bugs (incorrect values, formatting)
- [ ] Document known issues (create issues.md if needed)

---

## Phase 14: Documentation & Deployment

**Priority:** P0  
**Time Estimate:** 2 hours  
**Dependencies:** Phase 13

### API Reference Documentation
- [ ] Complete api-reference.md with all endpoints
- [ ] Request/response examples
- [ ] Error codes
- [ ] Rate limits
- [ ] Cache TTLs

### Copilot Instructions
- [ ] Complete copilot-instructions.md
- [ ] Move to .github/copilot-instructions.md

### README Updates
- [ ] Add screenshots/GIFs of features
- [ ] Installation instructions
- [ ] API key setup instructions
- [ ] Local development guide
- [ ] Deployment guide
- [ ] Credits and attributions
- [ ] Team info
- [ ] License (MIT recommended)

### Deployment Preparation
- [ ] Create Vercel account (if not exists)
- [ ] Create Railway account (if using for backend)
- [ ] Prepare environment variables for production

### Frontend Deployment (Vercel)
- [ ] Connect GitHub repo to Vercel
- [ ] Configure build settings:
  - [ ] Root directory: client
  - [ ] Build command: npm run build
  - [ ] Output directory: dist
- [ ] Add environment variables:
  - [ ] VITE_API_BASE_URL (backend URL)
- [ ] Deploy and test production build
- [ ] Verify all assets load (fonts, images)

### Backend Deployment
- [ ] Option A: Vercel Serverless Functions
  - [ ] Adapt routes to serverless format
  - [ ] Deploy to /api directory
- [ ] Option B: Railway
  - [ ] Connect GitHub repo
  - [ ] Configure environment variables
  - [ ] Deploy and get public URL
- [ ] Test all API endpoints in production
- [ ] Update frontend VITE_API_BASE_URL to production backend

### Post-Deployment
- [ ] Test full app in production
- [ ] Check Lighthouse scores (aim for 90+)
- [ ] Fix any production-only issues
- [ ] Share production URL

---

## Phase 15: Demo Preparation

**Priority:** P0  
**Time Estimate:** 1 hour  
**Dependencies:** Phase 14

### Demo Script
- [ ] Write 3-minute demo script highlighting:
  - [ ] Problem statement (scattered space data)
  - [ ] Solution (unified hub)
  - [ ] Target audience (students, educators, enthusiasts)
  - [ ] Key features walkthrough (Tonight's Sky → Tracker → Missions → Impact → Learn)
  - [ ] Technical highlights (APIs, caching, AI)
  - [ ] Future enhancements
- [ ] Practice demo multiple times
- [ ] Prepare for Q&A

### Demo Data
- [ ] Ensure demo date has interesting events (meteor shower, ISS pass)
- [ ] Pre-load high scores and badges for demo user
- [ ] Have backup screenshots if live demo fails

### Presentation Materials
- [ ] Create slide deck (5-7 slides):
  - [ ] Title slide (AstroView logo, tagline)
  - [ ] Problem & Solution
  - [ ] Key Features (screenshots)
  - [ ] Tech Stack
  - [ ] Architecture diagram
  - [ ] Demo (live or video)
  - [ ] Thank you + Q&A
- [ ] Export slides to PDF (backup)

---

## Post-Hackathon Enhancements (Future)

### Priority P3 (Nice to Have)
- [ ] Add user accounts (authentication with NextAuth.js)
- [ ] Migrate to Next.js for SSR/SSG
- [ ] Add more astronomical events (comets, planet conjunctions)
- [ ] Integrate more space agencies (JAXA, CSA)
- [ ] Add user bookmarks and favorites
- [ ] Add social sharing (Twitter, Facebook)
- [ ] Add browser push notifications
- [ ] Dark sky location finder (light pollution map)
- [ ] Equipment recommendations based on events
- [ ] Astrophotography tips and guides
- [ ] Community features (share observations)
- [ ] Multi-language support (i18n)
- [ ] Advanced orbital mechanics visualizations
- [ ] Integration with telescope mounts
- [ ] Podcast/video content embedding
- [ ] Offline mode with service workers
- [ ] Progressive Web App (PWA) features

---

## Time Estimates Summary

| Phase | Description | Time | Priority |
|-------|-------------|------|----------|
| 0 | Documentation & Setup | 1h | P0 |
| 1 | Foundation | 2h | P0 |
| 2 | Core Components & Layout | 3h | P0 |
| 3 | Context, Hooks & Services | 2h | P0 |
| 4 | Backend API Routes | 4h | P0 |
| 5 | Tonight's Sky (HomePage) | 4h | P0 |
| 6 | Live Sky Tracker | 5h | P0 |
| 7 | Mission Control | 3h | P1 |
| 8 | Space to Earth | 3h | P1 |
| 9 | Learn & Explore | 4h | P1 |
| 10 | AI Explain Simply | 2h | P2 |
| 11 | Calendar & Alerts | 3h | P2 |
| 12 | Polish & Responsiveness | 3h | P1 |
| 13 | Testing & Bug Fixes | 2h | P0 |
| 14 | Documentation & Deployment | 2h | P0 |
| 15 | Demo Preparation | 1h | P0 |
| **Total** | | **44h** | |

**Note:** This is a 24-hour hackathon. Prioritize P0 features first, then P1 if time permits. P2 features can be skipped if running low on time.

**Recommended Minimum for Demo:**
- Phases 0-6 (core functionality): ~21 hours
- Phase 12 (responsiveness): 3 hours
- Phases 13-15 (testing, deployment, demo): 5 hours
- **Total minimum:** 29 hours (with buffer for debugging)

**If time is tight, skip or simplify:**
- Phase 11 (Calendar) - P2
- Phase 10 (AI) - P2
- Phase 9 (Learn page) - reduce to glossary only
- Phase 8 (Impact page) - reduce to static content only
