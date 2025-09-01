/**
 * Enhanced Weather Dashboard Application
 * Professional-grade JavaScript with modern best practices
 */

// ===== CONFIGURATION =====
const CONFIG = {
  // IMPORTANT: Add your OpenWeatherMap API key below after deploying to Cloudflare Pages.
  // Never commit your real API key to a public repository.
  API_KEY: process.env.OPENWEATHER_API_KEY || 'fc145dd4b6ef156ad8cc792320c3689f',
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
  CACHE_DURATION: 10 * 60 * 1000, // 10 minutes in milliseconds
  DEBOUNCE_DELAY: 300,
  MAX_RECENT_SEARCHES: 5
};

// Weather icon mapping for better visual representation
const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙', // clear sky
  '02d': '⛅', '02n': '☁️', // few clouds
  '03d': '☁️', '03n': '☁️', // scattered clouds
  '04d': '☁️', '04n': '☁️', // broken clouds
  '09d': '🌧️', '09n': '🌧️', // shower rain
  '10d': '🌦️', '10n': '🌧️', // rain
  '11d': '⛈️', '11n': '⛈️', // thunderstorm
  '13d': '❄️', '13n': '❄️', // snow
  '50d': '🌫️', '50n': '🌫️'  // mist
};

// ===== STATE MANAGEMENT =====
class WeatherApp {
  constructor() {
    this.cache = new Map();
    this.recentSearches = this.loadRecentSearches();
    this.currentCity = null;
    this.isLoading = false;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupAccessibility();
    this.showWelcomeMessage();
    
    // Show demo if no API key is provided
    if (CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
      setTimeout(() => this.showDemo(), 2000);
    }
  }

