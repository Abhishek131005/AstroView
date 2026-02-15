# 🌌 AstroView

**Your Personal Window to the Universe**

AstroView is an interactive web platform that transforms complex, scattered space data into meaningful, accessible, and actionable insights for everyday users. Built for students, educators, space enthusiasts, and the curious public.

> 🚀 **Built for Invictus Hackathon ISTE 2026** - 24 hours, infinite curiosity

---

## ✨ Features

### 🌠 Tonight's Sky
- **NASA's Astronomy Picture of the Day** with expert explanations
- **Personalized celestial events** based on your location
- **Live countdown timers** to upcoming events (meteor showers, eclipses, ISS passes)
- **Sky visibility conditions** with weather integration
- **AI-powered "Explain Simply"** feature for jargon-free learning

### 🛰️ Live Sky Tracker
- **Real-time ISS tracking** on interactive map (updates every 5 seconds)
- **"What's Above Me"** - see satellites currently overhead
- **Visual pass predictions** with viewing directions and times
- **Satellite details** - learn what each satellite does

### 🚀 Mission Control
- **Curated space missions** from NASA, ESA, ISRO, SpaceX, and more
- **Interactive timelines** showing mission milestones
- **Impact stories** - how each mission helps life on Earth
- **Search and filter** by agency, status, or mission type

### 🌍 Space to Earth
- **Live Earth events map** showing natural disasters tracked by satellites
- **Impact categories** - Climate, Agriculture, Disaster Response, Navigation, Communication
- **Near-Earth asteroids** with safety assessments
- **Real-world applications** of satellite technology

### 📚 Learn & Explore
- **Searchable glossary** of 30+ space terms (jargon-free definitions)
- **Interactive quizzes** with instant feedback and score tracking
- **Learning paths** - guided journeys from beginner to advanced
- **Badge system** - earn achievements for completing challenges

### 📅 Calendar & Alerts (Coming Soon)
- **Monthly event calendar** with color-coded events
- **Export to Google Calendar** or download .ics files
- **Notification center** for upcoming events

---

## 🎯 Target Audience

**Age:** 14+ (suitable for anyone curious about space)  
**Reading Level:** 8th grade - no science background required  
**Use Cases:**
- 🎓 Students learning about space science
- 👨‍🏫 Educators looking for visual teaching tools
- 🔭 Amateur astronomers planning observations
- 🌟 Anyone curious about what's happening in space right now

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router v6** - Client-side routing
- **React Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **date-fns** - Date formatting

### Backend
- **Node.js + Express.js** - REST API server
- **node-cache** - In-memory caching
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### External APIs
- **NASA APIs** - APOD, Near-Earth Objects, Space Weather, Earth Events
- **N2YO** - Satellite tracking and pass predictions
- **Open Notify** - ISS position
- **Astronomy API** - Moon phase, planet positions
- **OpenWeatherMap** - Sky visibility conditions
- **NOAA SWPC** - Aurora forecasts and space weather
- **Google Gemini AI** - Text simplification

