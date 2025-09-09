export async function onRequest(context) {
  // Get API key info
  const apiKey = context.env.OWM_API_KEY || 'API_KEY_NOT_FOUND';
  const apiKeyInfo = apiKey !== 'API_KEY_NOT_FOUND' ? {
    length: apiKey.length,
    prefix: apiKey.substring(0, 4),
    suffix: apiKey.substring(apiKey.length - 2)
  } : null;
  
  // List all environment variables (names only)
  const envVars = Object.keys(context.env || {});
  
  // Get URL info
  const url = new URL(context.request.url);
  const hostname = url.hostname;
  const origin = url.origin;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather Dashboard API Diagnostics</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 { color: #0284c7; }
    pre {
      background: #f1f5f9;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .tools {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .tool-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
    }
    .tool-card h3 {
      margin-top: 0;
    }
    .tool-card p {
      flex-grow: 1;
    }
    .button {
      display: inline-block;
      background: #0284c7;
      color: white;
      text-decoration: none;
      padding: 10px 15px;
      border-radius: 4px;
      font-weight: 500;
      text-align: center;
      transition: background-color 0.2s;
    }
    .button:hover {
      background: #0369a1;
    }
    .success { color: #16a34a; }
    .warning { color: #ca8a04; }
    .error { color: #dc2626; }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    table th, table td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    table th {
      background-color: #f8fafc;
    }
  </style>
</head>
<body>
  <h1>Weather Dashboard API Diagnostics</h1>
  <p>Use these tools to help diagnose API connectivity issues with your Weather Dashboard project.</p>
  
  <div class="card">
    <h2>Environment Information</h2>
    <table>
      <tr>
        <th>Item</th>
        <th>Value</th>
        <th>Status</th>
      </tr>
      <tr>
        <td>API Key</td>
        <td>${apiKeyInfo ? `${apiKeyInfo.prefix}...${apiKeyInfo.suffix} (${apiKeyInfo.length} chars)` : 'Not found'}</td>
        <td class="${apiKeyInfo ? 'success' : 'error'}">${apiKeyInfo ? '✅ Found' : '❌ Missing'}</td>
      </tr>
      <tr>
        <td>Environment Variables</td>
        <td>${envVars.join(', ') || 'None'}</td>
        <td class="${envVars.length > 0 ? 'success' : 'warning'}">${envVars.length > 0 ? '✅ Available' : '⚠️ None found'}</td>
      </tr>
      <tr>
        <td>Hostname</td>
        <td>${hostname}</td>
        <td class="success">✅ Accessible</td>
      </tr>
    </table>
  </div>
  
  <h2>Diagnostic Tools</h2>
  <div class="tools">
    <div class="tool-card">
      <h3>API Test</h3>
      <p>Run basic tests against the OpenWeatherMap API to verify your API key is working.</p>
      <a href="/api-test" class="button">Run API Test</a>
    </div>
    
    <div class="tool-card">
      <h3>Detailed API Tests</h3>
      <p>Run comprehensive tests on all OpenWeatherMap API endpoints used by the dashboard.</p>
      <a href="/api-test-detailed" class="button">Run Detailed Tests</a>
    </div>
    
    <div class="tool-card">
      <h3>Direct API Testing</h3>
      <p>Test your API key directly against OpenWeatherMap without using the proxy endpoints.</p>
      <a href="/direct-test" class="button">Run Direct Tests</a>
    </div>
    
    <div class="tool-card">
      <h3>URL Builder Tool</h3>
      <p>Create and test different API URLs to diagnose specific connection issues.</p>
      <a href="/url-builder" class="button">Open URL Builder</a>
    </div>
  </div>
  
  <h2>API Endpoints</h2>
  <div class="card">
    <p>These are the API endpoints available in your Weather Dashboard:</p>
    <table>
      <tr>
        <th>Endpoint</th>
        <th>Description</th>
        <th>Test Link</th>
      </tr>
      <tr>
        <td><code>/api/weather/current</code></td>
        <td>Current weather data for a location</td>
        <td><a href="/api/weather/current?lat=40.7128&lon=-74.006" target="_blank">Test</a></td>
      </tr>
      <tr>
        <td><code>/api/weather/forecast</code></td>
        <td>5-day weather forecast</td>
        <td><a href="/api/weather/forecast?lat=40.7128&lon=-74.006" target="_blank">Test</a></td>
      </tr>
      <tr>
        <td><code>/api/weather/air-pollution</code></td>
        <td>Air pollution data</td>
        <td><a href="/api/weather/air-pollution?lat=40.7128&lon=-74.006" target="_blank">Test</a></td>
      </tr>
      <tr>
        <td><code>/api/geocoding</code></td>
        <td>City search/geocoding</td>
        <td><a href="/api/geocoding?q=London" target="_blank">Test</a></td>
      </tr>
    </table>
  </div>
  
  <div class="card">
    <h2>Troubleshooting Guide</h2>
    <h3>Common Issues:</h3>
    <ul>
      <li><strong>Missing API Key:</strong> Ensure you've set the OWM_API_KEY environment variable in Cloudflare Pages dashboard.</li>
      <li><strong>Invalid API Key:</strong> Verify your API key is valid and has permissions for the Weather and Geocoding APIs.</li>
      <li><strong>CORS Issues:</strong> The API proxy should handle CORS headers, but check browser console for any CORS errors.</li>
      <li><strong>Rate Limiting:</strong> Free OpenWeatherMap accounts have usage limits. Check if you're being rate limited.</li>
      <li><strong>Network Issues:</strong> Cloudflare Functions may have connectivity issues. Try the direct test to check.</li>
    </ul>
    
    <h3>Steps to Resolve:</h3>
    <ol>
      <li>Verify your API key is correctly set in Cloudflare Pages environment variables.</li>
      <li>Run the API Test tool to check if your API key is valid and working.</li>
      <li>Test direct API access to check if there are issues with the OpenWeatherMap API itself.</li>
      <li>Look for specific error codes or messages that might indicate the issue.</li>
      <li>Try recreating your API key in the OpenWeatherMap dashboard if needed.</li>
    </ol>
  </div>
  
  <footer style="text-align: center; margin-top: 40px; color: #64748b;">
    <p>Weather Dashboard API Diagnostics Tool</p>
  </footer>
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