  // ===== EVENT BINDING =====
  bindEvents() {
    // Search form submission
    const searchForm = document.querySelector('.search-form');
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('cityInput');
    
    searchForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSearch();
    });

    // Input validation and suggestions
    cityInput?.addEventListener('input', this.debounce(() => {
      this.validateInput();
    }, CONFIG.DEBOUNCE_DELAY));

    // Quick search buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const city = e.target.dataset.city;
        if (city) {
          cityInput.value = city;
          this.handleSearch();
        }
      });
    });

    // Action buttons
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
      if (this.currentCity) {
        this.fetchWeather(this.currentCity, true); // Force refresh
      }
    });

    document.getElementById('shareBtn')?.addEventListener('click', () => {
      this.shareWeatherData();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'k':
            e.preventDefault();
            cityInput?.focus();
            break;
          case 'r':
            e.preventDefault();
            if (this.currentCity) {
              this.fetchWeather(this.currentCity, true);
            }
            break;
        }
      }
    });
  }

  // ===== ACCESSIBILITY ENHANCEMENTS =====
  setupAccessibility() {
    // Announce dynamic content changes
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'visually-hidden';
    document.body.appendChild(this.announcer);

    // Focus management
    this.setupFocusManagement();
  }

  setupFocusManagement() {
    // Return focus to search input after weather display
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('weather-display') && 
            mutation.target.classList.contains('show')) {
          // Announce weather data loaded
          this.announce('Weather data loaded successfully');
        }
      });
    });

    const weatherDisplay = document.getElementById('weatherDisplay');
    if (weatherDisplay) {
      observer.observe(weatherDisplay, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
    }
  }

  announce(message) {
    if (this.announcer) {
      this.announcer.textContent = message;
    }
  }

  // ===== SEARCH HANDLING =====
  async handleSearch() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput?.value?.trim();
    
    if (!city) {
      this.showError('Please enter a city name');
      cityInput?.focus();
      return;
    }

    if (CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
      this.showError('Please add your OpenWeatherMap API key to use this application. Get your free key at https://openweathermap.org/api');
      return;
    }

    await this.fetchWeather(city);
  }

  validateInput() {
    const cityInput = document.getElementById('cityInput');
    const value = cityInput?.value?.trim();
    
    // Basic validation
    if (value && value.length < 2) {
      cityInput.setCustomValidity('City name must be at least 2 characters');
    } else {
      cityInput.setCustomValidity('');
    }
  }

  // ===== API INTEGRATION =====
  async fetchWeather(city, forceRefresh = false) {
    if (this.isLoading) return;
    
    const cacheKey = city.toLowerCase();
    const cached = this.cache.get(cacheKey);
    
    // Use cache if available and not expired (unless force refresh)
    if (!forceRefresh && cached && (Date.now() - cached.timestamp < CONFIG.CACHE_DURATION)) {
      this.displayWeather(cached.data);
      return;
    }

    try {
      this.setLoadingState(true);
      this.hideError();
      this.hideWeatherDisplay();

      const response = await this.makeAPIRequest(city);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(this.getErrorMessage(response.status, data));
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      this.displayWeather(data);
      this.addToRecentSearches(city);
      this.currentCity = city;
      
    } catch (error) {
      console.error('Weather fetch error:', error);
      this.showError(error.message);
      this.announce('Failed to load weather data');
    } finally {
      this.setLoadingState(false);
    }
  }

  async makeAPIRequest(city) {
    const url = `${CONFIG.API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${CONFIG.API_KEY}&units=metric`;
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 seconds
    });
  }

  getErrorMessage(status, data) {
    const errorMessages = {
      400: 'Invalid city name. Please check the spelling and try again.',
      401: 'Invalid API key. Please check your OpenWeatherMap API key.',
      404: 'City not found. Please check the spelling and try again.',
      429: 'Too many requests. Please wait a moment and try again.',
      500: 'Weather service temporarily unavailable. Please try again later.',
      502: 'Weather service temporarily unavailable. Please try again later.',
      503: 'Weather service temporarily unavailable. Please try again later.',
    };

    return errorMessages[status] || data?.message || 'Unable to fetch weather data. Please try again later.';
  }

  // ===== UI UPDATES =====
  displayWeather(data) {
    try {
      // Update basic info
      this.updateElement('cityName', `${data.name}, ${data.sys.country}`);
      this.updateElement('temperature', `${Math.round(data.main.temp)}°C`);
      this.updateElement('feelsLike', `${Math.round(data.main.feels_like)}°C`);
      this.updateElement('description', this.capitalizeWords(data.weather[0].description));
      this.updateElement('humidity', `${data.main.humidity}%`);

      // Update additional details
      this.updateElement('visibility', `${(data.visibility / 1000).toFixed(1)} km`);
      this.updateElement('windSpeed', `${(data.wind?.speed * 3.6 || 0).toFixed(1)} km/h`);
      this.updateElement('pressure', `${data.main.pressure} hPa`);

      // Update weather icon
      const iconCode = data.weather[0].icon;
      const weatherIcon = document.getElementById('weatherIcon');
      if (weatherIcon) {
        weatherIcon.textContent = WEATHER_ICONS[iconCode] || '🌤️';
      }

      // Update timestamp
      this.updateElement('lastUpdated', `Last updated: ${new Date().toLocaleTimeString()}`);

      // Show weather display
      this.showWeatherDisplay();
      
      // Update page title
      document.title = `${data.name} Weather - ${Math.round(data.main.temp)}°C`;
      
      this.announce(`Weather loaded for ${data.name}: ${Math.round(data.main.temp)} degrees Celsius, ${data.weather[0].description}`);
      
    } catch (error) {
      console.error('Display error:', error);
      this.showError('Error displaying weather data');
    }
  }

  updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = content;
    }
  }

  capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }

  // ===== STATE MANAGEMENT =====
  setLoadingState(isLoading) {
    this.isLoading = isLoading;
    const loading = document.getElementById('loading');
    const searchBtn = document.getElementById('searchBtn');
    
    if (loading) {
      loading.classList.toggle('show', isLoading);
    }
    
    if (searchBtn) {
      searchBtn.disabled = isLoading;
      const btnText = searchBtn.querySelector('.btn-text');
      if (btnText) {
        btnText.textContent = isLoading ? 'Loading...' : 'Get Weather';
      }
    }
  }

  showWeatherDisplay() {
    const weatherDisplay = document.getElementById('weatherDisplay');
    if (weatherDisplay) {
      weatherDisplay.classList.add('show');
      // Scroll to weather display on mobile
      if (window.innerWidth <= 768) {
        weatherDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  hideWeatherDisplay() {
    const weatherDisplay = document.getElementById('weatherDisplay');
    if (weatherDisplay) {
      weatherDisplay.classList.remove('show');
    }
  }

  showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
      
      // Auto-hide error after 5 seconds
      setTimeout(() => this.hideError(), 5000);
    }
    
    this.announce(`Error: ${message}`);
  }

  hideError() {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
      errorElement.classList.remove('show');
    }
  }

  // ===== RECENT SEARCHES =====
  addToRecentSearches(city) {
    const searches = this.recentSearches;
    const cityLower = city.toLowerCase();
    
    // Remove if already exists
    const index = searches.findIndex(s => s.toLowerCase() === cityLower);
    if (index > -1) {
      searches.splice(index, 1);
    }
    
    // Add to beginning
    searches.unshift(city);
    
    // Keep only max number of searches
    if (searches.length > CONFIG.MAX_RECENT_SEARCHES) {
      searches.splice(CONFIG.MAX_RECENT_SEARCHES);
    }
    
    this.saveRecentSearches();
  }

  loadRecentSearches() {
    try {
      return JSON.parse(localStorage.getItem('weatherApp_recentSearches') || '[]');
    } catch {
      return [];
    }
  }

  saveRecentSearches() {
    try {
      localStorage.setItem('weatherApp_recentSearches', JSON.stringify(this.recentSearches));
    } catch (error) {
      console.warn('Could not save recent searches:', error);
    }
  }

  // ===== SHARING FUNCTIONALITY =====
  async shareWeatherData() {
    if (!this.currentCity) {
      this.showError('No weather data to share');
      return;
    }

    const cityName = document.getElementById('cityName')?.textContent || this.currentCity;
    const temperature = document.getElementById('temperature')?.textContent || '';
    const description = document.getElementById('description')?.textContent || '';
    
    const shareText = `Weather in ${cityName}: ${temperature}, ${description}`;
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: 'Weather Dashboard',
          text: shareText,
          url: shareUrl
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        this.showTemporaryMessage('Weather data copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        this.showTemporaryMessage('Weather data copied to clipboard!');
      } catch (clipboardError) {
        this.showError('Unable to share weather data');
      }
    }
  }

  showTemporaryMessage(message) {
    const tempElement = document.createElement('div');
    tempElement.className = 'temp-message';
    tempElement.textContent = message;
    tempElement.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--success-gradient);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      z-index: 1000;
      font-weight: 500;
      box-shadow: var(--shadow-medium);
      animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(tempElement);
    
    setTimeout(() => {
      tempElement.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        document.body.removeChild(tempElement);
      }, 300);
    }, 3000);
  }

  // ===== DEMO FUNCTIONALITY =====
  showDemo() {
    const demoData = {
      name: 'Demo City',
      sys: { country: 'DC' },
      main: {
        temp: 22,
        feels_like: 24,
        humidity: 65,
        pressure: 1013
      },
      weather: [{
        description: 'partly cloudy',
        icon: '02d'
      }],
      visibility: 10000,
      wind: { speed: 3.5 }
    };
    
    this.displayWeather(demoData);
    this.showError('This is demo data. Add your API key to get real weather data.');
  }

  showWelcomeMessage() {
    // Add subtle welcome animation
    const container = document.querySelector('.container');
    if (container) {
      container.style.opacity = '0';
      container.style.animation = 'fadeIn 0.8s ease-out forwards';
    }
  }

  // ===== UTILITY METHODS =====
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// ===== POPULAR CITIES AUTO-UPDATE =====
const POPULAR_CITIES_ROTATION = [
  ['London', 'New York', 'Tokyo', 'Paris'],
  ['Sydney', 'Berlin', 'Moscow', 'Toronto'],
  ['Mumbai', 'Beijing', 'Dubai', 'Rome'],
  ['Los Angeles', 'Madrid', 'Istanbul', 'Singapore']
];
let popularCitiesIndex = 0;

