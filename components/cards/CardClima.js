import { WeatherService } from "../../services/WeatherService.js";
import { Dashboard } from "../Dashboard.js";

class CardClima {
    constructor() {
        this.weatherService = new WeatherService();
    }

    render(container) {
        const html = `
            <div class="search-panel" id="weather-panel">
                <div class="search-container">
                    <input type="text" id="city-input" placeholder="Digite o nome de uma cidade...">
                    <button id="search-weather-btn"><i class="fas fa-search"></i> Buscar</button>
                    <button id="current-location-weather-btn"><i class="fas fa-location-arrow"></i> Minha Localização</button>
                </div>
                <div class="unit-selector">
                    <label><input type="radio" name="weather-unit" value="metric" checked> Celsius</label>
                    <label><input type="radio" name="weather-unit" value="imperial"> Fahrenheit</label>
                </div>
            </div>
            <div id="info-display"></div>
        `;

        container.innerHTML = html;
        this.addEventListeners();
    }

    addEventListeners() {
        const searchBtn = document.getElementById("search-weather-btn");
        const locationBtn = document.getElementById("current-location-weather-btn");
        const cityInput = document.getElementById("city-input");
        const unitRadios = document.querySelectorAll('input[name="weather-unit"]');

        if (searchBtn) {
            searchBtn.addEventListener("click", (event) => {
                event.preventDefault(); // Impede o comportamento padrão
                const city = cityInput?.value.trim();
                if (city) {
                    this.searchWeather(city);
                }
            });
        }

        if (locationBtn) {
            locationBtn.addEventListener("click", (event) => {
                event.preventDefault(); // Impede o comportamento padrão
                this.getCurrentLocationWeather();
            });
        }

        unitRadios.forEach((radio) => {
            radio.addEventListener("change", (event) => {
                event.preventDefault(); // Impede o comportamento padrão
                const city = cityInput?.value.trim();
                if (city) {
                    this.searchWeather(city);
                }
            });
        });

        if (cityInput) {
            cityInput.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault(); // Impede o comportamento padrão
                    const city = cityInput.value.trim();
                    if (city) {
                        this.searchWeather(city);
                    }
                }
            });
        }
    }

    async searchWeather(city) {
        const dashboard = new Dashboard();
        dashboard.showLoading();

        try {
            const unit = this.getSelectedUnit();
            const data = await this.weatherService.getWeatherByCity(city, unit);
            this.displayWeatherData(data);
        } catch (error) {
            this.displayError(error.message || "Erro ao buscar dados do clima.");
        } finally {
            dashboard.hideLoading();
        }
    }

    async getCurrentLocationWeather() {
        const dashboard = new Dashboard();
        dashboard.showLoading();

        if (!navigator.geolocation) {
            this.displayError("Geolocalização não é suportada pelo seu navegador.");
            dashboard.hideLoading();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const unit = this.getSelectedUnit();
                    const { latitude, longitude } = position.coords;
                    const data = await this.weatherService.getWeatherByCoords(latitude, longitude, unit);
                    this.displayWeatherData(data);
                } catch (error) {
                    this.displayError(error.message || "Erro ao obter dados de localização.");
                } finally {
                    dashboard.hideLoading();
                }
            },
            (error) => {
                this.displayError("Erro ao obter localização: " + error.message);
                dashboard.hideLoading();
            }
        );
    }

    displayWeatherData(data) {
        const infoDisplay = document.getElementById("info-display");
        if (!infoDisplay) {
            console.error('Elemento "info-display" não encontrado no DOM.');
            return;
        }

        if (!data || !data.current) {
            this.displayError("Dados do clima não disponíveis.");
            return;
        }

        const unit = this.getSelectedUnit();
        const tempUnit = unit === "metric" ? "°C" : "°F";

        let temperature = data.current.temperature_2m;
        let feelsLike = data.current.apparent_temperature;

        if (unit === "imperial") {
            temperature = this.convertToFahrenheit(temperature);
            feelsLike = this.convertToFahrenheit(feelsLike);
        }

        const weatherCodes = {
            0: "Céu limpo",
            1: "Principalmente limpo",
            2: "Parcialmente nublado",
            3: "Nublado",
            // Adicione mais códigos conforme necessário
        };

        const weatherDescription = weatherCodes[data.current.weather_code] || "Condição desconhecida";

        const html = `
            <div class="card weather-card shadow-sm">
                <div class="card-body">
                    <h2 class="card-title h4 mb-3">Clima Atual</h2>
                    <div class="weather-main mb-4">
                        <div class="temp-container text-center">
                            <span class="temperature display-4">${Math.round(temperature)}${tempUnit}</span>
                            <span class="description d-block text-muted">${weatherDescription}</span>
                        </div>
                    </div>
                    <div class="weather-details">
                        <div class="detail d-flex align-items-center mb-2">
                            <i class="fas fa-thermometer-half me-2 text-primary"></i>
                            <span class="text-secondary">Sensação: ${Math.round(feelsLike)}${tempUnit}</span>
                        </div>
                        <div class="detail d-flex align-items-center mb-2">
                            <i class="fas fa-tint me-2 text-primary"></i>
                            <span class="text-secondary">Umidade: ${data.current.relative_humidity_2m}%</span>
                        </div>
                        <div class="detail d-flex align-items-center">
                            <i class="fas fa-wind me-2 text-primary"></i>
                            <span class="text-secondary">Vento: ${data.current.wind_speed_10m} ${unit === "metric" ? "km/h" : "mph"}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        infoDisplay.innerHTML = html;
    }

    displayError(message) {
        const infoDisplay = document.getElementById("info-display");
        if (!infoDisplay) {
            console.error('Elemento "info-display" não encontrado no DOM.');
            return;
        }

        infoDisplay.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }

    getSelectedUnit() {
        const unitRadio = document.querySelector('input[name="weather-unit"]:checked');
        return unitRadio ? unitRadio.value : "metric";
    }

    convertToFahrenheit(celsius) {
        return (celsius * 9) / 5 + 32;
    }
}

export { CardClima };