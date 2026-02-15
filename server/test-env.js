import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('__dirname:', __dirname);
console.log('.env path:', join(__dirname, '.env'));

const result = dotenv.config({ path: join(__dirname, '.env') });

console.log('\n=== Dotenv Result ===');
console.log('Error:', result.error);
console.log('Parsed keys:', result.parsed ? Object.keys(result.parsed) : 'NONE');

console.log('\n=== Environment Variables ===');
console.log('PORT:', process.env.PORT);
console.log('NASA_API_KEY:', process.env.NASA_API_KEY ? `${process.env.NASA_API_KEY.substring(0, 20)}...` : 'NOT SET');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 20)}...` : 'NOT SET');
console.log('===========================');
