import { NepalCity, CityWeatherData, CurrentWeather, HourlyForecastItem, DailyForecastItem } from '../types';

export const NEPAL_MAJOR_CITIES: NepalCity[] = [
  {
    id: 'kathmandu',
    nameNe: 'काठमाडौं',
    nameEn: 'Kathmandu',
    provinceNe: 'बागमती प्रदेश',
    provinceEn: 'Bagmati Province',
    latitude: 27.7172,
    longitude: 85.3240,
    elevation: 1400,
    isCapital: true,
    isPopular: true,
    region: 'pahad',
  },
  {
    id: 'pokhara',
    nameNe: 'पोखरा',
    nameEn: 'Pokhara',
    provinceNe: 'गण्डकी प्रदेश',
    provinceEn: 'Gandaki Province',
    latitude: 28.2096,
    longitude: 83.9856,
    elevation: 822,
    isPopular: true,
    region: 'pahad',
  },
  {
    id: 'lalitpur',
    nameNe: 'ललितपुर (पाटन)',
    nameEn: 'Lalitpur (Patan)',
    provinceNe: 'बागमती प्रदेश',
    provinceEn: 'Bagmati Province',
    latitude: 27.6710,
    longitude: 85.3262,
    elevation: 1400,
    isPopular: true,
    region: 'pahad',
  },
  {
    id: 'bhaktapur',
    nameNe: 'भक्तपुर',
    nameEn: 'Bhaktapur',
    provinceNe: 'बागमती प्रदेश',
    provinceEn: 'Bagmati Province',
    latitude: 27.6710,
    longitude: 85.4298,
    elevation: 1401,
    region: 'pahad',
  },
  {
    id: 'biratnagar',
    nameNe: 'विराटनगर',
    nameEn: 'Biratnagar',
    provinceNe: 'कोशी प्रदेश',
    provinceEn: 'Koshi Province',
    latitude: 26.4525,
    longitude: 87.2718,
    elevation: 80,
    isPopular: true,
    region: 'terai',
  },
  {
    id: 'birgunj',
    nameNe: 'वीरगञ्ज',
    nameEn: 'Birgunj',
    provinceNe: 'मधेश प्रदेश',
    provinceEn: 'Madhesh Province',
    latitude: 27.0137,
    longitude: 84.8773,
    elevation: 91,
    isPopular: true,
    region: 'terai',
  },
  {
    id: 'bharatpur',
    nameNe: 'भरतपुर (चितवन)',
    nameEn: 'Bharatpur (Chitwan)',
    provinceNe: 'बागमती प्रदेश',
    provinceEn: 'Bagmati Province',
    latitude: 27.6833,
    longitude: 84.4333,
    elevation: 208,
    isPopular: true,
    region: 'terai',
  },
  {
    id: 'janakpur',
    nameNe: 'जनकपुरधाम',
    nameEn: 'Janakpurdham',
    provinceNe: 'मधेश प्रदेश',
    provinceEn: 'Madhesh Province',
    latitude: 26.7288,
    longitude: 85.9244,
    elevation: 70,
    isPopular: true,
    region: 'terai',
  },
  {
    id: 'butwal',
    nameNe: 'बुटवल',
    nameEn: 'Butwal',
    provinceNe: 'लुम्बिनी प्रदेश',
    provinceEn: 'Lumbini Province',
    latitude: 27.7006,
    longitude: 83.4484,
    elevation: 256,
    isPopular: true,
    region: 'terai',
  },
  {
    id: 'dharan',
    nameNe: 'धरान',
    nameEn: 'Dharan',
    provinceNe: 'कोशी प्रदेश',
    provinceEn: 'Koshi Province',
    latitude: 26.8124,
    longitude: 87.2834,
    elevation: 349,
    region: 'pahad',
  },
  {
    id: 'nepalgunj',
    nameNe: 'नेपालगञ्ज',
    nameEn: 'Nepalgunj',
    provinceNe: 'लुम्बिनी प्रदेश',
    provinceEn: 'Lumbini Province',
    latitude: 28.0500,
    longitude: 81.6167,
    elevation: 150,
    region: 'terai',
  },
  {
    id: 'dhangadhi',
    nameNe: 'धनगढी',
    nameEn: 'Dhangadhi',
    provinceNe: 'सुदूरपश्चिम प्रदेश',
    provinceEn: 'Sudurpashchim Province',
    latitude: 28.6944,
    longitude: 80.5989,
    elevation: 109,
    region: 'terai',
  },
  {
    id: 'birendranagar',
    nameNe: 'वीरेन्द्रनगर (सुर्खेत)',
    nameEn: 'Birendranagar (Surkhet)',
    provinceNe: 'कर्णाली प्रदेश',
    provinceEn: 'Karnali Province',
    latitude: 28.6019,
    longitude: 81.6339,
    elevation: 665,
    region: 'pahad',
  },
  {
    id: 'hetauda',
    nameNe: 'हेटौंडा',
    nameEn: 'Hetauda',
    provinceNe: 'बागमती प्रदेश',
    provinceEn: 'Bagmati Province',
    latitude: 27.4289,
    longitude: 85.0331,
    elevation: 450,
    region: 'pahad',
  },
  {
    id: 'namche',
    nameNe: 'नाम्चे बजार (सगरमाथा)',
    nameEn: 'Namche Bazaar (Everest)',
    provinceNe: 'कोशी प्रदेश (सोलुखुम्बु)',
    provinceEn: 'Koshi Province (Solukhumbu)',
    latitude: 27.8069,
    longitude: 86.7140,
    elevation: 3440,
    isPopular: true,
    region: 'himal',
  },
  {
    id: 'jomsom',
    nameNe: 'जोमसोम (मुस्ताङ)',
    nameEn: 'Jomsom (Mustang)',
    provinceNe: 'गण्डकी प्रदेश (मुस्ताङ)',
    provinceEn: 'Gandaki Province (Mustang)',
    latitude: 28.7844,
    longitude: 83.7431,
    elevation: 2743,
    isPopular: true,
    region: 'himal',
  },
  {
    id: 'ilam',
    nameNe: 'इलाम (चियाबारी)',
    nameEn: 'Ilam (Tea Hills)',
    provinceNe: 'कोशी प्रदेश',
    provinceEn: 'Koshi Province',
    latitude: 26.9110,
    longitude: 87.9267,
    elevation: 1208,
    region: 'pahad',
  },
];

