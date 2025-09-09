export async function onRequest(context) {
  // Handle CORS preflight requests
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      }
    });
  }

  // Get the API key from environment variables
  const OWM_API_KEY = context.env.OWM_API_KEY;
  
  // Log all environment variables (without values) for debugging
  const envKeys = Object.keys(context.env || {});
  console.log(`Available environment variables: ${envKeys.join(', ')}`);
  
  if (!OWM_API_KEY) {
    return new Response(JSON.stringify({ 
      success: false,
      error: 'API key not configured',
      message: 'The OWM_API_KEY environment variable is not set',
      availableEnvVars: envKeys.length,
      envVarNames: envKeys
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  // Mask the API key for security while showing part of it for debugging
  const apiKeyPrefix = OWM_API_KEY.substring(0, 4);
  const apiKeyLength = OWM_API_KEY.length;
  console.log(`API Key found. Length: ${apiKeyLength}, Prefix: ${apiKeyPrefix}***`);
  

  try {
    // Make a simple test call to the OpenWeatherMap API
    const testUrl = `https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=${OWM_API_KEY}&units=metric`;
    console.log(`Testing OpenWeatherMap API with URL pattern: api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=[MASKED]&units=metric`);
    
    const response = await fetch(testUrl);
    console.log(`API Response status: ${response.status} ${response.statusText}`);
    
    // If not ok, return the error
    if (!response.ok) {
      // Log the error
      console.error(`API returned error status: ${response.status} ${response.statusText}`);
      
      // Try to get error details
      let errorText = '';
      try {
        errorText = await response.text();
        console.error(`Error response: ${errorText.substring(0, 200)}`);
      } catch (e) {
        console.error(`Could not read error response: ${e.message}`);
        errorText = `Could not read error response: ${e.message}`;
      }
      
      return new Response(JSON.stringify({
        success: false,
        error: 'API Test Failed',
        status: response.status,
        statusText: response.statusText,
        responseText: errorText.substring(0, 500),
        apiKeyLength,
        apiKeyPrefix
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    }
    
    // Get response text
    const responseText = await response.text();
    console.log(`Got API response (${responseText.length} chars)`);
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log(`Successfully parsed JSON response: ${data.name}`);
      
      return new Response(JSON.stringify({
        success: true,
        message: 'API key is valid and working',
        data: {
          city: data.name,
          country: data.sys?.country,
          weather: data.weather?.[0]?.main,
          description: data.weather?.[0]?.description,
          temp: data.main?.temp,
          feels_like: data.main?.feels_like,
          humidity: data.main?.humidity
        },
        apiKeyLength,
        apiKeyPrefix,
        timestamp: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    } catch (e) {
      console.error(`Failed to parse API response: ${e.message}`);
      console.error(`Response preview: ${responseText.substring(0, 100)}`);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'JSON Parse Error',
        message: e.message,
        responsePreview: responseText.substring(0, 500),
        apiKeyLength,
        apiKeyPrefix
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    }
  } catch (error) {
    console.error(`Exception during API test: ${error.message}`);
    console.error(`Stack trace: ${error.stack || 'No stack trace'}`);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'API Test Error',
      message: error.message,
      stack: error.stack || 'No stack trace available',
      apiKeyLength,
      apiKeyPrefix
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  }
}
