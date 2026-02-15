import axios from 'axios';
import { asyncHandler } from '../middleware/errorHandler.js';

const NASA_BASE_URL = 'https://api.nasa.gov';

// Helper function to get API key (reads fresh each time)
const getApiKey = () => process.env.NASA_API_KEY || 'DEMO_KEY';

/**
 * Get Astronomy Picture of the Day
 * GET /api/nasa/apod?date=YYYY-MM-DD (optional)
 */
export const getAPOD = asyncHandler(async (req, res) => {
  const { date } = req.query;
  
  const params = {
    api_key: getApiKey(),
  };
  
  if (date) {
    params.date = date;
  }
  
  const response = await axios.get(`${NASA_BASE_URL}/planetary/apod`, { params });
  
  res.json({
    title: response.data.title,
    explanation: response.data.explanation,
    url: response.data.url,
    hdurl: response.data.hdurl,
    mediaType: response.data.media_type,
    date: response.data.date,
    copyright: response.data.copyright,
  });
});

/**
 * Get Near Earth Objects
 * GET /api/nasa/neo?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
 */
export const getNearEarthObjects = asyncHandler(async (req, res) => {
  const { start_date, end_date } = req.query;
  
  // Default to today if not provided
  const startDate = start_date || new Date().toISOString().split('T')[0];
  const endDate = end_date || startDate;
  
  const response = await axios.get(`${NASA_BASE_URL}/neo/rest/v1/feed`, {
    params: {
      start_date: startDate,
      end_date: endDate,
      api_key: getApiKey(),
    },
  });
  
  // Flatten the near_earth_objects structure
  const neoData = response.data.near_earth_objects;
  const asteroids = [];
  
  Object.keys(neoData).forEach(date => {
    neoData[date].forEach(neo => {
      asteroids.push({
        id: neo.id,
        name: neo.name,
        date: date,
        estimatedDiameter: neo.estimated_diameter.kilometers,
        isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
        closeApproachData: neo.close_approach_data[0] ? {
          date: neo.close_approach_data[0].close_approach_date,
          velocity: parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_second),
          missDistance: parseFloat(neo.close_approach_data[0].miss_distance.kilometers),
        } : null,
        absoluteMagnitude: neo.absolute_magnitude_h,
      });
    });
  });
  
  res.json({
    elementCount: response.data.element_count,
    asteroids: asteroids,
  });
});

/**
 * Get Solar Flares from NASA DONKI
 * GET /api/nasa/solar-flares?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export const getSolarFlares = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  // Default to last 7 days
  const end = endDate || new Date().toISOString().split('T')[0];
  const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const response = await axios.get(`${NASA_BASE_URL}/DONKI/FLR`, {
    params: {
      startDate: start,
      endDate: end,
      api_key: getApiKey(),
    },
  });
  
  const flares = response.data.map(flare => ({
    id: flare.flrID,
    beginTime: flare.beginTime,
    peakTime: flare.peakTime,
    endTime: flare.endTime,
    classType: flare.classType,
    sourceLocation: flare.sourceLocation,
    activeRegionNum: flare.activeRegionNum,
    linkedEvents: flare.linkedEvents,
  }));
  
  res.json(flares);
});

/**
 * Get Geomagnetic Storms from NASA DONKI
 * GET /api/nasa/geomagnetic-storms?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export const getGeomagneticStorms = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const end = endDate || new Date().toISOString().split('T')[0];
  const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const response = await axios.get(`${NASA_BASE_URL}/DONKI/GST`, {
    params: {
      startDate: start,
      endDate: end,
      api_key: getApiKey(),
    },
  });
  
  const storms = response.data.map(storm => ({
    id: storm.gstID,
    startTime: storm.startTime,
    linkedEvents: storm.linkedEvents,
    kpIndex: storm.allKpIndex?.[0]?.kpIndex,
  }));
  
  res.json(storms);
});

/**
 * Get Coronal Mass Ejections from NASA DONKI
 * GET /api/nasa/cme?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export const getCME = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const end = endDate || new Date().toISOString().split('T')[0];
  const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const response = await axios.get(`${NASA_BASE_URL}/DONKI/CME`, {
    params: {
      startDate: start,
      endDate: end,
      api_key: getApiKey(),
    },
  });
  
  const cmes = response.data.map(cme => ({
    id: cme.activityID,
    startTime: cme.startTime,
    sourceLocation: cme.sourceLocation,
    note: cme.note,
    linkedEvents: cme.linkedEvents,
  }));
  
  res.json(cmes);
});

/**
 * Get EONET Natural Events
 * GET /api/nasa/eonet?category=wildfires&limit=20
 */
export const getEONETEvents = asyncHandler(async (req, res) => {
  const { category, limit = 20 } = req.query;
  
  const params = { limit };
  if (category) {
    params.category = category;
  }
  
  const response = await axios.get('https://eonet.gsfc.nasa.gov/api/v3/events', { params });
  
  const events = response.data.events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    categories: event.categories.map(cat => ({
      id: cat.id,
      title: cat.title,
    })),
    geometry: event.geometry?.[0],
    date: event.geometry?.[0]?.date,
    link: event.link,
  }));
  
  res.json({ events });
});
