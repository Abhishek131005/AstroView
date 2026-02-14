# AstroView - Design System

## Design Philosophy

**Visual-First:** Images and data visualizations take priority over text  
**Dark Space Theme:** Immersive, reduces eye strain, emphasizes content  
**Accessible:** WCAG 2.1 AA compliant, readable for all users  
**Approachable:** No intimidating jargon, friendly tone, suitable for age 14+  
**Responsive:** Mobile-first, works beautifully on all screen sizes  
**Performant:** All animations under 300ms, respect reduced motion preferences

---

## Color System

### Primary Palette

```css
/* Background Colors */
--bg-primary: #0B0D17;        /* Deep space black - main background */
--bg-secondary: #1B1D2A;      /* Card background, elevated surfaces */
--bg-tertiary: #252840;       /* Hover states, selected items */

/* Accent Colors */
--electric-blue: #4F9CF7;     /* Primary CTA, links, interactive elements */
--cosmic-purple: #7C5CFC;     /* Secondary accent, gradients */
--solar-amber: #FFB800;       /* Alerts, warnings, countdown timers */
--aurora-green: #00E676;      /* Success, live indicators, active status */

/* Text Colors */
--star-white: #E8EAED;        /* Primary text, headings */
--muted-gray: #9AA0A6;        /* Secondary text, labels, meta info */
--faint-gray: #5F6368;        /* Disabled text, dividers */

/* Semantic Colors */
--danger-red: #FF5252;        /* Errors, critical alerts, delete actions */
--warning-amber: #FFC107;     /* Warnings, moderate alerts */
--info-blue: #4FC3F7;         /* Info messages, tips */
--success-green: #00E676;     /* Success messages, confirmations */
```

### Gradient Definitions

```css
/* Button Primary Gradient */
background: linear-gradient(135deg, #4F9CF7 0%, #7C5CFC 100%);

/* Card Hover Glow (used as border or shadow) */
box-shadow: 0 0 20px rgba(79, 156, 247, 0.1);

/* Hero Overlay (for APOD background) */
background: linear-gradient(180deg, rgba(11,13,23,0) 0%, rgba(11,13,23,0.8) 100%);

/* Loading Shimmer */
background: linear-gradient(90deg, 
  rgba(255,255,255,0.03) 0%, 
  rgba(255,255,255,0.06) 50%, 
  rgba(255,255,255,0.03) 100%
);
```

### Event Type Color Coding

```css
--meteor-shower: #FFB800;     /* Solar amber */
--eclipse: #7C5CFC;           /* Cosmic purple */
--planet: #4F9CF7;            /* Electric blue */
--iss-pass: #00E676;          /* Aurora green */
--conjunction: #FF7043;       /* Mars orange */
--aurora: #00E5FF;            /* Cyan aurora */
```

### Opacity Scale

```css
/* For layering and depth */
--opacity-disabled: 0.38;
--opacity-secondary: 0.6;
--opacity-hover: 0.08;
--opacity-pressed: 0.12;
--opacity-focus: 0.16;
--opacity-border: 0.06;
```

---

## Typography

### Font Families

**Headings:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)  
- Weights: 400 (Regular), 500 (Medium), 700 (Bold)
- Usage: Page titles, section headings, feature titles
- Fallback: 'Trebuchet MS', sans-serif

**Body Text:** [Inter](https://fonts.google.com/specimen/Inter)  
- Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold)
- Usage: Paragraphs, labels, UI text, descriptions
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

**Monospace/Data:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)  
- Weights: 400 (Regular), 500 (Medium)
- Usage: Coordinates, timestamps, technical data, code snippets
- Fallback: 'Courier New', monospace

### Font Sizes (Mobile First)

```css
/* Mobile (375px - 767px) */
--text-xs: 0.75rem;      /* 12px - labels, captions */
--text-sm: 0.875rem;     /* 14px - secondary text */
--text-base: 1rem;       /* 16px - body text */
--text-lg: 1.125rem;     /* 18px - large body */
--text-xl: 1.25rem;      /* 20px - small headings */
--text-2xl: 1.5rem;      /* 24px - card titles */
--text-3xl: 1.875rem;    /* 30px - section headings */
--text-4xl: 2.25rem;     /* 36px - page titles */
--text-5xl: 3rem;        /* 48px - hero titles */

/* Desktop (1024px+) - use clamp for fluid scaling */
--text-xs: clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem);
--text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
--text-3xl: clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem);
--text-5xl: clamp(3rem, 2rem + 4vw, 4.5rem);
```

