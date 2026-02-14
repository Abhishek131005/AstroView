/**
 * Event Type Colors - Maps event categories to theme colors
 */
export const EVENT_COLORS = {
  // NASA DONKI Events
  FLR: 'solar-amber',       // Solar Flare
  CME: 'cosmic-purple',     // Coronal Mass Ejection
  GST: 'danger-red',        // Geomagnetic Storm
  SEP: 'electric-blue',     // Solar Energetic Particle
  IPS: 'aurora-green',      // Interplanetary Shock
  
  // EONET Events
  wildfires: 'solar-amber',
  volcanoes: 'danger-red',
  floods: 'electric-blue',
  storms: 'cosmic-purple',
  earthquakes: 'danger-red',
  drought: 'solar-amber',
  'sea-ice': 'electric-blue',
  
  // Mission Types
  launch: 'aurora-green',
  landing: 'electric-blue',
  active: 'aurora-green',
  planned: 'solar-amber',
  completed: 'cosmic-purple',
  
  // Default
  default: 'electric-blue',
};

/**
 * NORAD Satellite IDs
 */
export const NORAD_IDS = {
  ISS: 25544,
  HUBBLE: 20580,
  STARLINK_1: 44713,
  TIANGONG: 48274,
};

/**
 * API Endpoints (relative to VITE_API_BASE_URL)
 */
export const API_ENDPOINTS = {
  // NASA
  APOD: '/nasa/apod',
  NEO: '/nasa/neo',
  SOLAR_FLARES: '/nasa/solar-flares',
  GEOMAGNETIC_STORMS: '/nasa/geomagnetic-storms',
  CME: '/nasa/cme',
  EONET_EVENTS: '/nasa/eonet',
  
  // Satellites
  ISS_POSITION: '/satellite/iss',
  SATELLITE_PASSES: '/satellite/passes',
  OVERHEAD_SATELLITES: '/satellite/overhead',
  
  // Astronomy
  MOON_PHASE: '/astronomy/moon-phase',
  PLANET_POSITIONS: '/astronomy/planets',
  
  // Weather
  SKY_CONDITIONS: '/weather/sky',
  
  // AI
  SIMPLIFY: '/ai/simplify',
};

/**
 * Cache TTL (Time To Live) in seconds
 */
export const CACHE_TTL = {
  APOD: 86400,              // 24 hours
  NEO: 21600,               // 6 hours
  SOLAR_EVENTS: 1800,       // 30 minutes
  EONET: 3600,              // 1 hour
  ISS_POSITION: 10,         // 10 seconds
  SATELLITE_PASSES: 43200,  // 12 hours
  MOON_PHASE: 3600,         // 1 hour
  PLANET_POSITIONS: 3600,   // 1 hour
  WEATHER: 1800,            // 30 minutes
  AI_SIMPLIFY: 86400,       // 24 hours
};

/**
 * Event Type Icons - Maps event types to Lucide icon names
 */
export const EVENT_ICONS = {
  FLR: 'Sun',
  CME: 'Zap',
  GST: 'Radio',
  SEP: 'Sparkles',
  IPS: 'Waves',
  wildfires: 'Flame',
  volcanoes: 'Mountain',
  floods: 'Droplets',
  storms: 'CloudRain',
  earthquakes: 'Activity',
  drought: 'CloudOff',
  'sea-ice': 'Snowflake',
  launch: 'Rocket',
  landing: 'MapPin',
  default: 'Circle',
};

/**
 * Mission Status Types
 */
export const MISSION_STATUS = {
  ACTIVE: 'active',
  PLANNED: 'planned',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/**
 * Visibility Thresholds (cloud cover percentage)
 */
export const VISIBILITY_THRESHOLDS = {
  EXCELLENT: 10,    // < 10% cloud cover
  GOOD: 30,         // < 30% cloud cover
  FAIR: 60,         // < 60% cloud cover
  POOR: 100,        // >= 60% cloud cover
};

/**
 * Response Breakpoints (matches Tailwind config)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  USER_LOCATION: 'astroview_user_location',
  USER_PREFERENCES: 'astroview_user_preferences',
  QUIZ_SCORES: 'astroview_quiz_scores',
  BADGES: 'astroview_badges',
  COMPLETED_LEARNING_PATHS: 'astroview_completed_paths',
};

/**
 * Default User Location (fallback when geolocation unavailable)
 */
export const DEFAULT_LOCATION = {
  lat: 40.7128,
  lon: -74.0060,
  name: 'New York, NY',
};

/**
 * Moon Phase Names
 */
export const MOON_PHASES = [
  'New Moon',
  'Waxing Crescent',
  'First Quarter',
  'Waxing Gibbous',
  'Full Moon',
  'Waning Gibbous',
  'Last Quarter',
  'Waning Crescent',
];

/**
 * Planet Names (ordered by distance from Sun)
 */
export const PLANETS = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
];
