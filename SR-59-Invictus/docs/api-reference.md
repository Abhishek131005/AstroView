# AstroView - API Reference

## Overview

This document details all external APIs integrated into AstroView, including authentication methods, endpoints, request/response formats, rate limits, and caching strategies.

---

## API Summary Table

| API | Purpose | Auth Method | Rate Limit | Cache TTL |
|-----|---------|-------------|------------|-----------|
| NASA APOD | Daily space image | API Key (URL param) | 1000 req/hour | 24 hours |
| NASA NeoWs | Near-Earth asteroids | API Key (shared) | 1000 req/hour | 6 hours |
| NASA DONKI | Space weather events | API Key (shared) | 1000 req/hour | 1 hour |
| NASA EONET | Earth natural events | None | Reasonable use | 1 hour |
| Open Notify | ISS position | None | None specified | 10 seconds |
| N2YO | Satellite tracking | API Key (URL param) | 1000 req/hour | 10s - 1h |
| Astronomy API | Planet positions, moon | Basic Auth | 1000 req/day | 6 hours |
| OpenWeatherMap | Weather conditions | API Key (URL param) | 60 req/min | 30 minutes |
| NOAA SWPC | Aurora forecast | None | None (public data) | 1 hour |
| Google Gemini | AI text simplification | API Key (URL param) | 60 req/min | 24 hours |

---

## 1. NASA APIs

**Base URL:** `https://api.nasa.gov`  
**Documentation:** https://api.nasa.gov  
**Authentication:** API Key in URL parameter `?api_key={KEY}`  
**Rate Limit:** 1000 requests/hour (shared across all NASA APIs)  
**How to get key:** https://api.nasa.gov/#signUp (instant, free)

### 1.1 APOD (Astronomy Picture of the Day)

**Endpoint:** `GET /planetary/apod`

**Description:** Returns a different astronomy image or photograph each day, along with a brief explanation written by a professional astronomer.

**Query Parameters:**
- `api_key` (required): Your NASA API key
- `date` (optional): YYYY-MM-DD format. Defaults to today.
- `hd` (optional): boolean. Retrieve URL for high resolution image.

**Example Request:**
```
GET https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2024-02-14
```

**Example Response:**
```json
{
  "date": "2024-02-14",
  "explanation": "What's happening at the center of spiral galaxy M77? The face-on galaxy...",
  "hdurl": "https://apod.nasa.gov/apod/image/2402/M77_Hubble_1920.jpg",
  "media_type": "image",
  "service_version": "v1",
  "title": "M77: Spiral Galaxy with an Active Center",
  "url": "https://apod.nasa.gov/apod/image/2402/M77_Hubble_960.jpg"
}
```

**AstroView Usage:**
- Display as hero image on HomePage
- Show title, date, and explanation
- "Explain Simply" toggle for simplified explanation

**Backend Route:** `GET /api/nasa/apod?date={YYYY-MM-DD}`  
**Cache TTL:** 24 hours (updates once daily at midnight UTC)

---

### 1.2 NeoWs (Near Earth Object Web Service)

**Endpoint:** `GET /neo/rest/v1/feed`

**Description:** Retrieve a list of asteroids based on their closest approach date to Earth.

**Query Parameters:**
- `api_key` (required): Your NASA API key
- `start_date` (required): YYYY-MM-DD format
- `end_date` (required): YYYY-MM-DD format (max 7 days from start_date)

**Example Request:**
```
GET https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-02-14&end_date=2024-02-21&api_key=DEMO_KEY
```

**Example Response:**
```json
{
  "element_count": 127,
  "near_earth_objects": {
    "2024-02-14": [
      {
        "id": "54016139",
        "name": "2020 FK",
        "estimated_diameter": {
          "meters": {
            "estimated_diameter_min": 124.5,
            "estimated_diameter_max": 278.4
          }
        },
        "is_potentially_hazardous_asteroid": false,
        "close_approach_data": [
          {
            "close_approach_date": "2024-02-14",
            "relative_velocity": {
              "kilometers_per_hour": "39567.4"
            },
            "miss_distance": {
              "kilometers": "17894321.2"
            }
          }
        ]
      }
    ]
  }
}
```