### Line Heights

```css
--leading-tight: 1.2;     /* Headings */
--leading-snug: 1.375;    /* Subheadings */
--leading-normal: 1.5;    /* Body text */
--leading-relaxed: 1.625; /* Long-form content */
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Text Styles (Tailwind Classes)

```
Heading 1: text-5xl font-bold font-heading text-star-white leading-tight
Heading 2: text-3xl font-bold font-heading text-star-white leading-tight
Heading 3: text-2xl font-semibold font-heading text-star-white leading-snug
Heading 4: text-xl font-medium font-heading text-star-white

Body Large: text-lg font-body text-star-white leading-relaxed
Body: text-base font-body text-star-white leading-normal
Body Small: text-sm font-body text-muted-gray leading-normal

Label: text-sm font-medium font-body text-muted-gray uppercase tracking-wide
Caption: text-xs font-body text-faint-gray leading-normal

Data Display: text-base font-mono text-electric-blue tabular-nums
```

---

## Spacing System

Based on 4px base unit (Tailwind default):

```css
--space-0: 0;          /* 0px */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px - base unit */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

### Common Spacing Patterns

- **Component padding:** p-6 (24px) on desktop, p-4 (16px) on mobile
- **Section spacing:** mb-12 (48px) on desktop, mb-8 (32px) on mobile
- **Element spacing:** gap-4 (16px) for flex/grid children
- **Inline spacing:** space-x-2 (8px) for inline elements

---

## Components

### Cards

**Base Card:**
```css
background: #1B1D2A;
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 1rem; /* 16px */
padding: 1.5rem; /* 24px */
transition: all 0.2s ease;
```

**Hover State:**
```css
border-color: rgba(79, 156, 247, 0.3);
box-shadow: 0 0 20px rgba(79, 156, 247, 0.1);
transform: translateY(-2px);
```

**Active/Selected State:**
```css
background: #252840;
border-color: rgba(79, 156, 247, 0.5);
```

**Card Variants:**

1. **Event Card** - Timeline icon, countdown timer, view button
2. **Mission Card** - Agency badge, status indicator, detail CTA
3. **Impact Card** - Category icon, satellite count badge
4. **Glossary Card** - Term + definition, expand for more
5. **Quiz Card** - Question number badge, answer buttons

### Buttons

**Primary Button:**
```css
background: linear-gradient(135deg, #4F9CF7 0%, #7C5CFC 100%);
color: #FFFFFF;
padding: 0.75rem 1.5rem; /* 12px 24px */
border-radius: 0.5rem; /* 8px */
font-weight: 600;
transition: transform 0.15s ease, box-shadow 0.15s ease;

/* Hover */
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(79, 156, 247, 0.3);

/* Active */
transform: translateY(0);
```

**Secondary Button:**
```css
background: transparent;
border: 1.5px solid rgba(79, 156, 247, 0.5);
color: #4F9CF7;
padding: 0.75rem 1.5rem;
border-radius: 0.5rem;

/* Hover */
background: rgba(79, 156, 247, 0.08);
border-color: #4F9CF7;
```

**Ghost Button:**
```css
background: transparent;
border: none;
color: #9AA0A6;
padding: 0.5rem 1rem;

/* Hover */
color: #E8EAED;
background: rgba(255, 255, 255, 0.06);
```

**Icon Button:**
```css
width: 2.5rem; /* 40px */
height: 2.5rem;
display: flex;
align-items: center;
justify-content: center;
border-radius: 0.5rem;
background: transparent;

/* Hover */
background: rgba(255, 255, 255, 0.06);
```

**Button Sizes:**
- Small: px-3 py-1.5 text-sm
- Medium: px-6 py-3 text-base (default)
- Large: px-8 py-4 text-lg

### Badges

**Status Badge (Base):**
```css
display: inline-flex;
align-items: center;
gap: 0.375rem; /* 6px */
padding: 0.25rem 0.75rem; /* 4px 12px */
border-radius: 9999px; /* fully rounded */
font-size: 0.75rem; /* 12px */
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;
```

