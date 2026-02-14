# AstroView - Product Requirements Document

## Project Overview

**Project Name:** AstroView  
**Tagline:** Your Personal Window to the Universe  
**Target Audience:** Students (14+), educators, space enthusiasts, general public  
**Reading Level:** 8th grade (no jargon, simplified explanations)  
**Platform:** Web Application (Desktop + Mobile Responsive)  
**Development Timeline:** 24-hour hackathon  

### Vision Statement

AstroView transforms complex, scattered space data into meaningful, accessible, and actionable insights for everyday users. It serves as a unified hub where anyone can discover what's happening in space right now, understand how it affects them, and learn about space in an engaging, visual-first way.

---

## Functional Requirements

### FR1: Tonight's Sky (Home Page)

**Priority:** P0 (Must Have)

#### FR1.1 Hero Section
- Display NASA Astronomy Picture of the Day (APOD) as hero image
- Show title, date, and explanation below image
- Include "Explain Simply" AI toggle for simplified explanation
- Auto-refresh daily at midnight UTC

#### FR1.2 Location Detection
- Auto-detect user's location using browser geolocation API
- Allow manual location input via city search or lat/long
- Store location preference in localStorage
- Display current location name in header

#### FR1.3 Upcoming Celestial Events
- Display personalized list of celestial events visible from user's location
- Show events for next 7 days by default
- Include event countdown timers (days, hours, minutes)
- Event types: meteor showers, eclipses, planet visibility, ISS passes, conjunctions
- Event cards show: name, date/time, visibility conditions, viewing instructions

#### FR1.4 Event Filtering & Sorting
- Filter by event type (all, meteor showers, eclipses, planets, ISS, conjunctions)
- Sort by: date (default), visibility (best first), type
- Search events by keyword

#### FR1.5 Sky Visibility Conditions
- Display current weather affecting sky visibility (cloud cover, precipitation)
- Show visibility forecast for tonight (clear/partly cloudy/cloudy)
- Aurora visibility indicator (when applicable based on location)
- Light pollution index (estimated based on location type)

#### FR1.6 Viewing Instructions
- Plain-language instructions for each event ("Look south after sunset")
- Best viewing time recommendation
- Equipment needed (naked eye / binoculars / telescope)
- Difficulty level (easy / moderate / challenging)

### FR2: Live Sky Tracker

**Priority:** P0 (Must Have)

#### FR2.1 ISS Real-Time Tracking
- Display ISS position on interactive map (Leaflet with dark space tiles)
- Auto-refresh position every 5 seconds
- Show ISS velocity, altitude, latitude, longitude
- Display live indicator (pulsing green dot)
- Show trajectory path (last 10 positions with fading trail)

#### FR2.2 What's Above Me
- Button to show satellites currently overhead (within 500km radius)
- List satellites with: name, type/purpose, altitude, velocity
- Update list every 30 seconds
- Color-code by category (ISS, communication, weather, GPS, science)

#### FR2.3 Satellite Pass Predictions
- Show next 5 visible passes of ISS over user's location
- Display start time, duration, max elevation, brightness (magnitude)
- Include compass directions (rise in NE, set in SW)
- Mark visible passes only (magnitude brighter than 2.5)

#### FR2.4 Satellite Details
- Click any satellite for detail modal
- Show: launch date, purpose/mission, orbit type, country/agency
- Link to mission website (if available)
- Real-world impact description (what it does for us)

### FR3: Mission Control

**Priority:** P1 (Should Have)

#### FR3.1 Mission Catalog
- Display 15-20 active and historical space missions
- Static data from missions.json (manually curated)
- Include: NASA, ISRO, ESA, SpaceX, CNSA, Roscosmos missions
- Each mission card shows: name, agency logo, status, launch date, mission badge/image

#### FR3.2 Search & Filter
- Search by mission name or keyword
- Filter by: agency, status (active/completed/planned), mission type
- Sort by: launch date, alphabetical, status

#### FR3.3 Mission Detail Modal
- Click mission card to open full detail modal
- Tabs: Overview, Timeline, Impact, Media
- Overview: mission objective in simple terms, spacecraft details, crew (if human)
- Timeline: Visual timeline with key milestones (launch, orbit insertion, landing, etc.)
- Impact: How this mission affects life on Earth or advances science
- Media: Gallery of 3-5 mission images

