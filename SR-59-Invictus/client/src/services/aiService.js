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
 * @returns {Promise<object>} { simplified, original, context }
 */
export async function simplifyText(text, context = '') {
  const response = await api.post(API_ENDPOINTS.SIMPLIFY, {
    text,
    context,
  });
  return response.data;
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
