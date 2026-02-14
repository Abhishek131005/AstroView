import { EVENT_COLORS, EVENT_ICONS, VISIBILITY_THRESHOLDS } from './constants';
import * as LucideIcons from 'lucide-react';

/**
 * Calculate sky visibility based on cloud cover percentage
 * @param {number} cloudCover - Cloud cover percentage (0-100)
 * @returns {object} Visibility info { level, label, color }
 */
export function calculateVisibility(cloudCover) {
  if (cloudCover < VISIBILITY_THRESHOLDS.EXCELLENT) {
    return {
      level: 'excellent',
      label: 'Excellent',
      color: 'aurora-green',
      description: 'Perfect for stargazing',
    };
  } else if (cloudCover < VISIBILITY_THRESHOLDS.GOOD) {
    return {
      level: 'good',
      label: 'Good',
      color: 'electric-blue',
      description: 'Great viewing conditions',
    };
  } else if (cloudCover < VISIBILITY_THRESHOLDS.FAIR) {
    return {
      level: 'fair',
      label: 'Fair',
      color: 'solar-amber',
      description: 'Some clouds may obscure view',
    };
  } else {
    return {
      level: 'poor',
      label: 'Poor',
      color: 'danger-red',
      description: 'Heavy clouds, limited visibility',
    };
  }
}

/**
 * Get Lucide icon component for event type
 * @param {string} eventType - Event type key
 * @returns {React.Component} Lucide icon component
 */
export function getEventIcon(eventType) {
  const iconName = EVENT_ICONS[eventType] || EVENT_ICONS.default;
  return LucideIcons[iconName] || LucideIcons.Circle;
}

/**
 * Get theme color for status or event type
 * @param {string} type - Event or status type
 * @returns {string} Tailwind color class
 */
export function getStatusColor(type) {
  return EVENT_COLORS[type] || EVENT_COLORS.default;
}

/**
 * Check if a date is in the past
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export function isPast(date) {
  return new Date(date) < new Date();
}

/**
 * Check if a date is in the future
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export function isFuture(date) {
  return new Date(date) > new Date();
}

/**
 * Check if a date is today
 * @param {Date|string|number} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const today = new Date();
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Calculate days until a future date
 * @param {Date|string|number} date - Future date
 * @returns {number} Number of days (rounded down)
 */
export function daysUntil(date) {
  const now = new Date();
  const future = new Date(date);
  const diffMs = future - now;
  
  if (diffMs <= 0) return 0;
  
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Sort array by date property
 * @param {Array} array - Array to sort
 * @param {string} dateKey - Property name containing date
 * @param {string} order - 'asc' or 'desc' (default: 'asc')
 * @returns {Array} Sorted array
 */
export function sortByDate(array, dateKey, order = 'asc') {
  const sorted = [...array].sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return dateA - dateB;
  });
  
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Filter array to only future dates
 * @param {Array} array - Array to filter
 * @param {string} dateKey - Property name containing date
 * @returns {Array} Filtered array
 */
export function filterFuture(array, dateKey) {
  return array.filter(item => isFuture(item[dateKey]));
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID string
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clamp a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if geolocation is available
 * @returns {boolean} True if geolocation API is available
 */
export function isGeolocationAvailable() {
  return 'geolocation' in navigator;
}