**AstroView Usage:**
- Display on ImpactPage
- Show upcoming asteroids (next 30 days)
- Visual size comparison
- Safety indicator (is_potentially_hazardous_asteroid)

**Backend Route:** `GET /api/nasa/neo?start_date={}&end_date={}`  
**Cache TTL:** 6 hours

---

### 1.3 DONKI (Space Weather Database of Notifications)

**Base Endpoint:** `/DONKI`

**Description:** Access to space weather events including solar flares, geomagnetic storms, and coronal mass ejections.

#### 1.3.1 Solar Flares

**Endpoint:** `GET /DONKI/FLR`

**Query Parameters:**
- `api_key` (required)
- `startDate` (optional): YYYY-MM-DD, defaults to 30 days prior
- `endDate` (optional): YYYY-MM-DD, defaults to today

**Example Request:**
```
GET https://api.nasa.gov/DONKI/FLR?startDate=2024-02-01&endDate=2024-02-14&api_key=DEMO_KEY
```

**Example Response:**
```json
[
  {
    "flrID": "2024-02-10T12:24:00-FLR-001",
    "beginTime": "2024-02-10T12:24Z",
    "peakTime": "2024-02-10T12:45Z",
    "endTime": "2024-02-10T13:12Z",
    "classType": "M1.5",
    "sourceLocation": "S12W14",
    "activeRegionNum": 13576
  }
]
```

#### 1.3.2 Geomagnetic Storms

**Endpoint:** `GET /DONKI/GST`

**Query Parameters:** Same as FLR

#### 1.3.3 Coronal Mass Ejections

**Endpoint:** `GET /DONKI/CME`

**Query Parameters:** Same as FLR

**AstroView Usage:**
- Display space weather alerts on ImpactPage or HomePage
- Show recent solar activity
- Alert for geomagnetic storms (affects aurora visibility)

**Backend Routes:**
- `GET /api/nasa/solar-flares`
- `GET /api/nasa/geomagnetic-storms`
- `GET /api/nasa/cme`

**Cache TTL:** 1 hour

---

### 1.4 EONET (Earth Observatory Natural Event Tracker)

**Base URL:** `https://eonet.gsfc.nasa.gov/api/v3`  
**Documentation:** https://eonet.gsfc.nasa.gov/docs/v3

**Endpoint:** `GET /events`

**Description:** Natural events tracked by Earth-observing satellites (wildfires, storms, volcanoes, floods, etc.)

**Query Parameters:**
- `status` (optional): "open" or "closed"
- `limit` (optional): number of events to return
- `days` (optional): events within last X days
- `category` (optional): wildfires, severeStorms, volcanoes, etc.

**Example Request:**
```
GET https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=20
```

**Example Response:**
```json
{
  "title": "EONET Events",
  "events": [
    {
      "id": "EONET_625",
      "title": "Wildfire - Maui, Hawaii, United States",
      "categories": [
        {
          "id": "wildfires",
          "title": "Wildfires"
        }
      ],
      "geometry": [
        {
          "date": "2024-02-10T00:00:00Z",
          "type": "Point",
          "coordinates": [-156.4, 20.8]
        }
      ]
    }
  ]
}
```

**AstroView Usage:**
- Display on ImpactPage map
- Show live Earth events tracked by satellites
- Color-code by category
- Demonstrates satellite impact on disaster monitoring

**Backend Route:** `GET /api/nasa/eonet?status=open&limit=20`  
**Cache TTL:** 1 hour  
**No API key required**

---

## 2. Open Notify (ISS Position)

**Base URL:** `http://api.open-notify.org`  
**Documentation:** http://open-notify.org/Open-Notify-API/

**Endpoint:** `GET /iss-now.json`

**Description:** Returns the current latitude and longitude of the International Space Station.

**Query Parameters:** None

**Example Request:**
```
GET http://api.open-notify.org/iss-now.json
```

**Example Response:**
```json
{
  "message": "success",
  "timestamp": 1707912345,
  "iss_position": {
    "latitude": "45.3762",
    "longitude": "-122.6151"
  }
}
```

**AstroView Usage:**
- Real-time ISS tracking on TrackerPage
- Auto-refresh every 5 seconds
- Display on Leaflet map

