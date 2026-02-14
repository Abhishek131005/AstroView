import axios from 'axios';
import { asyncHandler } from '../middleware/errorHandler.js';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get sky conditions for stargazing
 * GET /api/weather/sky?lat=40.7128&lon=-74.0060
 */
export const getSkyConditions = asyncHandler(async (req, res) => {
  const { lat, lon, days } = req.query;
  
  if (!OPENWEATHER_API_KEY) {
    return res.json({
      cloudCover: Math.floor(Math.random() * 100),
      visibility: 10000,
      temperature: 15 + Math.random() * 10,
      conditions: 'Clear',
      humidity: 50 + Math.random() * 30,
      windSpeed: Math.random() * 10,
      _demo: true,
      message: 'Using demo data. Set OPENWEATHER_API_KEY for real data.',
    });
  }
  
  if (days) {
    // Forecast for multiple days
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        cnt: days * 8, // 3-hour intervals
      },
    });
    
    // Group by day and return daily summaries
    const dailyForecasts = [];
    const grouped = {};
    
    response.data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    
    Object.keys(grouped).forEach(date => {
      const dayData = grouped[date];
      const avgCloudCover = dayData.reduce((sum, d) => sum + d.clouds.all, 0) / dayData.length;
      
      dailyForecasts.push({
        date,
        cloudCover: Math.round(avgCloudCover),
        conditions: dayData[0].weather[0].main,
        temperature: dayData[0].main.temp,
        visibility: dayData[0].visibility,
      });
    });
    
    return res.json(dailyForecasts);
  }
  
  // Current weather
  const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
    },
  });
  
  res.json({
    cloudCover: response.data.clouds.all,
    visibility: response.data.visibility,
    temperature: response.data.main.temp,
    conditions: response.data.weather[0].main,
    description: response.data.weather[0].description,
    humidity: response.data.main.humidity,
    windSpeed: response.data.wind.speed,
  });
});
