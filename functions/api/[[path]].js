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
      message: 'Please set the OWM_API_KEY environment variable in Cloudflare Pages settings'
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
    else if (path.includes('/geocoding')) {
      // Geocoding endpoint
      const q = params.get('q');
      const limit = params.get('limit') || 5;
      
      openWeatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=${limit}&appid=${OWM_API_KEY}`;
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
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse OpenWeatherMap response as JSON', error);
      return new Response(JSON.stringify({ 
        error: 'Invalid response from OpenWeatherMap', 
        message: 'Failed to parse response as JSON',
        details: "The response from OpenWeatherMap was not valid JSON"
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
