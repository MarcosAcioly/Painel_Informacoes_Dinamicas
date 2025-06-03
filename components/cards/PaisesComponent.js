import { CountriesService } from '../../services/CountriesService.js';
import { Dashboard } from '../Dashboard.js';
class PaisesComponent {
    constructor() {
        this.countriesService = new CountriesService();
    }
    
    render(container) {
        const html = `
            <div class="search-panel" id="countries-panel">
                <div class="search-container">
                    <input type="text" id="country-input" placeholder="Digite o nome de um país...">
                    <button id="search-country-btn"><i class="fas fa-search"></i> Buscar</button>
                </div>
                <div class="region-selector">
                    <button class="region-btn" data-region="africa">África</button>
                    <button class="region-btn" data-region="americas">Américas</button>
                    <button class="region-btn" data-region="asia">Ásia</button>
                    <button class="region-btn" data-region="europe">Europa</button>
                    <button class="region-btn" data-region="oceania">Oceania</button>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.addEventListeners();
    }
    
    addEventListeners() {
        const searchBtn = document.getElementById('search-country-btn');
        const countryInput = document.getElementById('country-input');
        const regionBtns = document.querySelectorAll('.region-btn');
        
        searchBtn.addEventListener('click', () => {
            const country = countryInput.value.trim();
            if (country) {
                this.searchCountry(country);
            }
        });
        
        countryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const country = countryInput.value.trim();
                if (country) {
                    this.searchCountry(country);
                }
            }
        });
        
        regionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const region = btn.dataset.region;
                this.getCountriesByRegion(region);
            });
        });
    }
    
    searchCountry(countryName) {
        const dashboard = new Dashboard();
        dashboard.showLoading();
        
        this.countriesService.getCountryByName(countryName)
            .then(data => {
                this.displayCountryData(data[0]);
                dashboard.hideLoading();
            })
            .catch(error => {
                this.displayError(error);
                dashboard.hideLoading();
            });
    }
    
    getCountriesByRegion(region) {
        const dashboard = new Dashboard();
        dashboard.showLoading();
        
        this.countriesService.getCountriesByRegion(region)
            .then(data => {
                this.displayCountriesList(data);
                dashboard.hideLoading();
            })
            .catch(error => {
                this.displayError(error);
                dashboard.hideLoading();
            });
    }
    
    displayCountryData(country) {
        const infoDisplay = document.getElementById('info-display');
        
        const capital = country.capital ? country.capital[0] : 'N/A';
        const population = country.population ? country.population.toLocaleString() : 'N/A';
        const flagUrl = country.flags.png;
        
        const html = `
            <div class="country-card">
                <div class="card-title">
                    <img src="${flagUrl}" alt="${country.name.common} flag">
                    <h2>${country.name.common}</h2>
                </div>
                <div class="details-grid">
                    <div class="detail-item">
                        <strong>Capital</strong>
                        <span>${capital}</span>
                    </div>
                    <div class="detail-item">
                        <strong>População</strong>
                        <span>${population}</span>
                    </div>
                </div>
            </div>
        `;
        
        infoDisplay.innerHTML = html;
    }
    
    displayCountriesList(countries) {
        const infoDisplay = document.getElementById('info-display');
        
        let html = '<div class="countries-list">';
        
        countries.forEach(country => {
            const flagUrl = country.flags.png;
            
            html += `
                <div class="country-item" data-code="${country.cca2}">
                    <img src="${flagUrl}" alt="${country.name.common} flag">
                    <div class="country-name">${country.name.common}</div>
                </div>
            `;
        });
        
        html += '</div>';
        infoDisplay.innerHTML = html;
        
        // Adiciona evento de clique para cada país
        document.querySelectorAll('.country-item').forEach(item => {
            item.addEventListener('click', () => {
                const countryCode = item.dataset.code;
                this.getCountryDetails(countryCode);
            });
        });
    }
    
    getCountryDetails(countryCode) {
        const dashboard = new Dashboard();
        dashboard.showLoading();
        
        this.countriesService.getCountryByCode(countryCode)
            .then(data => {
                this.displayCountryData(data[0]);
                dashboard.hideLoading();
            })
            .catch(error => {
                this.displayError(error);
                dashboard.hideLoading();
            });
    }
    
    displayError(message) {
        const infoDisplay = document.getElementById('info-display');
        infoDisplay.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

export { PaisesComponent };