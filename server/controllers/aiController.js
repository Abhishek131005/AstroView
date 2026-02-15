import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Simplify complex text using Google Gemini AI
 * POST /api/ai/simplify
 * Body: { text: string, context: string }
 */
export const simplifyText = asyncHandler(async (req, res) => {
  const { text, context = '' } = req.body;
  
  // Read API key dynamically (not cached at module load time)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  
  if (!GEMINI_API_KEY) {
    console.log('⚠️ GEMINI_API_KEY not found in environment');
    return res.json({
      simplified: text,
      original: text,
      context,
      _demo: true,
      message: 'Using demo mode. Set GEMINI_API_KEY for AI simplification.',
    });
  }
  
  console.log('✓ GEMINI_API_KEY found:', GEMINI_API_KEY.substring(0, 15) + '...');
  
  try {
    const prompt = `You are a friendly space educator explaining to a 14-year-old student. 
Simplify the following text about ${context || 'space'} into easy-to-understand language. 
Use short sentences, avoid jargon, and make it engaging.

Original text:
${text}

Simplified version:`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt,
            }],
          }],
        }),
      }
    );
    
    const data = await response.json();
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini response structure:', data);
      throw new Error('Invalid AI response');
    }
    
    const simplified = data.candidates[0].content.parts[0].text;
    console.log('Simplified text:', simplified);
    
    res.json({
      simplified,
      original: text,
      context,
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback to basic simplification
    res.json({
      simplified: text,
      original: text,
      context,
      _fallback: true,
      message: 'AI service temporarily unavailable. Showing original text.',
    });
  }
});

/**
 * Ask a question about space
 * POST /api/ai/simplify/ask
 * Body: { question: string }
 */
export const askQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;
  
  // Read API key dynamically
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }
  
  if (!GEMINI_API_KEY) {
    return res.json({
      answer: 'AI is not configured. Please set GEMINI_API_KEY.',
      question,
      _demo: true,
    });
  }
  
  try {
    const prompt = `You are a friendly space educator answering questions for students (14+ years old).
Provide a clear, accurate, and engaging answer using simple language.
Keep the answer concise (2-3 paragraphs max).

Question: ${question}

Answer:`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt,
            }],
          }],
        }),
      }
    );
    
    const data = await response.json();
    const answer = data.candidates[0].content.parts[0].text;
    
    res.json({
      answer,
      question,
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    
    res.json({
      answer: 'I apologize, but I am temporarily unable to answer questions. Please try again later.',
      question,
      _error: true,
    });
  }
});