**Backend Route:** `GET /api/satellites/iss-position`  
**Cache TTL:** 10 seconds  
**No authentication required**

---

## 3. N2YO (Satellite Tracking)

**Base URL:** `https://api.n2yo.com/rest/v1/satellite`  
**Documentation:** https://www.n2yo.com/api/

**Authentication:** API Key in URL `&apiKey={KEY}`  
**Rate Limit:** 1000 requests/hour (free tier)  
**How to get key:** https://www.n2yo.com/api/#documentation

**Important NORAD IDs:**
- ISS: 25544
- Hubble: 20580
- Starlink-1007: 44713

### 3.1 Satellite Positions

**Endpoint:** `GET /positions/{id}/{observer_lat}/{observer_lon}/{observer_alt}/{seconds}`

**Parameters:**
- `id`: NORAD catalog ID (e.g., 25544 for ISS)
- `observer_lat`: Observer's latitude (-90 to 90)
- `observer_lon`: Observer's longitude (-180 to 180)
- `observer_alt`: Observer's altitude above sea level in meters
- `seconds`: Number of future positions to return (max 300)

**Example Request:**
```
GET https://api.n2yo.com/rest/v1/satellite/positions/25544/45.3762/-122.6151/0/2&apiKey=DEMO_KEY
```

**Example Response:**
```json
{
  "info": {
    "satname": "SPACE STATION",
    "satid": 25544
  },
  "positions": [
    {
      "satlatitude": 45.4521,
      "satlongitude": -122.8754,
      "sataltitude": 418.75,
      "azimuth": 156.32,
      "elevation": 12.45,
      "ra": 123.45,
      "dec": 23.12,
      "timestamp": 1707912345
    }
  ]
}
```

**AstroView Usage:**
- Track ISS position (alternative to Open Notify)
- Show trajectory path
- Display altitude, velocity

**Backend Route:** `GET /api/satellites/positions/:noradId?lat={}&lon={}&seconds=2`  
**Cache TTL:** 10 seconds

---

### 3.2 Visual Passes

**Endpoint:** `GET /visualpasses/{id}/{observer_lat}/{observer_lon}/{observer_alt}/{days}/{min_visibility}`

**Parameters:**
- `id`: NORAD ID
- `days`: Number of days to predict (max 10)
- `min_visibility`: Minimum number of seconds the pass must be visible (default 300)

**Example Request:**
```
GET https://api.n2yo.com/rest/v1/satellite/visualpasses/25544/45.3762/-122.6151/0/7/300&apiKey=DEMO_KEY
```

**Example Response:**
```json
{
  "info": {
    "satname": "SPACE STATION",
    "passescount": 5
  },
  "passes": [
    {
      "startAz": 336.12,
      "startAzCompass": "NNW",
      "startEl": 10.0,
      "startUTC": 1707918000,
      "maxAz": 45.23,
      "maxAzCompass": "NE",
      "maxEl": 68.45,
      "maxUTC": 1707918300,
      "endAz": 154.67,
      "endAzCompass": "SSE",
      "endEl": 10.0,
      "endUTC": 1707918600,
      "mag": -2.5,
      "duration": 600
    }
  ]
}
```

**AstroView Usage:**
- Show upcoming visible ISS passes
- Display start time, duration, max elevation, brightness
- Compass directions for viewing
- Only show passes with magnitude < 2.5 (visible to naked eye)

**Backend Route:** `GET /api/satellites/passes/:noradId?lat={}&lon={}&days=7`  
**Cache TTL:** 1 hour

---

### 3.3 What's Above Me

**Endpoint:** `GET /above/{observer_lat}/{observer_lon}/{observer_alt}/{search_radius}/{category_id}`

**Parameters:**
- `search_radius`: Degrees from observer (0-90)
- `category_id`: 0=all, 1=amateur radio, 2=weather, 3=GPS, etc.

**Example Request:**
```
GET https://api.n2yo.com/rest/v1/satellite/above/45.3762/-122.6151/0/70/0&apiKey=DEMO_KEY
```

**Example Response:**
```json
{
  "info": {
    "category": "All",
    "transactionscount": 1,
    "satcount": 12
  },
  "above": [
    {
      "satid": 25544,
      "satname": "SPACE STATION",
      "intDesignator": "1998-067A",
      "launchDate": "1998-11-20",
      "satlat": 45.67,
      "satlng": -122.34,
      "satalt": 418.25
    }
  ]
}
```

