import { CountriesService } from '../../services/CountriesService.js';
import { Dashboard } from '../Dashboard.js';

class PaisesComponent {
    constructor() {
        this.service = new CountriesService();
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
        const regionBtns = document.querySelectorAll('.region-btn');
        const input = document.getElementById('country-input'); // Captura o input após renderizar

        searchBtn.addEventListener('click', () => {
            this.searchCountry(input);
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchCountry(input);
            }
        });

        regionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const region = btn.dataset.region;
                this.getCountriesByRegion(region);
            });
        });
    }

    searchCountry(input) {
        const countryName = input.value.trim(); // Captura o valor do input
        if (!countryName) {
            console.warn('O nome do país não pode estar vazio.');
            return;
        }

        this.service.getCountryByName(countryName)
            .then(country => {
                console.log(country); 
                this.renderCountryData(country);
            })
            .catch(error => {
                console.error('Erro ao buscar país:', error);
            });
    }

    getCountriesByRegion(region) {
        const dashboard = new Dashboard();
        dashboard.showLoading();
        
        this.service.getCountriesByRegion(region)
            .then(data => {
                this.displayCountriesList(data);
                dashboard.hideLoading();
            })
            .catch(error => {
                this.displayError(error);
                dashboard.hideLoading();
            });
    }
    
    renderCountryData(country) {
        const container = document.getElementById('component-container');
        container.innerHTML = `
            <h2>${country[0].name.common}</h2>
            <p>Capital: ${country[0].capital}</p>
            <p>População: ${country[0].population}</p>
            <img src="${country[0].flags.svg}" alt="Bandeira de ${country[0].name.common}" />
        `;
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
        
        this.service.getCountryByCode(countryCode)
            .then(data => {
                this.renderCountryData(data);
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

    hideLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        } else {
            console.warn('Elemento "loading" não encontrado no DOM. Verifique se renderCategorySelector foi chamado.');
        }
    }

    init() {
        console.log('Inicializando Dashboard...');
        this.renderCategorySelector();
        this.renderActiveComponent();
        this.addEventListeners();
    }
}

export { PaisesComponent };