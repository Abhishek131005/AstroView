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