**AstroView Usage:**
- "What's Above Me" button on TrackerPage
- Show overhead satellites with purpose/category
- Auto-refresh every 30 seconds

**Backend Route:** `GET /api/satellites/overhead?lat={}&lon={}&radius=70`  
**Cache TTL:** 30 seconds

---

## 4. Astronomy API

**Base URL:** `https://api.astronomyapi.com/api/v2`  
**Documentation:** https://docs.astronomyapi.com

**Authentication:** HTTP Basic Auth
- Username: Application ID
- Password: Application Secret

**Rate Limit:** 1000 requests/day (free tier)  
**How to get credentials:** https://astronomyapi.com/dashboard

### 4.1 Moon Phase

**Endpoint:** `POST /bodies/positions/moon`

**Headers:**
```
Authorization: Basic base64(appId:appSecret)
Content-Type: application/json
```

**Request Body:**
```json
{
  "latitude": 45.3762,
  "longitude": -122.6151,
  "elevation": 0,
  "from_date": "2024-02-14",
  "to_date": "2024-02-14",
  "time": "12:00:00"
}
```

**Example Response:**
```json
{
  "data": {
    "table": {
      "rows": [
        {
          "cells": [
            {
              "date": "2024-02-14",
              "distance": {
                "fromEarth": {
                  "km": "384400",
                  "au": "0.00257"
                }
              },
              "position": {
                "horizontal": {
                  "altitude": {
                    "degrees": "45.23"
                  },
                  "azimuth": {
                    "degrees": "134.56"
                  }
                }
              },
              "extraInfo": {
                "phase": {
                  "angle": "78.45",
                  "string": "Waxing Gibbous"
                }
              }
            }
          ]
        }
      ]
    }
  }
}
```

**AstroView Usage:**
- Display moon phase on HomePage
- Show phase name and illumination percentage
- Visual moon phase icon

**Backend Route:** `GET /api/astronomy/moon-phase?date={YYYY-MM-DD}`  
**Cache TTL:** 6 hours

---

### 4.2 Planet Positions

**Endpoint:** `POST /bodies/positions`

**Request Body:** (similar to moon phase, specify planet: mars, venus, jupiter, etc.)

**AstroView Usage:**
- Show visible planets tonight
- Best viewing time and direction

**Backend Route:** `GET /api/astronomy/planets?lat={}&lon={}`  
**Cache TTL:** 1 hour

---

## 5. OpenWeatherMap

**Base URL:** `https://api.openweathermap.org/data/2.5`  
**Documentation:** https://openweathermap.org/api

**Authentication:** API Key in URL `&appid={KEY}`  
**Rate Limit:** 60 calls/minute (free tier)  
**How to get key:** https://home.openweathermap.org/api_keys

**Endpoint:** `GET /weather`

**Query Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude
- `appid` (required): API key
- `units` (optional): "metric", "imperial", or "standard"

**Example Request:**
```
GET https://api.openweathermap.org/data/2.5/weather?lat=45.3762&lon=-122.6151&appid=DEMO_KEY&units=metric
```

**Example Response:**
```json
{
  "coord": {
    "lon": -122.6151,
    "lat": 45.3762
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01n"
    }
  ],
  "main": {
    "temp": 12.5,
    "feels_like": 11.2,
    "humidity": 65
  },
  "visibility": 10000,
  "clouds": {
    "all": 5
  },
  "dt": 1707912345,
  "name": "Portland"
}
```

**AstroView Usage:**
- Display sky visibility conditions on HomePage
- Cloud cover percentage
- Visibility rating (excellent/good/fair/poor)
- Weather icon

**Backend Route:** `GET /api/weather/sky-conditions?lat={}&lon={}`  
**Cache TTL:** 30 minutes

---

## 6. NOAA SWPC (Space Weather Prediction Center)

**Base URL:** `https://services.swpc.noaa.gov`  
**Documentation:** https://www.swpc.noaa.gov/products

**Authentication:** None (public government data)  
**Rate Limit:** None specified (reasonable use)

