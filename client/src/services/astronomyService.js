import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Astronomy Service
 * Handles astronomical calculations and data
 */

/**
 * Get moon phase for a specific date
 * @param {string} date - Date (YYYY-MM-DD format)
 * @returns {Promise<object>} Moon phase data { phase, phaseName, illumination, age }
 */
export async function getMoonPhase(date) {
  const response = await api.get(API_ENDPOINTS.MOON_PHASE, {
    params: { date },
  });
  return response.data;
}

/**
 * Get planet positions
 * @param {number} lat - Observer latitude
 * @param {number} lon - Observer longitude
 * @param {string} date - Optional date (YYYY-MM-DD)
 * @returns {Promise<Array>} Planet positions with visibility info
 */
export async function getPlanetPositions(lat, lon, date) {
  const params = { lat, lon };
  if (date) params.date = date;
  
  const response = await api.get(API_ENDPOINTS.PLANET_POSITIONS, { params });
  return response.data;
}

/**
 * Get current moon phase and upcoming phases
 * @returns {Promise<object>} Current phase and next phases
 */
export async function getUpcomingMoonPhases() {
  const today = new Date().toISOString().split('T')[0];
  const currentPhase = await getMoonPhase(today);
  
  // Calculate upcoming key phases (simplified)
  return {
    current: currentPhase,
    // Backend could calculate upcoming full moon, new moon, etc.
  };
}
