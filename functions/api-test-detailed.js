export async function onRequest(context) {
  // Handle CORS
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      }
    });
  }

  // Get API key
  const apiKey = context.env.OWM_API_KEY;
  
  if (!apiKey) {
    return new Response(JSON.stringify({
      success: false,
      error: "API Key Missing",
      message: "OWM_API_KEY environment variable is not set in Cloudflare"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  
  // Log all environment variables (just names, not values)
  const envVars = Object.keys(context.env || {});
  console.log(`Available environment variables: ${envVars.join(', ')}`);
  
  // Build test URLs
  const testCity = "London";
  const testLat = 51.5074;
  const testLon = -0.1278;
  
  // Keep track of test results
  const results = {
    timestamp: new Date().toISOString(),
    apiKeyInfo: {
      prefix: apiKey.substring(0, 4),
      suffix: apiKey.substring(apiKey.length - 2),
      length: apiKey.length
    },
    tests: {}
  };
  
  // Test function
  async function runApiTest(name, url) {
    console.log(`Running test "${name}" with URL: ${url.replace(apiKey, '[REDACTED]')}`);
    
    try {
      // Make the request
      const response = await fetch(url);
      console.log(`${name} response status: ${response.status} ${response.statusText}`);
      
      // Get the response text
      let responseText;
      try {
        responseText = await response.text();
        console.log(`${name} response length: ${responseText.length} chars`);
      } catch (e) {
        console.error(`${name} failed to get response text: ${e.message}`);
        return {
          success: false,
          error: "Failed to get response text",
          status: response.status,
          statusText: response.statusText,
          message: e.message
        };
      }
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log(`${name} successfully parsed JSON response`);
      } catch (e) {
        console.error(`${name} failed to parse JSON: ${e.message}`);
        return {
          success: false,
          error: "Failed to parse JSON",
          message: e.message,
          responsePreview: responseText.substring(0, 100)
        };
      }
      
      // Check for API error responses
      if (!response.ok) {
        console.error(`${name} API returned error status: ${response.status}`);
        return {
          success: false,
          error: "API returned error status",
          status: response.status,
          statusText: response.statusText,
          apiResponse: data
        };
      }
      
      if (data.cod && data.cod !== 200 && data.cod !== "200") {
        console.error(`${name} API returned error code: ${data.cod}`);
        return {
          success: false,
          error: "API returned error code",
          code: data.cod,
          message: data.message,
          apiResponse: data
        };
      }
      
      // Success - return minimal data for cleaner output
      return {
        success: true,
        status: response.status,
        response: data
      };
    } catch (error) {
      console.error(`${name} test exception: ${error.message}`);
      return {
        success: false,
        error: "Exception during test",
        message: error.message,
        stack: error.stack
      };
    }
  }
  
  // Run the tests in parallel
  const [currentTest, forecastTest, geocodingTest] = await Promise.all([
    runApiTest("Current Weather", 
      `https://api.openweathermap.org/data/2.5/weather?lat=${testLat}&lon=${testLon}&appid=${apiKey}&units=metric`),
    runApiTest("Forecast", 
      `https://api.openweathermap.org/data/2.5/forecast?lat=${testLat}&lon=${testLon}&appid=${apiKey}&units=metric`),
    runApiTest("Geocoding", 
      `https://api.openweathermap.org/geo/1.0/direct?q=${testCity}&limit=1&appid=${apiKey}`)
  ]);
  
  // Add results
  results.tests.current = currentTest;
  results.tests.forecast = forecastTest;
  results.tests.geocoding = geocodingTest;
  
  // Simplify successful responses to save space
  if (currentTest.success) {
    const data = currentTest.response;
    results.tests.current.response = {
      name: data.name,
      weather: data.weather?.[0]?.main,
      description: data.weather?.[0]?.description,
      temp: data.main?.temp,
      humidity: data.main?.humidity
    };
  }
  
  if (forecastTest.success) {
    const data = forecastTest.response;
    results.tests.forecast.response = {
      cod: data.cod,
      message: data.message,
      cnt: data.cnt,
      city: data.city?.name,
      country: data.city?.country,
      list: data.list ? [data.list[0]] : []
    };
  }
  
  if (geocodingTest.success && Array.isArray(geocodingTest.response)) {
    results.tests.geocoding.response = geocodingTest.response.length > 0 
      ? [geocodingTest.response[0]] 
      : "Empty array returned";
  }
  
  // Overall success determination
  results.overallSuccess = currentTest.success && forecastTest.success && geocodingTest.success;
  results.message = results.overallSuccess 
    ? "All API tests passed successfully" 
    : "One or more API tests failed";
  
  // Return formatted results
  return new Response(JSON.stringify(results, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
