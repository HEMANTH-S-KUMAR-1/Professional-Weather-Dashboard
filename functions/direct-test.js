export async function onRequest(context) {
  // Get API key from environment
  const apiKey = context.env.OWM_API_KEY;
  
  // Check if API key exists
  if (!apiKey) {
    return new Response(JSON.stringify({
      success: false,
      error: "Missing API key",
      message: "OWM_API_KEY environment variable is not set"
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  
  // Create response HTML
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Direct API Test</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 { color: #0284c7; }
    pre {
      background: #f1f5f9;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
    }
    .success { color: #16a34a; }
    .error { color: #dc2626; }
    button {
      background: #0284c7;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <h1>OpenWeatherMap API Direct Test</h1>
  <p>This page tests your API key by making direct requests to OpenWeatherMap.</p>
  <p>Your API key: <code>${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 2)}</code> (${apiKey.length} characters)</p>
  
  <div id="results">
    <h2>Test Results:</h2>
    <div id="current"></div>
    <div id="forecast"></div>
    <div id="geocoding"></div>
  </div>
  
  <script>
    // Helper function to create result HTML
    function createResultHtml(title, success, data) {
      const resultClass = success ? 'success' : 'error';
      const statusIcon = success ? '✅' : '❌';
      let html = '<div class="result">';
      html += '<h3>' + statusIcon + ' ' + title + '</h3>';
      html += '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
      html += '</div>';
      return html;
    }
    }
    
    // Test current weather API
    async function testCurrentWeather() {
      const resultDiv = document.getElementById('current');
      resultDiv.innerHTML = '<p>Testing current weather API...</p>';
      
      try {
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.006&appid=${apiKey}&units=metric');
        const data = await response.json();
        
        if (data.cod && data.cod !== 200) {
          resultDiv.innerHTML = createResultHtml('Current Weather API', false, data);
        } else {
          resultDiv.innerHTML = createResultHtml('Current Weather API', true, data);
        }
      } catch (error) {
        resultDiv.innerHTML = createResultHtml('Current Weather API', false, { error: error.message });
      }
    }
    
    // Test forecast API
    async function testForecast() {
      const resultDiv = document.getElementById('forecast');
      resultDiv.innerHTML = '<p>Testing forecast API...</p>';
      
      try {
        const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?lat=40.7128&lon=-74.006&appid=${apiKey}&units=metric');
        const data = await response.json();
        
        if (data.cod && data.cod !== "200") {
          resultDiv.innerHTML = createResultHtml('Forecast API', false, data);
        } else {
          // Truncate the results to show just one forecast item
          const simplified = {
            cod: data.cod,
            message: data.message,
            cnt: data.cnt,
            city: data.city,
            list: data.list ? [data.list[0]] : []
          };
          resultDiv.innerHTML = createResultHtml('Forecast API', true, simplified);
        }
      } catch (error) {
        resultDiv.innerHTML = createResultHtml('Forecast API', false, { error: error.message });
      }
    }
    
    // Test geocoding API
    async function testGeocoding() {
      const resultDiv = document.getElementById('geocoding');
      resultDiv.innerHTML = '<p>Testing geocoding API...</p>';
      
      try {
        const response = await fetch('https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=${apiKey}');
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          resultDiv.innerHTML = createResultHtml('Geocoding API', false, data);
        } else {
          resultDiv.innerHTML = createResultHtml('Geocoding API', true, data.slice(0, 1));
        }
      } catch (error) {
        resultDiv.innerHTML = createResultHtml('Geocoding API', false, { error: error.message });
      }
    }
    
    // Run all tests
    testCurrentWeather();
    testForecast();
    testGeocoding();
  </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