function updatePopularCitiesButtons() {
  const container = document.querySelector('.quick-search-buttons');
  if (!container) return;
  // Rotate to next set
  popularCitiesIndex = (popularCitiesIndex + 1) % POPULAR_CITIES_ROTATION.length;
  const cities = POPULAR_CITIES_ROTATION[popularCitiesIndex];
  container.innerHTML = cities.map(city =>
    `<button type="button" class="quick-btn" data-city="${city}">${city}</button>`
  ).join('');
  // Re-attach event listeners
  const cityInput = document.getElementById('cityInput');
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const city = e.target.dataset.city;
      if (city) {
        cityInput.value = city;
        if (window.weatherAppInstance && typeof window.weatherAppInstance.handleSearch === 'function') {
          window.weatherAppInstance.handleSearch();
        }
      }
    });
  });
}

setInterval(updatePopularCitiesButtons, 60 * 60 * 1000); // Every hour
// Initial call to ensure correct state after reload
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(updatePopularCitiesButtons, 1000); // Delay to allow initial render
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Preload critical resources
const preloadResources = () => {
  // Preconnect to API domain
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = '//api.openweathermap.org';
  document.head.appendChild(link);
};

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  preloadResources();
  window.weatherAppInstance = new WeatherApp();
});

// ===== SERVICE WORKER REGISTRATION (Optional) =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment if you have a service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered'))
    //   .catch(registrationError => console.log('SW registration failed'));
  });
}