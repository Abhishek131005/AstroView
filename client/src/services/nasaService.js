import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * NASA API Service
 * Handles all NASA-related API calls
 */

/**
 * Get Astronomy Picture of the Day
 * @param {string} date - Optional date (YYYY-MM-DD format)
 * @returns {Promise<object>} APOD data
 */
export async function getAPOD(date) {
  const params = date ? { date } : {};
  const response = await api.get(API_ENDPOINTS.APOD, { params });
  return response.data;
}

/**
 * Get Near Earth Objects
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<object>} NEO data
 */
export async function getNearEarthObjects(startDate, endDate) {
  const response = await api.get(API_ENDPOINTS.NEO, {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data;
}

/**
 * Get Solar Flares
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Solar flare events
 */
export async function getSolarFlares(startDate, endDate) {
  const response = await api.get(API_ENDPOINTS.SOLAR_FLARES, {
    params: { startDate, endDate },
  });
  return response.data;
}

/**
 * Get Geomagnetic Storms
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Geomagnetic storm events
 */
export async function getGeomagneticStorms(startDate, endDate) {
  const response = await api.get(API_ENDPOINTS.GEOMAGNETIC_STORMS, {
    params: { startDate, endDate },
  });
  return response.data;
}

/**
 * Get Coronal Mass Ejections (CME)
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} CME events
 */
export async function getCME(startDate, endDate) {
  const response = await api.get(API_ENDPOINTS.CME, {
    params: { startDate, endDate },
  });
  return response.data;
}

/**
 * Get EONET Natural Events
 * @param {string} category - Optional category filter
 * @param {number} limit - Maximum number of events (default: 20)
 * @returns {Promise<Array>} EONET events
 */
export async function getEONETEvents(category, limit = 20) {
  const params = { limit };
  if (category) params.category = category;
  
  const response = await api.get(API_ENDPOINTS.EONET_EVENTS, { params });
  return response.data;
}

/**
 * Get all space weather events (combined)
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<object>} All space weather events
 */
export async function getAllSpaceWeather(startDate, endDate) {
  const [flares, storms, cmes] = await Promise.all([
    getSolarFlares(startDate, endDate),
    getGeomagneticStorms(startDate, endDate),
    getCME(startDate, endDate),
  ]);

  return {
    solarFlares: flares,
    geomagneticStorms: storms,
    coronalMassEjections: cmes,
  };
}
