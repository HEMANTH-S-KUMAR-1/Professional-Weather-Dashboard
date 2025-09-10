export async function onRequest(context) {
  // Handle CORS preflight requests
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      }
    });
  }

  // Get the API key from environment variables
  const OWM_API_KEY = context.env.OWM_API_KEY;
  
  if (!OWM_API_KEY) {
    return new Response(JSON.stringify({ 
      error: 'API key not configured',
      message: 'Please set the OWM_API_KEY environment variable in Cloudflare Pages settings',
      help: 'Visit /api-test to check your API key status or /diagnostics for full troubleshooting tools'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  // Validate API key format (basic check)
  if (OWM_API_KEY.length < 20) {
    return new Response(JSON.stringify({ 
      error: 'Invalid API key format',
      message: 'The provided API key appears to be invalid (too short)',
      help: 'OpenWeatherMap API keys are typically 32 characters long. Please check your key in Cloudflare Pages settings.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // Get the path and parameters
  const url = new URL(context.request.url);
  const path = url.pathname.replace('/api', '');
  const params = url.searchParams;
  
  // Debug logging
  console.log(`🔍 API Request Debug:`);
  console.log(`- Full URL: ${context.request.url}`);
  console.log(`- Path after /api removed: ${path}`);
  console.log(`- Query params: ${params.toString()}`);
  console.log(`- API key configured: ${OWM_API_KEY ? 'Yes' : 'No'}`);
  
  // Add the API key to the parameters
  params.append('appid', OWM_API_KEY);
  
  // Forward to OpenWeatherMap API
  let openWeatherUrl;
  try {
    // Log information for debugging
    console.log(`Processing API request for path: ${path}`);
    
    if (path.includes('/weather/current')) {
      // Current weather endpoint
      const lat = params.get('lat');
      const lon = params.get('lon');
      const lang = params.get('lang') || 'en';
      
      if (!lat || !lon) {
        return new Response(JSON.stringify({ 
          error: 'Missing parameters', 
          message: 'lat and lon are required' 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=${lang}&units=metric&appid=${OWM_API_KEY}`;
      console.log(`Fetching current weather for lat=${lat}, lon=${lon}`);
    } 
    else if (path.includes('/weather/forecast')) {
      // Forecast endpoint
      const lat = params.get('lat');
      const lon = params.get('lon');
      const lang = params.get('lang') || 'en';
      
      openWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=${lang}&units=metric&appid=${OWM_API_KEY}`;
    } 
    else if (path.includes('/weather/air-pollution')) {
      // Air pollution endpoint
      const lat = params.get('lat');
      const lon = params.get('lon');
      
      openWeatherUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}`;
    }
    else if (path.includes('/geo/direct')) {
      // Geocoding endpoint - City search
      const q = params.get('q');
      const limit = params.get('limit') || 5;
      
      if (!q || !q.trim()) {
        return new Response(JSON.stringify({ 
          error: 'Missing parameters', 
          message: 'City name (q parameter) is required' 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      openWeatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=${limit}&appid=${OWM_API_KEY}`;
      console.log(`Searching cities for query: ${q}`);
    }
    else {
      return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Fetch data from OpenWeatherMap
    const response = await fetch(openWeatherUrl);
    
    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenWeatherMap API error: ${response.status} ${response.statusText}`);
      console.error(`Response body: ${errorText.substring(0, 200)}...`);
      
      return new Response(JSON.stringify({ 
        error: 'OpenWeatherMap API error', 
        status: response.status,
        message: `Failed to fetch data from OpenWeatherMap: ${response.statusText}`,
        details: "This is likely due to an invalid API key or rate limiting"
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Parse the response as JSON with error handling
    let data;
    try {
      const responseText = await response.text();
      
      // Log the first part of the response for debugging
      console.log(`OpenWeatherMap API Response (first 100 chars): ${responseText.substring(0, 100)}`);
      
      // Check if response looks like JSON
      if (!responseText.trim().startsWith('{') && !responseText.trim().startsWith('[')) {
        console.error('Response does not appear to be JSON', responseText.substring(0, 200));
        return new Response(JSON.stringify({ 
          error: 'Invalid response format from OpenWeatherMap', 
          message: 'Response did not contain valid JSON',
          hint: "Check if your API key is valid and has the necessary permissions"
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // Try to parse the JSON
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response:', responseText.substring(0, 200));
        return new Response(JSON.stringify({ 
          error: 'Invalid JSON from OpenWeatherMap', 
          message: 'Could not parse the API response as JSON',
          details: jsonError.message
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // Check if the parsed data indicates an error from OpenWeatherMap
      if (data.cod && data.cod !== 200 && data.cod !== '200') {
        console.error('OpenWeatherMap API returned error:', data);
        return new Response(JSON.stringify({
          error: 'OpenWeatherMap API Error',
          message: data.message || 'Unknown error from weather API',
          code: data.cod
        }), {
          status: data.cod === 401 ? 401 : 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    } catch (error) {
      console.error('General error processing API response:', error);
      return new Response(JSON.stringify({ 
        error: 'Error processing weather data', 
        message: error.message || 'An unexpected error occurred',
        details: "There was a problem with the OpenWeatherMap API response"
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Return the response
    console.log(`Successfully fetched data from OpenWeatherMap API for ${path}`);
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=600' // Cache for 10 minutes
      }
    });
  } 
  catch (error) {
    console.error('Error in Cloudflare Function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch data',
      message: error.message || 'An unexpected error occurred',
      path: path
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
