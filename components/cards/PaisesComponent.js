import { CountriesService } from '../../services/CountriesService.js';
import { Dashboard } from '../Dashboard.js';

class PaisesComponent {
    constructor() {
        this.service = new CountriesService();
    }

    render(container) {
        const html = `
            <div class="card shadow-sm" id="countries-panel">
                <div class="card-body">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" id="country-input" 
                               placeholder="Digite o nome de um país...">
                        <button class="btn btn-primary" id="search-country-btn">
                            <i class="fas fa-search me-2"></i> Buscar
                        </button>
                    </div>
                    <div class="btn-group d-flex flex-wrap gap-2 mb-3" role="group" aria-label="Regiões">
                        <button class="btn btn-outline-secondary region-btn" data-region="africa">África</button>
                        <button class="btn btn-outline-secondary region-btn" data-region="americas">Américas</button>
                        <button class="btn btn-outline-secondary region-btn" data-region="asia">Ásia</button>
                        <button class="btn btn-outline-secondary region-btn" data-region="europe">Europa</button>
                        <button class="btn btn-outline-secondary region-btn" data-region="oceania">Oceania</button>
                    </div>
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
        const data = country[0];
        
        container.innerHTML = `
            <div class="card shadow-sm">
                <img src="${data.flags.svg}" class="card-img-top" alt="Bandeira de ${data.name.common}">
                <div class="card-body">
                    <h2 class="card-title h4">${data.name.common}</h2>
                    <ul class="list-group list-group-flush mt-3">
                        <li class="list-group-item">
                            <i class="fas fa-city me-2"></i> Capital: ${data.capital}
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-users me-2"></i> População: ${data.population.toLocaleString()}
                        </li>
                        <li class="list-group-item">
                            <i class="fas fa-globe me-2"></i> Região: ${data.region}
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    displayCountriesList(countries) {
        const infoDisplay = document.getElementById('info-display');
        
        let html = `
            <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
        `;
        
        countries.forEach(country => {
            html += `
                <div class="col">
                    <div class="card h-100 country-item shadow-sm" data-code="${country.cca2}">
                        <img src="${country.flags.png}" class="card-img-top" 
                             alt="${country.name.common} flag" style="height: 160px; object-fit: cover;">
                        <div class="card-body">
                            <h3 class="card-title h6 text-center mb-0">${country.name.common}</h3>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        infoDisplay.innerHTML = html;
        
        this.addCountryClickListeners();
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
            <div class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                <div>${message}</div>
            </div>
        `;
    }

    addCountryClickListeners() {
        document.querySelectorAll('.country-item').forEach(item => {
            item.addEventListener('click', () => {
                const countryCode = item.dataset.code;
                this.getCountryDetails(countryCode);
            });
        });
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