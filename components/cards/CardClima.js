import { WeatherService } from '../../services/WeatherService.js';
import { Dashboard } from '../Dashboard.js';

export class CardClima extends HTMLElement {
    constructor() {
        super();
        this.weatherService = new WeatherService();
        this.city = 'São Paulo'; // Cidade padrão
    }

    connectedCallback() {
        this.renderForm();
        this.fetchAndRenderWeather(this.city);
    }

    async fetchAndRenderWeather(city) {
        try {
            const weatherData = await this.weatherService.getWeatherByCity(city);
            this.renderWeather(weatherData);
        } catch (error) {
            this.renderError(error.message);
        }
    }

    renderForm() {
        this.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <form id="weather-form" class="mb-3">
                        <div class="input-group">
                            <input type="text" class="form-control" id="city-input" placeholder="Digite a cidade" value="${this.city}">
                            <button class="btn btn-primary" type="submit">Buscar</button>
                        </div>
                    </form>
                    <div id="weather-result"></div>
                </div>
            </div>
        `;

        this.querySelector('#weather-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const city = this.querySelector('#city-input').value.trim();
            if (city) {
                this.city = city;
                this.fetchAndRenderWeather(city);
            }
        });
    }

    renderWeather(weatherData) {
        this.querySelector('#weather-result').innerHTML = `
            <h5 class="card-title">
                <i class="fas fa-cloud"></i> Clima em ${weatherData.city}
            </h5>
            <div class="text-center mb-3">
                <img src="${weatherData.icon}" alt="${weatherData.condition}" class="weather-icon">
                <h2 class="display-4">${weatherData.temp_c}°C</h2>
                <p class="condition">${weatherData.condition}</p>
            </div>
            <div class="weather-details">
                <p><i class="fas fa-thermometer-half"></i> Sensação: ${weatherData.feelslike_c}°C</p>
                <p><i class="fas fa-tint"></i> Umidade: ${weatherData.humidity}%</p>
                <p><i class="fas fa-wind"></i> Vento: ${weatherData.wind_kph} km/h ${weatherData.wind_dir}</p>
            </div>
        `;
    }

    renderError(message) {
        this.querySelector('#weather-result').innerHTML = `
            <div class="error-message text-center">
                <i class="fas fa-exclamation-circle text-danger"></i>
                <p class="text-danger">${message}</p>
            </div>
        `;
    }
}

customElements.define('card-clima', CardClima);