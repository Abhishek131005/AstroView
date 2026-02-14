import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Weather Service
 * Handles weather-related API calls for sky conditions
 */

/**
 * Get sky conditions for stargazing
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude  
 * @returns {Promise<object>} Weather data { cloudCover, visibility, temperature, conditions }
 */
export async function getSkyConditions(lat, lon) {
  const response = await api.get(API_ENDPOINTS.SKY_CONDITIONS, {
    params: { lat, lon },
  });
  return response.data;
}

/**
 * Get weather forecast for next few days
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} days - Number of days (default: 3)
 * @returns {Promise<Array>} Forecast array
 */
export async function getWeatherForecast(lat, lon, days = 3) {
  const response = await api.get(API_ENDPOINTS.SKY_CONDITIONS, {
    params: { lat, lon, days },
  });
  return response.data;
}
