export async function onRequest(context) {
  // Get the request URL
  const url = new URL(context.request.url);
  const params = url.searchParams;
  
  // Get the API key
  const apiKey = context.env.OWM_API_KEY || 'API_KEY_NOT_FOUND';
  
  // Basic auth check (only in real production systems)
  const basicAuth = false;
  
  // Create HTML response
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API URL Builder Tool</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1, h2 { color: #0284c7; }
    pre {
      background: #f1f5f9;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      white-space: pre-wrap;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    input, select {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      margin-bottom: 10px;
      width: 100%;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    button {
      background: #0284c7;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 10px;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }
    .col {
      flex: 1;
      min-width: 300px;
    }
    .result {
      margin-top: 15px;
    }
    .success { color: #16a34a; }
    .error { color: #dc2626; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <h1>OpenWeatherMap API URL Builder</h1>
  <p>This tool helps you construct and test OpenWeatherMap API URLs to diagnose issues with your implementation.</p>
  
  <div class="card">
    <h2>Environment Information</h2>
    <div class="row">
      <div class="col">
        <p><strong>API Key Status:</strong> ${apiKey !== 'API_KEY_NOT_FOUND' ? 'Found ✅' : 'Not Found ❌'}</p>
        <p><strong>API Key Length:</strong> ${apiKey.length} characters</p>
        <p><strong>API Key Preview:</strong> ${apiKey !== 'API_KEY_NOT_FOUND' ? 
          apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 2) : 'N/A'}</p>
      </div>
      <div class="col">
        <p><strong>Request URL:</strong> ${url.toString().replace(/\?.*/, '')}</p>
        <p><strong>Available Environment Variables:</strong> ${Object.keys(context.env || {}).join(', ') || 'None'}</p>
      </div>
    </div>
  </div>
  
  <div class="card">
    <h2>API URL Builder</h2>
    <div class="row">
      <div class="col">
        <label for="endpoint">API Endpoint:</label>
        <select id="endpoint">
          <option value="current">Current Weather</option>
          <option value="forecast">5-Day Forecast</option>
          <option value="air">Air Pollution</option>
          <option value="geocoding">Geocoding</option>
        </select>
        
        <div id="location-fields">
          <label for="location-type">Location Type:</label>
          <select id="location-type">
            <option value="coords">Coordinates</option>
            <option value="city">City Name</option>
          </select>
          
          <div id="coords-fields">
            <label for="lat">Latitude:</label>
            <input type="text" id="lat" placeholder="e.g. 40.7128" value="40.7128">
            
            <label for="lon">Longitude:</label>
            <input type="text" id="lon" placeholder="e.g. -74.006" value="-74.006">
          </div>
          
          <div id="city-fields" class="hidden">
            <label for="city">City Name:</label>
            <input type="text" id="city" placeholder="e.g. New York" value="New York">
          </div>
        </div>
        
        <label for="units">Units:</label>
        <select id="units">
          <option value="metric">Metric (Celsius)</option>
          <option value="imperial">Imperial (Fahrenheit)</option>
          <option value="standard">Standard (Kelvin)</option>
        </select>
        
        <label for="lang">Language:</label>
        <select id="lang">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="ru">Russian</option>
          <option value="ja">Japanese</option>
          <option value="zh_cn">Chinese (Simplified)</option>
        </select>
        
        <button id="build-url">Build URL</button>
      </div>
      
      <div class="col">
        <h3>Generated URLs</h3>
        
        <label>Direct OpenWeatherMap URL:</label>
        <pre id="direct-url"></pre>
        
        <label>Your API Proxy URL:</label>
        <pre id="proxy-url"></pre>
        
        <div class="row">
          <div class="col">
            <button id="test-direct">Test Direct URL</button>
          </div>
          <div class="col">
            <button id="test-proxy">Test Proxy URL</button>
          </div>
        </div>
        
        <div id="test-result" class="result"></div>
      </div>
    </div>
  </div>
  
  <div class="card">
    <h2>URL Encoding Helper</h2>
    <div class="row">
      <div class="col">
        <label for="raw-text">Raw Text:</label>
        <input type="text" id="raw-text" placeholder="Enter text to encode">
        <button id="encode-text">Encode</button>
      </div>
      <div class="col">
        <label for="encoded-text">URL Encoded Text:</label>
        <input type="text" id="encoded-text" readonly>
        <button id="decode-text">Decode</button>
      </div>
    </div>
  </div>
  
  <script>
    // DOM Elements
    const endpointSelect = document.getElementById('endpoint');
    const locationTypeSelect = document.getElementById('location-type');
    const coordsFields = document.getElementById('coords-fields');
    const cityFields = document.getElementById('city-fields');
    const latInput = document.getElementById('lat');
    const lonInput = document.getElementById('lon');
    const cityInput = document.getElementById('city');
    const unitsSelect = document.getElementById('units');
    const langSelect = document.getElementById('lang');
    const buildUrlButton = document.getElementById('build-url');
    const directUrlOutput = document.getElementById('direct-url');
    const proxyUrlOutput = document.getElementById('proxy-url');
    const testDirectButton = document.getElementById('test-direct');
    const testProxyButton = document.getElementById('test-proxy');
    const testResultDiv = document.getElementById('test-result');
    const rawTextInput = document.getElementById('raw-text');
    const encodedTextInput = document.getElementById('encoded-text');
    const encodeButton = document.getElementById('encode-text');
    const decodeButton = document.getElementById('decode-text');
    
    // Toggle location fields
    locationTypeSelect.addEventListener('change', () => {
      if (locationTypeSelect.value === 'coords') {
        coordsFields.classList.remove('hidden');
        cityFields.classList.add('hidden');
      } else {
        coordsFields.classList.add('hidden');
        cityFields.classList.remove('hidden');
      }
    });
    
    // Build URLs
    buildUrlButton.addEventListener('click', () => {
      const endpoint = endpointSelect.value;
      const locationType = locationTypeSelect.value;
      const units = unitsSelect.value;
      const lang = langSelect.value;
      
      let directUrl = '';
      let proxyUrl = '';
      
      const apiKey = '${apiKey !== 'API_KEY_NOT_FOUND' ? apiKey : 'YOUR_API_KEY'}';
      
      // Build the URLs based on endpoint and location type
      if (endpoint === 'current') {
        if (locationType === 'coords') {
          const lat = latInput.value.trim();
          const lon = lonInput.value.trim();
          directUrl = \`https://api.openweathermap.org/data/2.5/weather?lat=\${lat}&lon=\${lon}&units=\${units}&lang=\${lang}&appid=\${apiKey}\`;
          proxyUrl = \`/api/weather/current?lat=\${lat}&lon=\${lon}&units=\${units}&lang=\${lang}\`;
        } else {
          const city = encodeURIComponent(cityInput.value.trim());
          directUrl = \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&units=\${units}&lang=\${lang}&appid=\${apiKey}\`;
          proxyUrl = \`/api/weather/current?q=\${city}&units=\${units}&lang=\${lang}\`;
        }
      } else if (endpoint === 'forecast') {
        if (locationType === 'coords') {
          const lat = latInput.value.trim();
          const lon = lonInput.value.trim();
          directUrl = \`https://api.openweathermap.org/data/2.5/forecast?lat=\${lat}&lon=\${lon}&units=\${units}&lang=\${lang}&appid=\${apiKey}\`;
          proxyUrl = \`/api/weather/forecast?lat=\${lat}&lon=\${lon}&units=\${units}&lang=\${lang}\`;
        } else {
          const city = encodeURIComponent(cityInput.value.trim());
          directUrl = \`https://api.openweathermap.org/data/2.5/forecast?q=\${city}&units=\${units}&lang=\${lang}&appid=\${apiKey}\`;
          proxyUrl = \`/api/weather/forecast?q=\${city}&units=\${units}&lang=\${lang}\`;
        }
      } else if (endpoint === 'air') {
        const lat = latInput.value.trim();
        const lon = lonInput.value.trim();
        directUrl = \`https://api.openweathermap.org/data/2.5/air_pollution?lat=\${lat}&lon=\${lon}&appid=\${apiKey}\`;
        proxyUrl = \`/api/weather/air-pollution?lat=\${lat}&lon=\${lon}\`;
      } else if (endpoint === 'geocoding') {
        const city = encodeURIComponent(cityInput.value.trim());
        directUrl = \`https://api.openweathermap.org/geo/1.0/direct?q=\${city}&limit=5&appid=\${apiKey}\`;
        proxyUrl = \`/api/geocoding?q=\${city}&limit=5\`;
      }
      
      // Display the URLs
      directUrlOutput.textContent = directUrl;
      proxyUrlOutput.textContent = proxyUrl;
    });
    
    // Test functions
    async function testUrl(url, isProxy) {
      testResultDiv.innerHTML = '<p>Testing URL, please wait...</p>';
      
      try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
          testResultDiv.innerHTML = \`
            <h3 class="error">❌ Error \${response.status} \${response.statusText}</h3>
            <p>Failed to fetch data from \${isProxy ? 'your API proxy' : 'OpenWeatherMap API'}</p>
          \`;
          
          // Try to get the error text
          try {
            const errorText = await response.text();
            testResultDiv.innerHTML += \`<pre>\${errorText}</pre>\`;
          } catch (e) {
            testResultDiv.innerHTML += \`<p>Could not read error details: \${e.message}</p>\`;
          }
          return;
        }
        
        // Get response as text first
        const responseText = await response.text();
        
        // Try to parse as JSON
        try {
          const data = JSON.parse(responseText);
          testResultDiv.innerHTML = \`
            <h3 class="success">✅ Success</h3>
            <p>Successfully fetched data from \${isProxy ? 'your API proxy' : 'OpenWeatherMap API'}</p>
            <pre>\${JSON.stringify(data, null, 2)}</pre>
          \`;
        } catch (e) {
          testResultDiv.innerHTML = \`
            <h3 class="error">❌ Invalid JSON Response</h3>
            <p>The response is not valid JSON. Error: \${e.message}</p>
            <p>Response preview:</p>
            <pre>\${responseText.substring(0, 500)}</pre>
          \`;
        }
      } catch (error) {
        testResultDiv.innerHTML = \`
          <h3 class="error">❌ Network Error</h3>
          <p>Error: \${error.message}</p>
          <p>Make sure the URL is correct and the API is accessible.</p>
        \`;
      }
    }
    
    testDirectButton.addEventListener('click', () => {
      const url = directUrlOutput.textContent;
      if (!url) {
        testResultDiv.innerHTML = '<p class="error">Please build a URL first</p>';
        return;
      }
      testUrl(url, false);
    });
    
    testProxyButton.addEventListener('click', () => {
      const url = proxyUrlOutput.textContent;
      if (!url) {
        testResultDiv.innerHTML = '<p class="error">Please build a URL first</p>';
        return;
      }
      testUrl(url, true);
    });
    
    // Encoding/decoding functions
    encodeButton.addEventListener('click', () => {
      const rawText = rawTextInput.value;
      encodedTextInput.value = encodeURIComponent(rawText);
    });
    
    decodeButton.addEventListener('click', () => {
      const encodedText = encodedTextInput.value;
      try {
        rawTextInput.value = decodeURIComponent(encodedText);
      } catch (e) {
        alert('Error decoding text: ' + e.message);
      }
    });
    
    // Initialize with default values
    buildUrlButton.click();
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
