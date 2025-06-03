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

    if (searchBtn && cityInput) {
      searchBtn.addEventListener("click", () => {
        const city = cityInput.value.trim();
        if (city) {
          this.searchWeather(city);
        }
      });
    }

    if (locationBtn) {
      locationBtn.addEventListener("click", () => {
        this.getCurrentLocationWeather();
      });
    }

    unitRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (cityInput) {
          const city = cityInput.value.trim();
          if (city) {
            this.searchWeather(city);
          }
        }
      });
    });

    if (cityInput) {
      cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const city = cityInput.value.trim();
          if (city) {
            this.searchWeather(city);
          }
        }
      });
    }
  }

  searchWeather(city) {
    const dashboard = new Dashboard();
    dashboard.showLoading();

    const unitRadio = document.querySelector('input[name="weather-unit"]:checked');
    const unit = unitRadio ? unitRadio.value : "metric";

    this.weatherService
      .getWeatherByCity(city, unit)
      .then((data) => {
        this.displayWeatherData(data);
        dashboard.hideLoading();
      })
      .catch((error) => {
        this.displayError(error);
        dashboard.hideLoading();
      });
  }

  getCurrentLocationWeather() {
    const dashboard = new Dashboard();
    dashboard.showLoading();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const unitRadio = document.querySelector('input[name="weather-unit"]:checked');
          const unit = unitRadio ? unitRadio.value : "metric";
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          this.weatherService
            .getWeatherByCoords(lat, lon, unit)
            .then((data) => {
              this.displayWeatherData(data);
              dashboard.hideLoading();
            })
            .catch((error) => {
              this.displayError(error);
              dashboard.hideLoading();
            });
        },
        (error) => {
          this.displayError("Erro ao obter localização: " + error.message);
          dashboard.hideLoading();
        }
      );
    } else {
      this.displayError("Geolocalização não é suportada pelo seu navegador");
      dashboard.hideLoading();
    }
  }

  displayWeatherData(data) {
    const infoDisplay = document.getElementById("info-display");
    if (!infoDisplay) return;
    const unitRadio = document.querySelector('input[name="weather-unit"]:checked');
    const unit = unitRadio ? unitRadio.value : "metric";
    const tempUnit = unit === "metric" ? "°C" : "°F";

    const html = `
            <div class="weather-card">
                <h2>${data.name}, ${data.sys.country}</h2>
                <div class="weather-main">
                    <img src="https://openweathermap.org/img/wn/${
                      data.weather[0].icon
                    }@2x.png" alt="${data.weather[0].description}">
                    <div class="temp-container">
                        <span class="temperature">${Math.round(
                          data.main.temp
                        )}${tempUnit}</span>
                        <span class="description">${
                          data.weather[0].description
                        }</span>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="detail">
                        <i class="fas fa-thermometer-half"></i>
                        <span>Sensação: ${Math.round(
                          data.main.feels_like
                        )}${tempUnit}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-tint"></i>
                        <span>Umidade: ${data.main.humidity}%</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-wind"></i>
                        <span>Vento: ${data.wind.speed} ${
      unit === "metric" ? "m/s" : "mph"
    }</span>
                    </div>
                </div>
            </div>
        `;

    infoDisplay.innerHTML = html;
  }

  displayError(message) {
    const infoDisplay = document.getElementById("info-display");
    if (!infoDisplay) return;
    infoDisplay.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
  }
}

export { CardClima };