export interface WeatherConditionMeta {
  labelNe: string;
  labelEn: string;
  category: 'clear' | 'partlyCloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  iconType: string;
}

/**
 * Maps WMO Weather interpretation codes (WW) to human readable descriptions
 */
export function getWeatherCondition(code: number, isDay = true): WeatherConditionMeta {
  switch (code) {
    case 0:
      return {
        labelNe: isDay ? 'सफा घाम लागेको' : 'सफा रात',
        labelEn: isDay ? 'Clear Sky' : 'Clear Night',
        category: 'clear',
        iconType: isDay ? 'sun' : 'moon',
      };
    case 1:
      return {
        labelNe: 'सामान्यतया सफा',
        labelEn: 'Mainly Clear',
        category: 'clear',
        iconType: isDay ? 'sun-cloud' : 'moon-cloud',
      };
    case 2:
      return {
        labelNe: 'आंशिक बदली',
        labelEn: 'Partly Cloudy',
        category: 'partlyCloudy',
        iconType: isDay ? 'sun-cloud' : 'moon-cloud',
      };
    case 3:
      return {
        labelNe: 'बादल लागेको (ओभरकास्ट)',
        labelEn: 'Overcast',
        category: 'cloudy',
        iconType: 'cloud',
      };
    case 45:
    case 48:
      return {
        labelNe: 'हुस्सु तथा कुहिरो',
        labelEn: 'Fog & Mist',
        category: 'fog',
        iconType: 'fog',
      };
    case 51:
    case 53:
    case 55:
      return {
        labelNe: 'सिमसिम पानी / झरी',
        labelEn: 'Light Drizzle',
        category: 'drizzle',
        iconType: 'drizzle',
      };
    case 61:
      return {
        labelNe: 'हल्का वर्षा',
        labelEn: 'Slight Rain',
        category: 'rain',
        iconType: 'rain',
      };
    case 63:
      return {
        labelNe: 'मध्यम वर्षा',
        labelEn: 'Moderate Rain',
        category: 'rain',
        iconType: 'rain',
      };
    case 65:
      return {
        labelNe: 'भारी वर्षा',
        labelEn: 'Heavy Rain',
        category: 'rain',
        iconType: 'heavy-rain',
      };
    case 66:
    case 67:
      return {
        labelNe: 'हिउँदे वर्षा (फ्रीजिङ रेन)',
        labelEn: 'Freezing Rain',
        category: 'rain',
        iconType: 'snow-rain',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        labelNe: 'हिमपात',
        labelEn: 'Snowfall',
        category: 'snow',
        iconType: 'snow',
      };
    case 80:
    case 81:
    case 82:
      return {
        labelNe: 'क्षणिक मुसलधारे वर्षा',
        labelEn: 'Rain Showers',
        category: 'rain',
        iconType: 'heavy-rain',
      };
    case 85:
    case 86:
      return {
        labelNe: 'हिम झरी',
        labelEn: 'Snow Showers',
        category: 'snow',
        iconType: 'snow',
      };
    case 95:
      return {
        labelNe: 'चट्याङ र मेघगर्जनसहित वर्षा',
        labelEn: 'Thunderstorm',
        category: 'thunderstorm',
        iconType: 'thunderstorm',
      };
    case 96:
    case 99:
      return {
        labelNe: 'असिना र चट्याङसहित भारी वर्षा',
        labelEn: 'Thunderstorm with Hail',
        category: 'thunderstorm',
        iconType: 'thunderstorm-hail',
      };
    default:
      return {
        labelNe: 'सामान्य मौसम',
        labelEn: 'Fair Weather',
        category: 'clear',
        iconType: 'sun',
      };
  }
}

