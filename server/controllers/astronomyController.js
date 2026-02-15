import axios from 'axios';
import { asyncHandler } from '../middleware/errorHandler.js';

// Helper functions to get API credentials (reads fresh each time)
const getApiId = () => process.env.ASTRONOMY_API_ID;
const getApiSecret = () => process.env.ASTRONOMY_API_SECRET;

/**
 * Get moon phase for a specific date
 * GET /api/astronomy/moon-phase?date=YYYY-MM-DD
 */
export const getMoonPhase = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  if (!getApiId() || !getApiSecret()) {
    // Return demo data
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const phaseIndex = Math.floor(Math.random() * 8);
    
    return res.json({
      date: targetDate,
      phase: phaseIndex / 8,
      phaseName: phases[phaseIndex],
      illumination: Math.random() * 100,
      age: Math.random() * 29.5,
      _demo: true,
      message: 'Using demo data. Set ASTRONOMY_API_ID and ASTRONOMY_API_SECRET for real data.',
    });
  }
  
  const response = await axios.get(
    'https://api.astronomyapi.com/api/v2/bodies/positions/moon',
    {
      params: {
        latitude: 0,
        longitude: 0,
        elevation: 0,
        from_date: targetDate,
        to_date: targetDate,
        time: '00:00:00',
      },
      auth: {
        username: getApiId(),
        password: getApiSecret(),
      },
    }
  );
  
  const moonData = response.data.data.table.rows[0].cells[0];
  
  res.json({
    date: targetDate,
    phase: moonData.extraInfo.phase.fraction,
    phaseName: moonData.extraInfo.phase.string,
    illumination: moonData.extraInfo.illumination,
    age: moonData.extraInfo.age,
  });
});

/**
 * Get planet positions
 * GET /api/astronomy/planets?lat=40.7128&lon=-74.0060&date=YYYY-MM-DD
 */
export const getPlanetPositions = asyncHandler(async (req, res) => {
  const { lat = 0, lon = 0, date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  // Return demo data for now
  const planets = [
    'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'
  ];
  
  const positions = planets.map((planet, index) => ({
    name: planet,
    visible: Math.random() > 0.3,
    altitude: Math.random() * 90,
    azimuth: Math.random() * 360,
    magnitude: -2 + Math.random() * 5,
    constellation: 'Demo Constellation',
  }));
  
  res.json({
    date: targetDate,
    location: { lat: parseFloat(lat), lon: parseFloat(lon) },
    planets: positions,
    _demo: true,
    message: 'Using demo data. Real planet calculations require complex astronomy library.',
  });
});