#### FR3.4 Mission Status Indicators
- Active: green pulse animation
- Completed: gray checkmark
- Planned: amber clock icon
- Failed: red X (with respectful description)

### FR4: Space to Earth (Impact)

**Priority:** P1 (Should Have)

#### FR4.1 Impact Categories
- Five main categories: Climate Monitoring, Agriculture, Disaster Response, Navigation, Communication
- Category cards with icon, description, satellite count
- Click category to see detailed impact stories

#### FR4.2 Impact Stories
- 3-5 impact cards per category
- Each card: title, description, satellites involved, real-world example
- Example: "Predicting Droughts with GRACE Satellites" → explains groundwater monitoring → shows recent drought detected

#### FR4.3 Live Earth Events Map
- Display NASA EONET events on interactive map
- Event types: wildfires, storms, floods, volcanoes, Air Quality, icebergs
- Color-coded by category
- Click event for details: date, location, satellite data source
- Auto-refresh every 10 minutes

#### FR4.4 Near-Earth Objects
- List of asteroids approaching Earth in next 30 days
- Show: name/designation, size estimate, closest approach date, miss distance
- Visual size comparison (car, house, stadium)
- "Is it dangerous?" indicator (green = safe, amber = being monitored)

### FR5: Learn & Explore

**Priority:** P1 (Should Have)

#### FR5.1 Glossary
- Searchable glossary with 30-40 space terms
- Terms include: plain-language definition, pronunciation, visual example/diagram
- Categories: Orbits, Spacecraft, Phenomena, Instrumentation, Astronomy
- Alphabetical index + category filter

#### FR5.2 Quizzes
- 5-7 quizzes on different topics (Satellites 101, Solar System, Space Missions)
- Each quiz: 5-10 multiple choice questions
- Immediate feedback on answers (correct/incorrect with explanation)
- Score tracking and percentage display
- Store highest score in localStorage
- Retry option

#### FR5.3 Learning Paths
- Guided multi-step learning experiences
- 3-5 learning paths: "Beginner's Guide to Space", "Understanding Satellites", "Exploring the Solar System"
- Each path: 4-6 steps combining content, quizzes, external resources
- Progress tracking with visual progress bar
- Store progress in localStorage
- Completion badges

#### FR5.4 Badge System
- Earn badges for completing quizzes and learning paths
- Badge types: Quiz Master (score 100%), Path Completer, Streak badges
- Display earned badges on profile/learn page
- Visual badge designs with icons

### FR6: AI Explain Simply

**Priority:** P2 (Nice to Have)

#### FR6.1 Simplification Toggle
- Available on: event cards, mission details, glossary terms, impact stories
- Toggle button with wand/sparkle icon
- Sends content to Gemini API via backend
- Displays simplified explanation in modal or expandable section

#### FR6.2 Reading Level Target
- All AI responses at 5th-6th grade reading level
- Avoid jargon, use analogies and everyday examples
- Responses limited to 100-150 words
- Prompt engineering ensures consistent quality

#### FR6.3 Caching & Fallbacks
- Cache AI responses for 24 hours (same content = same response)
- Fallback to pre-written simple explanations if API fails
- Show loading spinner during API call (max 5s timeout)
- Error handling with retry option

### FR7: Calendar & Alerts

**Priority:** P2 (Nice to Have)

#### FR7.1 Event Calendar View
- Monthly calendar grid showing all celestial events
- Events color-coded by type
- Hover shows event preview
- Click date to see all events that day
- Navigate between months

#### FR7.2 Calendar Export
- Generate Google Calendar URL for individual events
- Download .ics file for events (compatible with Outlook, Apple Calendar)
- "Add All to Calendar" bulk export option

#### FR7.3 Notification Center
- Dropdown bell icon in header showing upcoming events (within 48 hours)
- Unread count badge
- Mark as read functionality
- Clear all option

---

## Non-Functional Requirements

### NFR1: Performance

- Initial page load: < 3 seconds on 4G connection
- API response time: < 2 seconds (with caching)
- Map rendering: < 1 second
- Smooth animations: 60 FPS (all animations < 300ms)
- Lazy load images and heavy components
- Code splitting per route

