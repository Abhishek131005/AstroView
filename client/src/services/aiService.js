import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * AI Service
 * Handles AI-powered text simplification using Google Gemini
 */

/**
 * Simplify complex text using AI
 * @param {string} text - Complex text to simplify
 * @param {string} context - Optional context (e.g., 'space mission', 'astronomy')
 * @returns {Promise<string>} Simplified text
 */
export async function simplifyText(text, context = '') {
  try {
    const response = await api.post(API_ENDPOINTS.SIMPLIFY, {
      text,
      context,
    });
    
    // Extract simplified text from response
    if (response.data && response.data.simplified) {
      return response.data.simplified;
    }
    
    // Fallback to original text if no simplified version
    return text;
  } catch (error) {
    console.error('AI simplification error:', error);
    // Return original text on error
    return text;
  }
}

/**
 * Ask a question about space
 * @param {string} question - User's question
 * @returns {Promise<object>} { answer, sources }
 */
export async function askQuestion(question) {
  const response = await api.post(`${API_ENDPOINTS.SIMPLIFY}/ask`, {
    question,
  });
  return response.data;
}
