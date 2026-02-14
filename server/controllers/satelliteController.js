import axios from 'axios';
import { asyncHandler } from '../middleware/errorHandler.js';

const N2YO_API_KEY = process.env.N2YO_API_KEY;
const N2YO_BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';

// ISS NORAD ID
const ISS_ID = 25544;

/**
 * Get current ISS position
 * GET /api/satellite/iss
 */
export const getISSPosition = asyncHandler(async (req, res) => {
  if (!N2YO_API_KEY) {
    return res.json({
      lat: 0,
      lon: 0,
      altitude: 408,
      velocity: 7.66,
      timestamp: new Date().toISOString(),
      _demo: true,
      message: 'Using demo data. Set N2YO_API_KEY for real data.',
    });
  }
  
  const response = await axios.get(`${N2YO_BASE_URL}/positions/${ISS_ID}/0/0/0/1`, {
    params: { apiKey: N2YO_API_KEY },
  });
  
  const position = response.data.positions[0];
  
  res.json({
    lat: position.satlatitude,
    lon: position.satlongitude,
    altitude: position.sataltitude,
    timestamp: new Date(position.timestamp * 1000).toISOString(),
  });
});

/**
 * Get satellite passes over a location
 * GET /api/satellite/passes?noradId=25544&lat=40.7128&lon=-74.0060&days=10
 */
export const getSatellitePasses = asyncHandler(async (req, res) => {
  const { noradId, lat, lon, days = 10 } = req.query;
  
  if (!N2YO_API_KEY) {
    return res.json({
      passes: [],
      _demo: true,
      message: 'Set N2YO_API_KEY for real data.',
    });
  }
  
  const response = await axios.get(
    `${N2YO_BASE_URL}/visualpasses/${noradId}/${lat}/${lon}/0/${days}/300`,
    {
      params: { apiKey: N2YO_API_KEY },
    }
  );
  
  const passes = response.data.passes.map(pass => ({
    startTime: new Date(pass.startUTC * 1000).toISOString(),
    endTime: new Date(pass.endUTC * 1000).toISOString(),
    duration: pass.duration,
    maxElevation: pass.maxEl,
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
  
  if (!N2YO_API_KEY) {
    return res.json({
      satellites: [],
      _demo: true,
      message: 'Set N2YO_API_KEY for real data.',
    });
  }
  
  const response = await axios.get(
    `${N2YO_BASE_URL}/above/${lat}/${lon}/0/${radius}/0`,
    {
      params: { apiKey: N2YO_API_KEY },
    }
  );
  
  const satellites = response.data.above.map(sat => ({
    id: sat.satid,
    name: sat.satname,
    lat: sat.satlat,
    lon: sat.satlng,
    altitude: sat.satalt,
  }));
  
  res.json({ satellites });
});
