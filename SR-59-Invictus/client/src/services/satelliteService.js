import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Satellite Tracking Service
 * Handles satellite-related API calls
 */

/**
 * Get current ISS position
 * @returns {Promise<object>} ISS position data { lat, lon, altitude, velocity, timestamp }
 */
export async function getISSPosition() {
  const response = await api.get(API_ENDPOINTS.ISS_POSITION);
  return response.data;
}

/**
 * Get satellite passes over a location
 * @param {number} noradId - NORAD catalog ID of the satellite
 * @param {number} lat - Observer latitude
 * @param {number} lon - Observer longitude
 * @param {number} days - Number of days to predict (default: 10)
 * @returns {Promise<Array>} List of satellite passes
 */
export async function getSatellitePasses(noradId, lat, lon, days = 10) {
  const response = await api.get(API_ENDPOINTS.SATELLITE_PASSES, {
    params: { noradId, lat, lon, days },
  });
  return response.data;
}

/**
 * Get satellites currently overhead at a location
 * @param {number} lat - Observer latitude
 * @param {number} lon - Observer longitude
 * @param {number} radius - Search radius in degrees (default: 90)
 * @returns {Promise<Array>} List of overhead satellites
 */
export async function getOverheadSatellites(lat, lon, radius = 90) {
  const response = await api.get(API_ENDPOINTS.OVERHEAD_SATELLITES, {
    params: { lat, lon, radius },
  });
  return response.data;
}

/**
 * Get multiple satellite positions
 * @param {Array<number>} noradIds - Array of NORAD IDs
 * @returns {Promise<Array>} Array of satellite positions
 */
export async function getMultipleSatellitePositions(noradIds) {
  // Note: This would require backend implementation
  // For now, we'll fetch them individually
  const positions = await Promise.all(
    noradIds.map(async (id) => {
      try {
        const response = await api.get(`${API_ENDPOINTS.ISS_POSITION}/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to get position for satellite ${id}:`, error);
        return null;
      }
    })
  );
  
  return positions.filter(Boolean);
}
