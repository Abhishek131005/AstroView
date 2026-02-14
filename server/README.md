# AstroView API Server

Backend API server for AstroView platform providing aggregated space data from multiple sources.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env and add your API keys

# Development
npm run dev

# Production
npm start
```

## API Endpoints

### NASA Endpoints

#### Astronomy Picture of the Day
```
GET /api/nasa/apod?date=YYYY-MM-DD
```
Get NASA's Astronomy Picture of the Day. Optional date parameter defaults to today.

**Response:**
```json
{
  "title": "Picture Title",
  "explanation": "Description of the image",
  "url": "https://...",
  "hdurl": "https://...",
  "mediaType": "image",
  "date": "2024-01-01",
  "copyright": "Photographer Name"
}
```

#### Near Earth Objects
```
GET /api/nasa/neo?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```
Get asteroids passing near Earth in the specified date range.

**Response:**
```json
{
  "elementCount": 42,
  "asteroids": [
    {
      "id": "123456",
      "name": "(2024 AB)",
      "date": "2024-01-01",
      "estimatedDiameter": { "min": 0.123, "max": 0.275 },
      "isPotentiallyHazardous": false,
      "closeApproachData": {
        "date": "2024-01-01",
        "velocity": 12.34,
        "missDistance": 4500000
      },
      "absoluteMagnitude": 22.5
    }
  ]
}
```

#### Solar Flares
```
GET /api/nasa/solar-flares?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```
Get solar flare events from NASA DONKI. Defaults to last 7 days.

#### Geomagnetic Storms
```
GET /api/nasa/geomagnetic-storms?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```
Get geomagnetic storm events. Defaults to last 7 days.

#### Coronal Mass Ejections
```
GET /api/nasa/cme?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```
Get CME events. Defaults to last 7 days.

#### EONET Natural Events
```
GET /api/nasa/eonet?category=wildfires&limit=20
```
Get natural events affecting Earth from NASA EONET.

**Categories:** wildfires, floods, storms, volcanoes, drought, dustHaze, landslides, etc.

### Satellite Endpoints

#### ISS Position
```
GET /api/satellite/iss
```
Get current International Space Station position.

**Response:**
```json
{
  "lat": 40.7128,
  "lon": -74.0060,
  "altitude": 408,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Satellite Passes
```
GET /api/satellite/passes?noradId=25544&lat=40.7128&lon=-74.0060&days=10
```
Get visible satellite passes over a location.

#### Overhead Satellites
```
GET /api/satellite/overhead?lat=40.7128&lon=-74.0060&radius=90
```
Get satellites currently overhead within radius (degrees from horizon).

### Astronomy Endpoints

#### Moon Phase
```
GET /api/astronomy/moon-phase?date=YYYY-MM-DD
```
Get moon phase for a specific date.

**Response:**
```json
{
  "date": "2024-01-01",
  "phase": 0.5,
  "phaseName": "Full Moon",
  "illumination": 100,
  "age": 14.7
}
```

#### Planet Positions
```
GET /api/astronomy/planets?lat=40.7128&lon=-74.0060&date=YYYY-MM-DD
```
Get visible planet positions in the sky.

### Weather Endpoints

#### Sky Conditions
```
GET /api/weather/sky?lat=40.7128&lon=-74.0060&days=5
```
Get sky conditions for stargazing. Omit `days` for current conditions only.

**Response (Current):**
```json
{
  "cloudCover": 25,
  "visibility": 10000,
  "temperature": 18.5,
  "conditions": "Clear",
  "description": "clear sky",
  "humidity": 60,
  "windSpeed": 3.2
}
```

**Response (Forecast):**
```json
[
  {
    "date": "2024-01-01",
    "cloudCover": 25,
    "conditions": "Clear",
    "temperature": 18.5,
    "visibility": 10000
  }
]
```

### AI Endpoints

#### Simplify Text
```
POST /api/ai/simplify
Content-Type: application/json

{
  "text": "Complex space science text...",
  "context": "solar flares"
}
```
Simplify complex text using Google Gemini AI.

**Response:**
```json
{
  "simplified": "Easy-to-understand version...",
  "original": "Complex space science text...",
  "context": "solar flares"
}
```

#### Ask Question
```
POST /api/ai/simplify/ask
Content-Type: application/json

{
  "question": "What is a black hole?"
}
```
Ask a space-related question and get an educational answer.

**Response:**
```json
{
  "answer": "A black hole is like a cosmic vacuum cleaner...",
  "question": "What is a black hole?"
}
```

## Caching

All endpoints use intelligent caching:

- **APOD**: 24 hours
- **NEO**: 6 hours
- **Solar Events**: 30 minutes
- **EONET**: 1 hour
- **ISS Position**: 10 seconds
- **Satellite Passes**: 12 hours
- **Moon/Planets**: 1 hour
- **Weather**: 30 minutes
- **AI Responses**: 24 hours

Cache headers are added to responses: `X-Cache: HIT` or `X-Cache: MISS`

## Error Handling

All errors follow this format:

```json
{
  "error": "ErrorType",
  "message": "Human-readable error message",
  "details": { /* optional additional info */ }
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request / Validation Error
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error
- `502` - External API Error

## Demo Mode

If API keys are not configured, most endpoints return demo data with:

```json
{
  "_demo": true,
  "message": "Using demo data. Set API_KEY_NAME for real data."
}
```

This allows frontend development without requiring all API keys immediately.

## Environment Variables

See [.env.example](./.env.example) for all required environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `NASA_API_KEY` - NASA API key (get from https://api.nasa.gov)
- `N2YO_API_KEY` - Satellite tracking (get from https://www.n2yo.com/api)
- `ASTRONOMY_API_ID` / `ASTRONOMY_API_SECRET` - Astronomy data
- `OPENWEATHER_API_KEY` - Weather data
- `GEMINI_API_KEY` - Google AI (get from https://makersuite.google.com)
- `ALLOWED_ORIGINS` - CORS allowed origins (comma-separated)

## Rate Limiting

External APIs have rate limits:

- **NASA**: 1000 requests/hour (with API key)
- **N2YO**: 1000 requests/hour (free tier)
- **OpenWeather**: 1000 requests/day (free tier)
- **Gemini**: 60 requests/minute (free tier)

Our caching layer minimizes external API calls.

## Development

```bash
# Install dependencies
npm install

# Start dev server with auto-reload
npm run dev

# Check health
curl http://localhost:3000/health

# Test NASA APOD endpoint
curl http://localhost:3000/api/nasa/apod

# Test ISS position
curl http://localhost:3000/api/satellite/iss
```

## Architecture

```
server/
├── index.js              # Express app setup
├── routes/               # Route definitions with caching
│   ├── nasa.js
│   ├── satellite.js
│   ├── astronomy.js
│   ├── weather.js
│   └── ai.js
├── controllers/          # Business logic & external API calls
│   ├── nasaController.js
│   ├── satelliteController.js
│   ├── astronomyController.js
│   ├── weatherController.js
│   └── aiController.js
└── middleware/
    ├── cache.js          # node-cache wrapper
    └── errorHandler.js   # Custom error classes & handlers
```

## External APIs Used

1. **NASA APIs** - APOD, NeoWs, DONKI, EONET
2. **N2YO** - Satellite tracking
3. **Open Notify** - ISS position (fallback)
4. **Astronomy API** - Moon phases, planet positions
5. **OpenWeatherMap** - Sky conditions
6. **Google Gemini** - AI text simplification

See [docs/api-reference.md](../docs/api-reference.md) for detailed external API documentation.
