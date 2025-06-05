import { ApiClient } from '../core/ApiClient.js';

const BASE_URL = 'http://api.weatherapi.com/v1';
const API_KEY = '98e5b4aeeae74a8bb39184134250406';

class WeatherService {
    constructor() {
        this.apiClient = new ApiClient();
    }

    async getWeatherByCoords(lat, lon) {
        const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&lang=pt`;
        const weatherData = await this.apiClient.get(url);

        if (!weatherData || !weatherData.current) {
            throw new Error('Dados do clima não disponíveis.');
        }

        return this.formatWeatherData(weatherData);
    }

    async getWeatherByCity(city) {
        const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&lang=pt`;
        const weatherData = await this.apiClient.get(url);

        if (!weatherData || !weatherData.current) {
            throw new Error(`Cidade "${city}" não encontrada.`);
        }

        return this.formatWeatherData(weatherData);
    }

    async getForecast(city, days = 3) {
        const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=${days}&lang=pt`;
        const forecastData = await this.apiClient.get(url);

        if (!forecastData || !forecastData.forecast) {
            throw new Error('Dados de previsão não disponíveis.');
        }

        return forecastData;
    }

    async searchCities(query) {
        const url = `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`;
        const citiesData = await this.apiClient.get(url);

        if (!Array.isArray(citiesData)) {
            throw new Error('Erro ao buscar cidades.');
        }

        return citiesData;
    }

    formatWeatherData(data) {
        let icon = '';
        if (data.current && data.current.condition && data.current.condition.icon) {
            icon = data.current.condition.icon.startsWith('//')
                ? 'https:' + data.current.condition.icon
                : data.current.condition.icon;
        } else {
            // Ícone padrão caso não venha da API
            icon = 'https://cdn.weatherapi.com/weather/64x64/day/113.png';
        }

        return {
            city: data.location.name,
            country: data.location.country,
            temp_c: data.current.temp_c,
            temp_f: data.current.temp_f,
            feelslike_c: data.current.feelslike_c,
            feelslike_f: data.current.feelslike_f,
            humidity: data.current.humidity,
            wind_kph: data.current.wind_kph,
            wind_mph: data.current.wind_mph,
            wind_dir: data.current.wind_dir,
            uv: data.current.uv,
            condition: data.current.condition.text,
            icon: icon,
            last_updated: data.current.last_updated
        };
    }
}

async function getWeather(city) {
    const weatherService = new WeatherService();
    return await weatherService.getWeatherByCity(city);
}

export { WeatherService, getWeather };