### Deployment
- **Vercel** - Frontend hosting (React app)
- **Vercel Serverless Functions** - Backend API hosting
- **GitHub** - Version control and CI/CD

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **VS Code** (recommended) ([Download](https://code.visualstudio.com/))

### 1. Clone Repository

```bash
git clone https://github.com/your-username/astroview.git
cd astroview
```

### 2. Get API Keys (Free!)

Create accounts and get free API keys from:

1. **NASA API** → https://api.nasa.gov/#signUp (instant approval)
2. **N2YO** → https://www.n2yo.com/api/#documentation
3. **Astronomy API** → https://astronomyapi.com/dashboard
4. **OpenWeatherMap** → https://home.openweathermap.org/api_keys
5. **Google Gemini** → https://makersuite.google.com/app/apikey

### 3. Setup Frontend

```bash
cd client
npm install
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:3001
```

### 4. Setup Backend

```bash
cd ../server
npm install
cp .env.example .env
```

Edit `server/.env` with your API keys:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

NASA_API_KEY=your_nasa_key_here
N2YO_API_KEY=your_n2yo_key_here
ASTRONOMY_API_ID=your_astronomy_id_here
ASTRONOMY_API_SECRET=your_astronomy_secret_here
OPENWEATHER_API_KEY=your_openweather_key_here
GEMINI_API_KEY=your_gemini_key_here
```

### 5. Run Development Servers

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
Backend runs on **http://localhost:3001**

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
Frontend runs on **http://localhost:5173**

### 6. Open in Browser

Navigate to **http://localhost:5173** and start exploring! 🌌

---

## 📁 Project Structure

```
astroview/
├── client/                  # React Frontend (Vite)
│   ├── public/
│   │   └── assets/         # Images, icons, fonts
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── layout/    # Navbar, Sidebar, Footer
│   │   │   ├── common/    # Reusable UI components
│   │   │   ├── sky/       # Tonight's Sky features
│   │   │   ├── missions/  # Mission Control features
│   │   │   ├── tracker/   # ISS & satellite tracking
│   │   │   ├── impact/    # Space to Earth features
│   │   │   ├── learn/     # Learning & quizzes
│   │   │   └── ai/        # AI simplification
│   │   ├── pages/         # Route pages
│   │   ├── context/       # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API client services
│   │   ├── utils/         # Utility functions
│   │   ├── data/          # Static JSON data
│   │   ├── App.jsx        # Root component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                 # Express Backend
│   ├── routes/            # API routes
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Caching, error handling
│   ├── utils/             # Helper functions
│   ├── index.js           # Server entry point
│   └── package.json
│
├── docs/                  # Documentation
│   ├── requirements.md    # Product requirements
│   ├── tech-stack.md      # Technology details
│   ├── design.md          # Design system
│   ├── architecture.md    # System architecture
│   ├── tasks.md           # Task breakdown
│   ├── api-reference.md   # API documentation
│   └── copilot-instructions.md
│
├── .gitignore
├── .env.example
└── README.md             # This file
```

---

## 🎨 Design System

### Color Palette (Dark Space Theme)

```css
Background: #0B0D17 (Deep space black)
Cards: #1B1D2A (Elevated surfaces)
Accent Blue: #4F9CF7 (Primary interactive elements)
Cosmic Purple: #7C5CFC (Secondary accent)
Solar Amber: #FFB800 (Alerts, countdowns)
Aurora Green: #00E676 (Success, live indicators)
```

### Typography

- **Headings:** Space Grotesk (Google Fonts)
- **Body:** Inter (Google Fonts)
- **Monospace:** JetBrains Mono (for data/coordinates)

### Key Principles

- **Visual-First:** Images and maps prioritized over text
- **Mobile-First:** Responsive from 375px to 4K
- **Accessible:** WCAG 2.1 AA compliant
- **Approachable:** No jargon, 8th-grade reading level
- **Performant:** All animations under 300ms

---

## 📡 API Integration

AstroView integrates **10 external APIs** to provide real-time, accurate space data:

| API | Purpose | Rate Limit |
|-----|---------|------------|
| NASA APOD | Daily space image | 1000 req/hour |
| NASA NeoWs | Near-Earth asteroids | 1000 req/hour |
| NASA DONKI | Space weather | 1000 req/hour |
| NASA EONET | Earth events | Unlimited |
| N2YO | Satellite tracking | 1000 req/hour |
| Open Notify | ISS position | Unlimited |
| Astronomy API | Moon/planets | 1000 req/day |
| OpenWeatherMap | Sky conditions | 60 req/min |
| NOAA SWPC | Aurora forecast | Unlimited |
| Google Gemini | AI simplification | 60 req/min |

**Backend Caching:** Responses are cached (10 seconds to 24 hours) to minimize API calls and improve performance.

---

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   - **Framework:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   - `VITE_API_BASE_URL` = your backend URL
5. Deploy!

### Backend (Vercel Serverless)

1. Same Vercel project as frontend
2. Automatic serverless functions from `/server` directory
3. Add all API keys as environment variables
4. Routes accessible at `/api/*`

**Alternative:** Deploy backend to [Railway](https://railway.app/) for always-on server.

---

## 📚 Documentation

Comprehensive documentation available in the `/docs` folder:

- **[requirements.md](./docs/requirements.md)** - Full product requirements
- **[tech-stack.md](./docs/tech-stack.md)** - Technology stack details
- **[design.md](./docs/design.md)** - Complete design system
- **[architecture.md](./docs/architecture.md)** - System architecture
- **[tasks.md](./docs/tasks.md)** - Development task breakdown
- **[api-reference.md](./docs/api-reference.md)** - External API documentation
- **[copilot-instructions.md](./docs/copilot-instructions.md)** - AI assistant guidelines

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] All pages load without errors
- [ ] Navigation works (desktop sidebar + mobile bottom tabs)
- [ ] API integrations working (check Network tab)
- [ ] Location detection working
- [ ] ISS map updates in real-time
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1024px+)
- [ ] Search and filters functional
- [ ] Countdown timers accurate
- [ ] Error states display correctly
- [ ] Loading skeletons show while fetching data

### Browser Compatibility

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+ (macOS & iOS)
- ✅ Edge 90+

---

## 🚢 Deployment

AstroView is production-ready and can be deployed to Vercel (frontend) and Railway or Vercel Serverless (backend).

**Quick Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/astroview)

**Full Deployment Guide:** See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

### Production Environment Variables

**Frontend (`client/.env.production`):**
```env
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

**Backend (`server/.env.production`):**
```env
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://your-frontend.vercel.app

# API Keys (get from respective services)
NASA_API_KEY=your_key
N2YO_API_KEY=your_key
ASTRONOMY_APP_ID=your_id
ASTRONOMY_APP_SECRET=your_secret
OPENWEATHER_API_KEY=your_key
GEMINI_API_KEY=your_key
```

**Deployment Checklist:**
- ✅ All API keys configured in production
- ✅ CORS origins updated to production URLs  
- ✅ Build runs successfully (`npm run build`)
- ✅ Environment variables set in Vercel/Railway
- ✅ Health check endpoint accessible
- ✅ Lighthouse scores > 90

---

## 🤝 Contributing (Post-Hackathon)

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Contribution Guidelines:**
- Follow existing code style (see [copilot-instructions.md](./docs/copilot-instructions.md))
- All text must be jargon-free (suitable for age 14+)
- Include loading, error, and empty states for all features
- Test on mobile and desktop
- Add comments for complex logic

---

## 🐛 Known Issues

- [ ] ISS map occasionally loses position on very slow connections (< 500 Kbps)
- [ ] Safari iOS sometimes requires double-tap on "What's Above Me" button
- [ ] Some older Android browsers (< Chrome 85) may have layout issues

See [GitHub Issues](https://github.com/your-username/astroview/issues) for full list and workarounds.

---

## 🗺️ Roadmap

### Phase 2 (Post-Hackathon)
- [ ] User accounts and authentication
- [ ] Bookmarks and favorites
- [ ] Browser push notifications for events
- [ ] Social sharing (Twitter, Facebook)
- [ ] Multi-language support (i18n)

### Phase 3 (Advanced Features)
- [ ] Migrate to Next.js for SSR/SSG
- [ ] Progressive Web App (PWA) with offline support
- [ ] Integration with telescope mounts
- [ ] Community features (share observations)
- [ ] Dark sky location finder
- [ ] Astrophotography tips and guides

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

**TL;DR:** You can use this code for anything, even commercially. Just keep the copyright notice.

---

## 🙏 Credits & Attributions

### Data Sources

- **NASA** - APOD, Near-Earth Objects, Space Weather, Earth Events
- **N2YO.com** - Satellite tracking data
- **Astronomy API** - Astronomical calculations
- **OpenWeatherMap** - Weather data
- **NOAA SWPC** - Space weather and aurora forecasts
- **Google Gemini AI** - Text simplification

### Design Inspiration

- NASA's Eyes on the Solar System
- SpaceX website
- Stripe documentation
- Linear app

### Open Source Libraries

See `package.json` in `/client` and `/server` for full list of dependencies.

---

## 👥 Team

**AstroView** was built during [Hackathon Name] 2026 by:

- **[Your Name]** - Full Stack Developer - [GitHub](https://github.com/your-username) | [LinkedIn](https://linkedin.com/in/your-profile)
- **[Team Member 2]** - [Role] - [Links]
- **[Team Member 3]** - [Role] - [Links]

---

## 📧 Contact

Questions? Suggestions? Found a bug?

- **Email:** your.email@example.com
- **GitHub Issues:** [Report a bug](https://github.com/your-username/astroview/issues/new)
- **Twitter:** [@yourhandle](https://twitter.com/yourhandle)

---

## ⭐ Show Your Support

If AstroView helped you learn something new about space, give it a ⭐ on GitHub!

**Share on social media:**
> "Just discovered what's happening in the sky tonight with @AstroView! 🌌🛰️ Real-time ISS tracking, celestial events, and jargon-free space learning. Check it out: [your-demo-url]"

---

## 🌟 Acknowledgments

Special thanks to:

- NASA for making space data freely accessible
- The open-source community for amazing libraries
- Our mentors and judges at [Hackathon Name]
- Everyone who shares our curiosity about the universe

---

<div align="center">

**"The universe is under no obligation to make sense to you."**  
— Neil deGrasse Tyson

Made with ❤️ and ☕ in 24 hours

[Live Demo](#) | [Documentation](./docs) | [Report Bug](https://github.com/your-username/astroview/issues)

</div>