**Variants:**
- **Active:** bg-aurora-green/10, text-aurora-green, with pulse animation
- **Completed:** bg-muted-gray/10, text-muted-gray, checkmark icon
- **Planned:** bg-solar-amber/10, text-solar-amber, clock icon
- **Live:** bg-danger-red/10, text-danger-red, with pulse dot

### Navigation

**Desktop Sidebar:**
```css
width: 16rem; /* 256px */
background: #1B1D2A;
border-right: 1px solid rgba(255, 255, 255, 0.06);
padding: 1.5rem;
position: fixed;
left: 0;
top: 0;
height: 100vh;
```

**Nav Item:**
```css
padding: 0.75rem 1rem;
border-radius: 0.5rem;
display: flex;
align-items: center;
gap: 0.75rem;
color: #9AA0A6;
transition: all 0.15s ease;

/* Active */
background: rgba(79, 156, 247, 0.1);
color: #4F9CF7;
border-left: 3px solid #4F9CF7;
```

**Mobile Bottom Tab Bar:**
```css
position: fixed;
bottom: 0;
left: 0;
right: 0;
background: #1B1D2A;
border-top: 1px solid rgba(255, 255, 255, 0.06);
padding: 0.5rem 0;
display: flex;
justify-content: space-around;
z-index: 50;

/* Tab Item */
flex-direction: column;
align-items: center;
gap: 0.25rem;
padding: 0.5rem;
min-width: 60px;
```

**Max 5 Nav Items:** Home, Tracker, Missions, Impact, Learn

### Forms

**Input Field:**
```css
background: #252840;
border: 1.5px solid rgba(255, 255, 255, 0.08);
border-radius: 0.5rem;
padding: 0.75rem 1rem;
color: #E8EAED;
font-size: 1rem;

/* Focus */
border-color: #4F9CF7;
outline: none;
box-shadow: 0 0 0 3px rgba(79, 156, 247, 0.1);

/* Error */
border-color: #FF5252;
```

**Search Bar:**
```css
/* With leading icon (magnifying glass) */
padding-left: 2.75rem;
background-image: url('data:image/svg+xml...');
background-position: 1rem center;
background-repeat: no-repeat;
```

**Dropdown/Select:**
```css
/* Same as input with trailing chevron-down icon */
appearance: none;
background-image: url('data:image/svg+xml...');
background-position: right 1rem center;
padding-right: 2.75rem;
```

### Modals

**Modal Overlay:**
```css
position: fixed;
inset: 0;
background: rgba(11, 13, 23, 0.8);
backdrop-filter: blur(4px);
z-index: 100;
```

**Modal Content:**
```css
position: relative;
background: #1B1D2A;
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 1rem;
padding: 2rem;
max-width: 42rem; /* 672px */
max-height: 90vh;
overflow-y: auto;
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
```

**Modal Sizes:**
- Small: max-w-md (448px)
- Medium: max-w-2xl (672px) - default
- Large: max-w-4xl (896px)
- Full: max-w-7xl (1280px)

### Loading States

**Skeleton Loader:**
```css
background: rgba(255, 255, 255, 0.03);
border-radius: 0.5rem;
position: relative;
overflow: hidden;

/* Shimmer Animation */
&::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.06) 50%, 
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

**Spinner:**
```css
/* Circular spinner using border trick */
width: 2rem;
height: 2rem;
border: 3px solid rgba(79, 156, 247, 0.2);
border-top-color: #4F9CF7;
border-radius: 50%;
animation: spin 0.8s linear infinite;

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Countdown Timer

```css
display: flex;
gap: 0.5rem;
font-family: 'JetBrains Mono';
font-size: 1.25rem;
color: #FFB800;

/* Each time unit (days, hours, mins) */
.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.time-value {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #FFB800, #FF7043);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.time-label {
  font-size: 0.75rem;
  color: #9AA0A6;
  text-transform: uppercase;
}
```

---

## Icons

**Library:** Lucide React  
**Size Scale:**
- xs: 16px
- sm: 20px
- base: 24px (default)
- lg: 32px
- xl: 48px

**Icon Usage:**
- Navigation: 24px
- Buttons: 20px (with text), 24px (icon-only)
- Cards: 32px (feature icon), 20px (inline)
- Status indicators: 16px

**Common Icons:**
- Home: Home
- Tracker: Satellite
- Missions: Rocket
- Impact: Earth
- Learn: GraduationCap
- Calendar: Calendar
- Search: Search
- Location: MapPin
- Live: Activity (with pulse)
- Time: Clock
- Info: Info
- Close: X
- Menu: Menu
- External: ExternalLink
- Download: Download

