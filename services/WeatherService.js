import { ApiClient } from '../core/ApiClient.js';

class WeatherService {
    constructor() {
        this.apiClient = new ApiClient();
        this.baseWeatherUrl = 'https://api.open-meteo.com/v1';
        this.baseGeocodingUrl = 'https://geocoding-api.open-meteo.com/v1';
    }

    async getWeatherByCoords(lat, lon) {
        const url = `${this.baseWeatherUrl}/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
        const weatherData = await this.apiClient.get(url);

        if (!weatherData || !weatherData.daily) {
            throw new Error('Dados do clima não disponíveis.');
        }

        return weatherData;
    }

    async getWeatherByCity(city) {
        const geocodingUrl = `${this.baseGeocodingUrl}/search?name=${encodeURIComponent(city)}&count=1`;
        const geocodingData = await this.apiClient.get(geocodingUrl);

        console.log('Geocoding Data:', geocodingData); // Verifique os dados retornados

        if (geocodingData.results && geocodingData.results.length > 0) {
            const { latitude, longitude, name } = geocodingData.results[0]; // Use apenas propriedades disponíveis
            console.log(`Cidade encontrada: ${name}, Latitude: ${latitude}, Longitude: ${longitude}`);
            return this.getWeatherByCoords(latitude, longitude);
        } else {
            throw new Error(`Cidade "${city}" não encontrada.`);
        }
    }
}

function renderWeatherData(weatherData) {
    if (!weatherData || !weatherData.daily) {
        document.getElementById('weather-container').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Erro: Dados do clima não disponíveis.</p>
            </div>
        `;
        return;
    }

    const { temperature_2m_max, temperature_2m_min } = weatherData.daily;
    document.getElementById('weather-container').innerHTML = `
        <div class="weather-card">
            <h2>Clima Atual</h2>
            <p>Máxima: ${temperature_2m_max[0]}°C</p>
            <p>Mínima: ${temperature_2m_min[0]}°C</p>
        </div>
    `;
}

const weatherService = new WeatherService();

async function fetchWeatherDetails() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) {
        alert('Por favor, insira o nome de uma cidade.');
        return;
    }

    try {
        const weatherData = await weatherService.getWeatherByCity(city);
        renderWeatherData(weatherData);
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        document.getElementById('weather-container').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${error.message}</p>
            </div>
        `;
    }
}

export { WeatherService };