### 6.1 Aurora Ovation Model

**Endpoint:** `GET /json/ovation_aurora_latest.json`

**Description:** Latest aurora forecast showing probability and intensity globally.

**Example Request:**
```
GET https://services.swpc.noaa.gov/json/ovation_aurora_latest.json
```

**Example Response:**
```json
{
  "Forecast Time": "2024-02-14T12:00:00",
  "Data Format": "2D array",
  "coordinates": [
    [45.0, -122.0, 15],
    [45.5, -122.5, 23],
    ...
  ]
}
```

**Note:** Response is a large array of lat/lon/aurora-intensity values.

**AstroView Usage:**
- Aurora visibility indicator on HomePage
- Show probability for user's location
- Alert when aurora likely visible

**Backend Route:** `GET /api/astronomy/aurora-forecast?lat={}&lon={}`  
**Cache TTL:** 1 hour

---

### 6.2 Planetary K-Index

**Endpoint:** `GET /products/noaa-planetary-k-index.json`

**Description:** K-index measures geomagnetic activity (0-9). Values > 5 indicate geomagnetic storm (aurora visible at lower latitudes).

**Example Response:**
```json
[
  {
    "time_tag": "2024-02-14T00:00:00",
    "Kp": "3",
    "a_running": "12"
  },
  {
    "time_tag": "2024-02-14T03:00:00",
    "Kp": "5",
    "a_running": "18"
  }
]
```

**AstroView Usage:**
- Display current space weather activity
- Alert when Kp > 5 (aurora likely)

**Backend Route:** `GET /api/astronomy/k-index`  
**Cache TTL:** 1 hour

---

## 7. Google Gemini AI

**Base URL:** `https://generativelanguage.googleapis.com/v1beta`  
**Documentation:** https://ai.google.dev/tutorials/rest_quickstart

**Authentication:** API Key in URL `?key={KEY}`  
**Rate Limit:** 60 requests/minute (free tier)  
**How to get key:** https://makersuite.google.com/app/apikey

**Endpoint:** `POST /models/gemini-pro:generateContent`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Explain the following space concept to a 5th grader in 100 words or less: {CONTENT_HERE}"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 150
  }
}
```

**Example Request:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=DEMO_KEY
Content-Type: application/json

{
  "contents": [{
    "parts": [{
      "text": "Explain the following to a 5th grader: The Mars 2020 Perseverance rover mission is part of NASA's Mars Exploration Program, a long-term effort of robotic exploration of the Red Planet."
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 150
  }
}
```