/**
 * Fetch live weather from free Open-Meteo API
 */
export async function fetchCityWeather(city: NepalCity): Promise<CityWeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset&timezone=Asia%2FKathmandu&forecast_days=7`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`);
  }

  const data = await response.json();

  const current: CurrentWeather = {
    temperature: Math.round(data.current?.temperature_2m ?? 22),
    apparentTemperature: Math.round(data.current?.apparent_temperature ?? 22),
    humidity: Math.round(data.current?.relative_humidity_2m ?? 60),
    precipitation: data.current?.precipitation ?? 0,
    weatherCode: data.current?.weather_code ?? 0,
    windSpeed: Math.round(data.current?.wind_speed_10m ?? 8),
    windDirection: Math.round(data.current?.wind_direction_10m ?? 180),
    pressure: Math.round(data.current?.surface_pressure ?? 1013),
    isDay: data.current?.is_day === 1,
    time: data.current?.time ?? new Date().toISOString(),
  };

  // Extract next 24 hours
  const hourly: HourlyForecastItem[] = [];
  if (data.hourly?.time && Array.isArray(data.hourly.time)) {
    const nowHourStr = new Date().toISOString().slice(0, 13);
    const startIndex = data.hourly.time.findIndex((t: string) => t.startsWith(nowHourStr));
    const start = startIndex >= 0 ? startIndex : 0;
    
    for (let i = start; i < Math.min(start + 24, data.hourly.time.length); i++) {
      hourly.push({
        time: data.hourly.time[i],
        temperature: Math.round(data.hourly.temperature_2m[i] ?? current.temperature),
        precipitationProbability: data.hourly.precipitation_probability ? (data.hourly.precipitation_probability[i] ?? 0) : 0,
        weatherCode: data.hourly.weather_code ? (data.hourly.weather_code[i] ?? current.weatherCode) : 0,
      });
    }
  }

  // Extract 7 days daily forecast
  const daily: DailyForecastItem[] = [];
  if (data.daily?.time && Array.isArray(data.daily.time)) {
    for (let i = 0; i < data.daily.time.length; i++) {
      daily.push({
        date: data.daily.time[i],
        weatherCode: data.daily.weather_code?.[i] ?? 0,
        tempMax: Math.round(data.daily.temperature_2m_max?.[i] ?? 25),
        tempMin: Math.round(data.daily.temperature_2m_min?.[i] ?? 15),
        precipitationProbability: data.daily.precipitation_probability_max?.[i] ?? 10,
        uvIndexMax: Math.round(data.daily.uv_index_max?.[i] ?? 6),
        sunrise: data.daily.sunrise?.[i]?.slice(11, 16) ?? '05:45',
        sunset: data.daily.sunset?.[i]?.slice(11, 16) ?? '18:20',
      });
    }
  }

  return {
    city,
    current,
    hourly,
    daily,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Fallback data in case of offline/network failure
 */
export function getFallbackWeatherData(city: NepalCity): CityWeatherData {
  const baseTemp = city.region === 'himal' ? 8 : city.region === 'pahad' ? 24 : 31;
  const now = new Date();
  
  const current: CurrentWeather = {
    temperature: baseTemp,
    apparentTemperature: baseTemp + 1,
    humidity: city.region === 'terai' ? 75 : 60,
    precipitation: 0,
    weatherCode: 1,
    windSpeed: 10,
    windDirection: 140,
    pressure: city.region === 'himal' ? 720 : 1010,
    isDay: now.getHours() >= 6 && now.getHours() < 19,
    time: now.toISOString(),
  };

  const hourly: HourlyForecastItem[] = [];
  for (let i = 0; i < 24; i++) {
    const hTime = new Date(now.getTime() + i * 3600000);
    const hour = hTime.getHours();
    const tempDelta = Math.sin((hour - 8) / 12 * Math.PI) * 5;
    hourly.push({
      time: hTime.toISOString(),
      temperature: Math.round(baseTemp + tempDelta),
      precipitationProbability: 15,
      weatherCode: 1,
    });
  }

  const daily: DailyForecastItem[] = [];
  for (let i = 0; i < 7; i++) {
    const dTime = new Date(now.getTime() + i * 86400000);
    daily.push({
      date: dTime.toISOString().slice(0, 10),
      weatherCode: i % 3 === 0 ? 2 : 1,
      tempMax: baseTemp + 4,
      tempMin: baseTemp - 5,
      precipitationProbability: 20,
      uvIndexMax: city.region === 'himal' ? 8 : 6,
      sunrise: '05:52',
      sunset: '18:15',
    });
  }

  return {
    city,
    current,
    hourly,
    daily,
    lastUpdated: now.toISOString(),
  };
}