### NFR2: Accessibility

- WCAG 2.1 AA compliance minimum
- Semantic HTML throughout
- All interactive elements keyboard accessible
- Focus indicators visible on all focusable elements
- Alt text for all images
- ARIA labels for icon-only buttons
- Color contrast ratio ≥ 4.5:1 for text
- Screen reader tested
- Reduced motion support (respect prefers-reduced-motion)

### NFR3: Responsive Design

- Mobile-first approach
- Breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (large)
- Touch-friendly targets (min 44x44px)
- Responsive navigation (sidebar → bottom tab bar on mobile)
- Responsive typography (fluid clamp values)
- Tested on: Chrome, Firefox, Safari (iOS + macOS), Edge

### NFR4: Error Handling

- All API calls wrapped in try-catch
- User-friendly error messages (no technical jargon)
- Retry mechanisms for failed API calls (max 3 retries with exponential backoff)
- Offline fallback content where possible
- Global error boundary to catch rendering errors
- Toast notifications for user actions (success/error/info)

### NFR5: Security

- No API keys exposed in frontend code
- All external API calls proxied through backend
- Environment variables for all sensitive data
- CORS configured for production domains only
- Input sanitization for user-provided data
- Rate limiting on backend endpoints (100 req/min per IP)

### NFR6: SEO & Meta

- Descriptive page titles and meta descriptions
- Open Graph tags for social sharing
- Semantic HTML structure
- Sitemap.xml (post-deployment)
- robots.txt
- Favicon and app icons

### NFR7: Code Quality

- ESLint with Airbnb config (relaxed)
- Prettier for code formatting
- Component file size < 150 lines (split if larger)
- Meaningful variable and function names
- Comments for complex logic only
- No console.logs in production
- PropTypes or TypeScript interfaces (if time permits)

### NFR8: Deployment

- Frontend: Vercel (automatic deployments from main branch)
- Backend: Vercel Serverless Functions or Railway
- Environment variables configured in hosting platform
- Custom domain (if available)
- HTTPS enforced
- Build time < 2 minutes

---

## User Stories

### As a student interested in space...
- I want to know when I can see the ISS from my backyard, so I can watch it with my family
- I want simple explanations of space terms, so I can understand articles without getting confused
- I want to test my knowledge with quizzes, so I can learn while having fun

### As an educator...
- I want a reliable source of current space events, so I can reference them in my lessons
- I want impact stories showing space tech in everyday life, so students see real-world relevance
- I want shareable calendar events, so students can participate in viewing events

### As a space enthusiast...
- I want to track multiple satellites in real-time, so I can observe them overhead
- I want detailed mission information in one place, so I don't have to visit multiple websites
- I want aurora forecasts and space weather, so I can plan astrophotography trips

### As a general user with no space background...
- I want beautiful space imagery, so I feel inspired to learn more
- I want jargon-free explanations, so I'm not intimidated by technical content
- I want to understand how satellites help me, so I appreciate space technology

---

## Out of Scope (For This Hackathon)

- User accounts and authentication
- Social features (comments, sharing, likes)
- Push notifications (browser notifications)
- Mobile native apps (iOS/Android)
- Telescope control integration
- Live streaming from space stations
- User-generated content
- Weather station data integration
- Astrophotography gallery
- Multiplayer quiz competitions
- Virtual reality sky views
- Detailed orbital mechanics calculations

---

## Success Metrics

- User can complete first interaction (view event) within 30 seconds of landing
- At least 3 API integrations working reliably
- Mobile and desktop layouts both fully functional
- AI simplification working for at least one content type
- Zero critical bugs affecting core flows
- All P0 features complete and demonstrated
- Documentation complete enough for judges to understand the project

---

## Future Enhancements (Post-Hackathon)

- User accounts with saved preferences and bookmarks
- Browser push notifications for upcoming events
- Integration with telescope mounts for auto-pointing
- Community features (share observations, photos)
- More detailed orbital mechanics visualizations
- Integration with more space agencies (JAXA, CSA)
- Podcast/video content embedding
- Multi-language support
- Dark sky location finder
- Equipment recommendations based on events