**Example Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "NASA sent a robot called Perseverance to Mars! It's like a super smart car that drives around the Red Planet, taking pictures and collecting rock samples. Scientists want to learn if Mars ever had tiny living things (like bacteria) and if humans could visit Mars someday. Perseverance is helping us understand Mars better!"
          }
        ]
      },
      "finishReason": "STOP"
    }
  ]
}
```

**AstroView Usage:**
- "Explain Simply" toggle on complex content
- Send: mission descriptions, event explanations, glossary terms
- Display simplified response in modal
- Cache responses for 24 hours (same input = same output)

**Backend Route:** `POST /api/ai/simplify` (body: { text, context })  
**Cache TTL:** 24 hours (based on hash of input text)

---

## Backend Route Summary

### NASA Routes (`/api/nasa/*`)
- `GET /api/nasa/apod?date={YYYY-MM-DD}` → APOD image
- `GET /api/nasa/neo?start_date={}&end_date={}` → Near-Earth objects
- `GET /api/nasa/solar-flares?start={}&end={}` → Solar flares
- `GET /api/nasa/geomagnetic-storms?start={}&end={}` → Geomagnetic storms
- `GET /api/nasa/cme?start={}&end={}` → Coronal mass ejections
- `GET /api/nasa/eonet?status=open&limit=20` → Earth natural events

### Satellite Routes (`/api/satellites/*`)
- `GET /api/satellites/iss-position` → Current ISS lat/lon
- `GET /api/satellites/positions/:noradId?lat={}&lon={}&seconds=2` → Satellite positions
- `GET /api/satellites/passes/:noradId?lat={}&lon={}&days=7` → Visual passes
- `GET /api/satellites/overhead?lat={}&lon={}&radius=70` → Overhead satellites

### Astronomy Routes (`/api/astronomy/*`)
- `GET /api/astronomy/moon-phase?date={YYYY-MM-DD}` → Moon phase
- `GET /api/astronomy/planets?lat={}&lon={}` → Planet positions
- `GET /api/astronomy/aurora-forecast?lat={}&lon={}` → Aurora probability
- `GET /api/astronomy/k-index` → Planetary K-index

### Weather Routes (`/api/weather/*`)
- `GET /api/weather/sky-conditions?lat={}&lon={}` → Sky visibility

### AI Routes (`/api/ai/*`)
- `POST /api/ai/simplify` → Simplify text (body: { text, context })

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": "User-friendly error message",
  "code": "API_ERROR_CODE",
  "timestamp": "2024-02-14T10:30:00Z"
}
```

### Common Error Codes

| Code | Message | Resolution |
|------|---------|------------|
| `INVALID_API_KEY` | Invalid API key provided | Check .env file, regenerate key |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait 1 hour or upgrade plan |
| `INVALID_COORDINATES` | Invalid latitude or longitude | Validate input (-90 to 90, -180 to 180) |
| `API_UNAVAILABLE` | External API is unavailable | Retry after 30s, show cached data |
| `NETWORK_ERROR` | Network request failed | Check internet connection, retry |
| `TIMEOUT` | Request timed out | Retry with exponential backoff |

### Retry Logic

All backend API calls implement retry logic:
- **Max retries:** 3
- **Backoff:** Exponential (1s, 2s, 4s)
- **Timeout:** 10 seconds per request
- **On failure:** Return cached data (if available) or error response

---

## Rate Limit Management

### Strategy
1. **Cache aggressively** to minimize API calls
2. **Monitor usage** via console logs (count requests per endpoint)
3. **Fallback to cached data** when rate limit approached
4. **Display error message** to user with suggested retry time

### Example Rate Limit Handler

```javascript
if (response.status === 429) {
  const retryAfter = response.headers['retry-after'] || 3600;
  return {
    success: false,
    error: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
    code: 'RATE_LIMIT_EXCEEDED'
  };
}
```

---

## API Key Security

### Storage
- All API keys in `.env` files (never committed to Git)
- Backend `.env` contains all external API keys
- Frontend `.env` contains **only** backend URL (no API keys)

### Access Pattern
```javascript
// ❌ NEVER expose keys in frontend
const response = await fetch(`https://api.nasa.gov/apod?api_key=${KEY}`);

// ✅ ALWAYS proxy through backend
const response = await fetch('/api/nasa/apod');
```

### Environment Variable Names

**Backend `.env`:**
```
NASA_API_KEY=your_nasa_key_here
N2YO_API_KEY=your_n2yo_key_here
ASTRONOMY_API_ID=your_astronomy_id_here
ASTRONOMY_API_SECRET=your_astronomy_secret_here
OPENWEATHER_API_KEY=your_openweather_key_here
GEMINI_API_KEY=your_gemini_key_here
```

**Frontend `.env`:**
```
VITE_API_BASE_URL=http://localhost:3001
```

---

## Testing Endpoints

### Tools
- **Postman** or **Thunder Client** (VS Code extension)
- **cURL** for command-line testing
- **Browser DevTools** Network tab

### Example cURL Commands

```bash
# Test NASA APOD
curl "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"

# Test ISS Position
curl "http://api.open-notify.org/iss-now.json"

# Test Backend Route
curl "http://localhost:3001/api/nasa/apod"
```

---

## API Credits & Attribution

Per API terms of service, the following attribution must be displayed:

**NASA APIs:**
> "Data provided by NASA's Open APIs. For more information, visit https://api.nasa.gov"

**N2YO:**
> "Satellite data provided by N2YO.com"

**Astronomy API:**
> "Astronomical data provided by Astronomy API"

**OpenWeatherMap:**
> "Weather data provided by OpenWeatherMap"

**NOAA SWPC:**
> "Space weather data provided by NOAA Space Weather Prediction Center"

**Google Gemini:**
> "Text simplification powered by Google Gemini AI"

**Display in Footer:**
- Add "API Credits" or "Data Sources" section in footer
- Link to each API's website
