import axios from 'axios';
import { asyncHandler } from '../middleware/errorHandler.js';

const N2YO_BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';

// Helper function to get API key (reads fresh each time)
const getApiKey = () => process.env.N2YO_API_KEY;

// ISS NORAD ID
const ISS_ID = 25544;

/**
 * Get current ISS position
 * GET /api/satellite/iss
 */
export const getISSPosition = asyncHandler(async (req, res) => {
  if (!getApiKey()) {
    return res.json({
      latitude: 0,
      longitude: 0,
      altitude: 408,
      velocity: 27600,
      timestamp: new Date().toISOString(),
      _demo: true,
      message: 'Using demo data. Set N2YO_API_KEY for real data.',
    });
  }
  
  const response = await axios.get(`${N2YO_BASE_URL}/positions/${ISS_ID}/0/0/0/1`, {
    params: { apiKey: getApiKey() },
  });
  
  const position = response.data.positions[0];
  
  res.json({
    latitude: position.satlatitude,
    longitude: position.satlongitude,
    altitude: position.sataltitude,
    velocity: 27600, // ISS velocity ~27,600 km/h
    timestamp: new Date(position.timestamp * 1000).toISOString(),
  });
});

/**
 * Get satellite passes over a location
 * GET /api/satellite/passes?noradId=25544&lat=40.7128&lon=-74.0060&days=10
 */
export const getSatellitePasses = asyncHandler(async (req, res) => {
  const { noradId, lat, lon, days = 10 } = req.query;
  
  if (!getApiKey()) {
    return res.json({
      passes: [],
      _demo: true,
      message: 'Set N2YO_API_KEY for real data.',
    });
  }
  
  const response = await axios.get(
    `${N2YO_BASE_URL}/visualpasses/${noradId}/${lat}/${lon}/0/${days}/300`,
    {
      params: { apiKey: getApiKey() },
    }
  );
  
  const passes = response.data.passes.map(pass => ({
    startUTC: new Date(pass.startUTC * 1000).toISOString(),
    endUTC: new Date(pass.endUTC * 1000).toISOString(),
    duration: pass.duration,
    maxEl: pass.maxEl,
    startAz: pass.startAz,
    endAz: pass.endAz,
    mag: pass.mag,
  }));
  
  res.json({ passes });
});

/**
 * Get satellites currently overhead
 * GET /api/satellite/overhead?lat=40.7128&lon=-74.0060&radius=90
 */
export const getOverheadSatellites = asyncHandler(async (req, res) => {
  const { lat, lon, radius = 90 } = req.query;
  
  if (!getApiKey()) {
    return res.json({
      above: [],
      _demo: true,
      message: 'Set N2YO_API_KEY for real data.',
    });
  }
  
  const response = await axios.get(
    `${N2YO_BASE_URL}/above/${lat}/${lon}/0/${radius}/0`,
    {
      params: { apiKey: getApiKey() },
    }
  );
  
  const satellites = response.data.above.map(sat => ({
    satid: sat.satid,
    satname: sat.satname,
    satcategory: sat.satcategory || 5,
    satalt: sat.satalt,
    satlat: sat.satlat,
    satlng: sat.satlng,
  }));
  
  res.json({ above: satellites });
});
