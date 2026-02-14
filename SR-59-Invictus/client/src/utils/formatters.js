import { format, formatDistance as fnsFormatDistance, formatDistanceToNow } from 'date-fns';

/**
 * Format a date into a readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} formatStr - Format string (default: 'PPP' = 'February 14, 2026')
 * @returns {string} Formatted date string
 */
export function formatDate(date, formatStr = 'PPP') {
  if (!date) return '';
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "in 3 days")
 * @param {Date|string|number} date - Date to format
 * @param {boolean} addSuffix - Add "ago" or "in" suffix (default: true)
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date, addSuffix = true) {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return String(date);
  }
}

/**
 * Format distance in kilometers with appropriate unit
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance (e.g., "384,400 km", "1.5 AU")
 */
export function formatDistance(distanceKm) {
  if (typeof distanceKm !== 'number') return '';
  
  // Astronomical Unit (1 AU = 149,597,870.7 km)
  const AU = 149597870.7;
  
  if (distanceKm > AU) {
    const au = distanceKm / AU;
    return `${au.toFixed(2)} AU`;
  }
  
  // Format with thousands separator
  return `${distanceKm.toLocaleString()} km`;
}

/**
 * Format geographic coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string} Formatted coordinates (e.g., "40.7128°N, 74.0060°W")
 */
export function formatCoordinates(lat, lon) {
  if (typeof lat !== 'number' || typeof lon !== 'number') return '';
  
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}

/**
 * Format duration in seconds to human-readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "2h 30m", "45s")
 */
export function formatDuration(seconds) {
  if (typeof seconds !== 'number') return '';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
}

/**
 * Format velocity in km/s
 * @param {number} kmPerSec - Velocity in km/s
 * @returns {string} Formatted velocity (e.g., "7.66 km/s")
 */
export function formatVelocity(kmPerSec) {
  if (typeof kmPerSec !== 'number') return '';
  return `${kmPerSec.toFixed(2)} km/s`;
}

/**
 * Format altitude in kilometers
 * @param {number} altitudeKm - Altitude in kilometers
 * @returns {string} Formatted altitude (e.g., "408 km", "35,786 km")
 */
export function formatAltitude(altitudeKm) {
  if (typeof altitudeKm !== 'number') return '';
  return `${altitudeKm.toLocaleString()} km`;
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 100)
 * @returns {string} Truncated text with ellipsis
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
