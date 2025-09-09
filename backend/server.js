import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const OWM_API_KEY = process.env.OWM_API_KEY;

if (!OWM_API_KEY) {
  console.error('❌ OpenWeatherMap API key is missing. Please add OWM_API_KEY to your .env file');
  process.exit(1);
}

// Security-enhanced cors configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-production-domain.com',
        /\.your-production-domain\.com$/
      ]
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // Cache preflight requests for 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Add some basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Rate limiting - enhanced implementation
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // Reduced to 30 requests per minute per IP
const GLOBAL_RATE_LIMIT = 100; // Global limit for all IPs combined
let globalRequestCount = 0;
let globalWindowStart = Date.now();

app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // Reset global counter every minute
  if (now - globalWindowStart > RATE_LIMIT_WINDOW) {
    globalRequestCount = 0;
    globalWindowStart = now;
  }
  
  // Check global limit
  if (globalRequestCount >= GLOBAL_RATE_LIMIT) {
    return res.status(429).json({ 
      error: 'Server overloaded', 
      message: 'Too many requests across all users. Please try again later.',
      retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - globalWindowStart)) / 1000)
    });
  }
  
  // Check per-IP limit
  const userRequests = requestCounts.get(ip) || [];
  
  // Clean up old requests
  const recentRequests = userRequests.filter(time => time > now - RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({ 
      error: 'Too many requests', 
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - recentRequests[0])) / 1000)
    });
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  globalRequestCount++;
  
  next();
});

// Base OpenWeatherMap API URL
const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OWM_GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Helper function to make OpenWeatherMap API calls
const fetchWeatherData = async (endpoint, params = {}) => {
  try {
    const url = new URL(endpoint);
    url.searchParams.append('appid', OWM_API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    console.log(`🌐 Fetching: ${url.toString().replace(OWM_API_KEY, '[API_KEY]')}`);
    
    const response = await fetch(url, {
      timeout: 8000, // 8 second timeout
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Weather API Error:', error.message);
    throw error;
  }
};

// Routes

// Current Weather
app.get('/api/weather/current', async (req, res) => {
  try {
    const { lat, lon, lang = 'en' } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const data = await fetchWeatherData(`${OWM_BASE_URL}/weather`, {
      lat,
      lon,
      units: 'metric',
      lang
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5-day Weather Forecast
app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { lat, lon, lang = 'en' } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const data = await fetchWeatherData(`${OWM_BASE_URL}/forecast`, {
      lat,
      lon,
      units: 'metric',
      lang
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Air Pollution Data
app.get('/api/weather/air-pollution', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const data = await fetchWeatherData(`${OWM_BASE_URL}/air_pollution`, {
      lat,
      lon
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Geocoding (City search)
app.get('/api/geo/direct', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const data = await fetchWeatherData(`${OWM_GEO_URL}/direct`, {
      q,
      limit
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    api_key_configured: !!OWM_API_KEY,
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Weather Dashboard Backend running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  
  if (!OWM_API_KEY) {
    console.log('⚠️  Warning: OpenWeatherMap API key not configured');
  } else {
    console.log('✅ OpenWeatherMap API key configured');
  }
});