export type Language = 'en' | 'hi' | 'kn';

export interface Translations {
  appTitle: string;
  searchPlaceholder: string;
  currentWeather: string;
  forecast: string;
  airQuality: string;
  temperature: string;
  feelsLike: string;
  humidity: string;
  pressure: string;
  windSpeed: string;
  visibility: string;
  sunrise: string;
  sunset: string;
  airQualityIndex: string;
  pm25: string;
  pm10: string;
  co: string;
  no2: string;
  o3: string;
  so2: string;
  loading: string;
  error: string;
  searchError: string;
  noResults: string;
  today: string;
  tomorrow: string;
  dayNames: string[];
  monthNames: string[];
  aqiLevels: string[];
  voiceSearch: {
    start: string;
    stop: string;
    listening: string;
    speakCity: string;
  };
  location: {
    detecting: string;
    detected: string;
    denied: string;
    error: string;
    useDefault: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'Professional Weather Dashboard',
    searchPlaceholder: 'Search for a city...',
    currentWeather: 'Current Weather',
    forecast: '5-Day Forecast',
    airQuality: 'Air Quality',
    temperature: 'Temperature',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    pressure: 'Pressure',
    windSpeed: 'Wind Speed',
    visibility: 'Visibility',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    airQualityIndex: 'Air Quality Index',
    pm25: 'PM2.5',
    pm10: 'PM10',
    co: 'CO',
    no2: 'NO₂',
    o3: 'O₃',
    so2: 'SO₂',
    loading: 'Loading...',
    error: 'Error loading weather data',
    searchError: 'Error searching cities',
    noResults: 'No cities found',
    today: 'Today',
    tomorrow: 'Tomorrow',
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    aqiLevels: ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'],
    voiceSearch: {
      start: 'Start voice search',
      stop: 'Stop voice search',
      listening: 'Listening...',
      speakCity: 'Speak the city name',
    },
    location: {
      detecting: 'Detecting your location...',
      detected: 'Location detected',
      denied: 'Location access denied',
      error: 'Unable to detect location',
      useDefault: 'Using default location',
    },
  },
  hi: {
    appTitle: 'पेशेवर मौसम डैशबोर्ड',
    searchPlaceholder: 'शहर खोजें...',
    currentWeather: 'वर्तमान मौसम',
    forecast: '5-दिन का पूर्वानुमान',
    airQuality: 'वायु गुणवत्ता',
    temperature: 'तापमान',
    feelsLike: 'महसूस होता है',
    humidity: 'आर्द्रता',
    pressure: 'दबाव',
    windSpeed: 'हवा की गति',
    visibility: 'दृश्यता',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    airQualityIndex: 'वायु गुणवत्ता सूचकांक',
    pm25: 'PM2.5',
    pm10: 'PM10',
    co: 'CO',
    no2: 'NO₂',
    o3: 'O₃',
    so2: 'SO₂',
    loading: 'लोड हो रहा है...',
    error: 'मौसम डेटा लोड करने में त्रुटि',
    searchError: 'शहर खोजने में त्रुटि',
    noResults: 'कोई शहर नहीं मिला',
    today: 'आज',
    tomorrow: 'कल',
    dayNames: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
    monthNames: ['जन', 'फर', 'मार', 'अप्र', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्ट', 'नव', 'दिस'],
    aqiLevels: ['अच्छा', 'संतोषजनक', 'मध्यम', 'खराब', 'बहुत खराब'],
    voiceSearch: {
      start: 'आवाज खोज शुरू करें',
      stop: 'आवाज खोज बंद करें',
      listening: 'सुन रहा है...',
      speakCity: 'शहर का नाम बोलें',
    },
    location: {
      detecting: 'आपका स्थान खोजा जा रहा है...',
      detected: 'स्थान मिल गया',
      denied: 'स्थान पहुंच अस्वीकृत',
      error: 'स्थान खोजने में असमर्थ',
      useDefault: 'डिफ़ॉल्ट स्थान का उपयोग',
    },
  },
  kn: {
    appTitle: 'ವೃತ್ತಿಪರ ಹವಾಮಾನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    searchPlaceholder: 'ನಗರವನ್ನು ಹುಡುಕಿ...',
    currentWeather: 'ಪ್ರಸ್ತುತ ಹವಾಮಾನ',
    forecast: '5-ದಿನದ ಮುನ್ನೋಟ',
    airQuality: 'ವಾಯು ಗುಣಮಟ್ಟ',
    temperature: 'ತಾಪಮಾನ',
    feelsLike: 'ಅನುಭವವಾಗುತ್ತದೆ',
    humidity: 'ತೇವಾಂಶ',
    pressure: 'ಒತ್ತಡ',
    windSpeed: 'ಗಾಳಿಯ ವೇಗ',
    visibility: 'ಗೋಚರತೆ',
    sunrise: 'ಸೂರ್ಯೋದಯ',
    sunset: 'ಸೂರ್ಯಾಸ್ತ',
    airQualityIndex: 'ವಾಯು ಗುಣಮಟ್ಟದ ಸೂಚ್ಯಂಕ',
    pm25: 'PM2.5',
    pm10: 'PM10',
    co: 'CO',
    no2: 'NO₂',
    o3: 'O₃',
    so2: 'SO₂',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    error: 'ಹವಾಮಾನ ಡೇಟಾ ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ದೋಷ',
    searchError: 'ನಗರಗಳನ್ನು ಹುಡುಕುವಲ್ಲಿ ದೋಷ',
    noResults: 'ಯಾವುದೇ ನಗರಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    today: 'ಇಂದು',
    tomorrow: 'ನಾಲೆ',
    dayNames: ['ಭಾನುವಾರ', 'ಸೋಮವಾರ', 'ಮಂಗಳವಾರ', 'ಬುಧವಾರ', 'ಗುರುವಾರ', 'ಶುಕ್ರವಾರ', 'ಶನಿವಾರ'],
    monthNames: ['ಜನ', 'ಫೆಬ್', 'ಮಾರ್', 'ಏಪ್ರ', 'ಮೇ', 'ಜೂನ್', 'ಜುಲೈ', 'ಆಗ', 'ಸೆಪ್ಟ', 'ಅಕ್ಟೋ', 'ನವೆಂ', 'ಡಿಸೆಂ'],
    aqiLevels: ['ಉತ್ತಮ', 'ಸಮತೋಲಿತ', 'ಮಧ್ಯಮ', 'ಕೆಟ್ಟ', 'ಅತ್ಯಂತ ಕೆಟ್ಟ'],
    voiceSearch: {
      start: 'ಧ್ವನಿ ಹುಡುಕಾಟ ಪ್ರಾರಂಭಿಸಿ',
      stop: 'ಧ್ವನಿ ಹುಡುಕಾಟ ನಿಲ್ಲಿಸಿ',
      listening: 'ಕೇಳುತ್ತಿದೆ...',
      speakCity: 'ನಗರದ ಹೆಸರನ್ನು ಹೇಳಿ',
    },
    location: {
      detecting: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ...',
      detected: 'ಸ್ಥಳ ಪತ್ತೆಯಾಗಿದೆ',
      denied: 'ಸ್ಥಳ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ',
      error: 'ಸ್ಥಳ ಪತ್ತೆ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ',
      useDefault: 'ಡಿಫಾಲ್ಟ್ ಸ್ಥಳವನ್ನು ಬಳಸಲಾಗುತ್ತಿದೆ',
    },
  }
};