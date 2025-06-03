import { ApiClient } from '../core/ApiClient.js';
class WeatherService {
    constructor() {
        this.apiClient = new ApiClient();
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.apiKey = 'YOUR_API_KEY';
    }

    async getWeatherByCity(city) {
        const url = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`;
        return await this.apiClient.get(url);
    }

    async getWeatherByCoords(lat, lon) {
        const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
        return await this.apiClient.get(url);
    }
}

export {WeatherService}