export async function onRequest(context) {
  // Get the API key from environment variables
  const OWM_API_KEY = context.env.OWM_API_KEY;
  
  if (!OWM_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
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
    if (path.includes('/weather/current')) {
      // Current weather endpoint
      const lat = params.get('lat');
      const lon = params.get('lon');
      const lang = params.get('lang') || 'en';
      
      openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=${lang}&units=metric&appid=${OWM_API_KEY}`;
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
    const data = await response.json();
    
    // Return the response
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=600' // Cache for 10 minutes
      }
    });
  } 
  catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