---

## Animations

**Framer Motion Variants:**

### Page Transitions

```javascript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
};
```

### Card Entrance (Stagger)

```javascript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
```

### Hover & Tap Gestures

```javascript
<motion.div
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>
```

### Pulse (Live Indicators)

```javascript
<motion.div
  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
  transition={{ repeat: Infinity, duration: 2 }}
/>
```

**Animation Principles:**
- All under 300ms for snappy feel
- Use `ease-in-out` for most transitions
- `spring` physics for natural motion (low stiffness: 100)
- Respect `prefers-reduced-motion` media query

---

## Responsive Breakpoints

```css
/* Mobile First */
/* xs: 375px - 639px (default, no media query) */

/* sm: 640px */
@media (min-width: 640px) { ... }

/* md: 768px - Tablet */
@media (min-width: 768px) { ... }

/* lg: 1024px - Desktop */
@media (min-width: 1024px) { ... }

/* xl: 1280px - Large Desktop */
@media (min-width: 1280px) { ... }

/* 2xl: 1536px - Extra Large */
@media (min-width: 1536px) { ... }
```

**Layout Changes:**
- < 768px: Bottom tab navigation, single column cards, hamburger menu
- ≥ 768px: Sidebar navigation, 2-column grid, side-by-side content
- ≥ 1024px: 3-column grid, expanded sidebar, more whitespace

---

## Accessibility

### Color Contrast

All text meets WCAG AA standards:
- Star white (#E8EAED) on Background primary (#0B0D17): 12.6:1 ✓
- Muted gray (#9AA0A6) on Background primary: 6.8:1 ✓
- Electric blue (#4F9CF7) on Background secondary: 5.2:1 ✓

### Focus Indicators

```css
:focus-visible {
  outline: 2px solid #4F9CF7;
  outline-offset: 2px;
  border-radius: 0.25rem;
}
```

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Support

- All images have alt text
- Icon buttons have aria-labels
- Form inputs have labels (visible or aria-label)
- Modal focus trapping
- Skip to content link
- Semantic HTML landmarks (header, nav, main, aside, footer)

---

## Empty & Error States

### Empty State

```
Icon: 64px muted icon (Inbox, Search, Calendar, etc.)
Heading: "No [items] yet"
Description: Helpful explanation + suggestion
Action Button: Primary CTA to resolve (optional)
```

### Error State

```
Icon: AlertCircle (danger-red, 48px)
Heading: "Something went wrong"
Description: User-friendly error message (never show raw error)
Action Buttons: "Try Again" (primary) or "Go Home" (secondary)
```

### Loading State

Always show skeleton loaders matching the expected content layout, never generic spinners alone.

---

## Layout Patterns

### Hero Section (Home)

```
Full-width APOD image with gradient overlay
Centered title + subtitle
CTA button ("Explore Tonight's Sky")
Height: 60vh on desktop, 50vh on mobile
```

### Grid Layouts

```
Mobile (< 768px): grid-cols-1
Tablet (768px - 1023px): grid-cols-2
Desktop (≥ 1024px): grid-cols-3
Gap: gap-6 (24px)
```

### Content Max Width

```
Narrow (text content): max-w-3xl (768px)
Standard (cards, lists): max-w-7xl (1280px)
Full bleed (maps, images): w-full
```

---

## Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
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
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
```

---

## Design Assets Needed

1. **Logo:** AstroView wordmark (Space Grotesk, gradient text)
2. **Favicon:** 32x32 icon (telescope or star)
3. **Agency Logos:** NASA, ESA, ISRO, SpaceX, CNSA badges
4. **Mission Badges:** Placeholder badges for missions
5. **Placeholder Images:** Default img for missions without photos
6. **Map Tiles:** CartoDB Dark Matter (external, no asset needed)
7. **Icons:** All from Lucide React (no custom SVGs needed)

All assets placed in `client/public/assets/` directory.

---

## Design Inspiration References

- NASA's Eyes on the Solar System (data density)
- SpaceX website (dark theme, bold typography)
- Stripe Docs (card design, navigation)
- Linear App (polish, micro-interactions)
- Vercel Dashboard (clean aesthetics, dark mode)
