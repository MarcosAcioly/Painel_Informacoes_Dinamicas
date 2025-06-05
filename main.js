import { Dashboard } from './components/Dashboard.js';
import { getCountries } from './services/CountriesService.js';
import { getWeather } from './services/WeatherService.js';
import { getMovies } from './services/MoviesService.js';
import { getMusic } from './services/MusicService.js';
import { AnimalService } from './services/AnimalService.js';
import { BlockchainService } from './services/BlockchainService.js';
import { DogService } from './services/DogService.js';

class App {
    constructor() {
        this.dashboard = null;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupDOMStructure();
            this.initializeDashboard();
            this.renderDashboard();
        });
    }

    setupDOMStructure() {
        const container = document.getElementById('dashboard-container');
        if (!container) {
            throw new Error('Elemento "dashboard-container" não encontrado no DOM.');
        }

        // Limpa o container e cria um div para cada card
        container.innerHTML = '';
        this.cards = {
            countries: document.createElement('div'),
            weather: document.createElement('div'),
            movies: document.createElement('div'),
            music: document.createElement('div'),
            piadas: document.createElement('div'),
            animals: document.createElement('div'),
            blockchain: document.createElement('div')
        };

        Object.values(this.cards).forEach(div => {
            div.className = 'dashboard-card';
            container.appendChild(div);
        });
    }

    initializeDashboard() {
        try {
            this.dashboard = new Dashboard();
        } catch (error) {
            console.error('Erro ao inicializar o dashboard:', error.message);
            this.displayError(error.message);
        }
    }

    displayError(message) {
        const infoDisplay = document.getElementById('info-display');
        if (infoDisplay) {
            infoDisplay.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    ${message}
                </div>
            `;
        }
    }

    async renderDashboard() {
        // Renderiza cada card com tratamento de erro individual
        await Promise.allSettled([
            this.renderCountriesCard(),
            this.renderWeatherCard(),
            this.renderMoviesCard(),
            this.renderMusicCard(),
            this.renderJokesCard(),
            this.renderAnimalsCard(),
            this.renderBlockchainCard()
        ]);
    }

    async renderCountriesCard() {
        try {
            const countries = await getCountries();
            this.cards.countries.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-globe"></i> Países</h5>
                        <ul class="list-unstyled">
                            ${countries.slice(0, 5).map(c => `<li>${c.name}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        } catch (e) {
            this.cards.countries.innerHTML = `<div class="alert alert-danger">Erro ao carregar países</div>`;
        }
    }

    async renderWeatherCard() {
        try {
            const weather = await getWeather('São Paulo');
            this.cards.weather.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-cloud-sun"></i> Clima</h5>
                        <p>${weather.city}: ${weather.temp_c}°C, ${weather.condition}</p>
                    </div>
                </div>
            `;
        } catch (e) {
            this.cards.weather.innerHTML = `<div class="alert alert-danger">Erro ao carregar clima</div>`;
        }
    }

    async renderMoviesCard() {
        try {
            const movies = await getMovies();
            this.cards.movies.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-film"></i> Filmes</h5>
                        <ul>
                            ${movies.slice(0, 5).map(m => `<li>${m.title}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        } catch (e) {
            this.cards.movies.innerHTML = `<div class="alert alert-danger">Erro ao carregar filmes</div>`;
        }
    }

    async renderMusicCard() {
        try {
            const music = await getMusic();
            this.cards.music.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-music"></i> Música</h5>
                        <ul>
                            ${music.slice(0, 5).map(m => `<li>${m.artist} - ${m.song}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        } catch (e) {
            this.cards.music.innerHTML = `<div class="alert alert-danger">Erro ao carregar músicas</div>`;
        }
    }

    async renderJokesCard() {
        try {
            const piadas = await this.dashboard.getPiadas();
            this.cards.piadas.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-laugh"></i> Piadas</h5>
                        <ul>
                            ${piadas.slice(0, 5).map(p => `<li>${p.texto}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        } catch (e) {
            this.cards.piadas.innerHTML = `<div class="alert alert-danger">Erro ao carregar piadas</div>`;
        }
    }

    async renderAnimalsCard() {
        try {
            const animalService = new AnimalService();
            const animals = await animalService.getAnimals();
            this.cards.animals.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-paw"></i> Animais</h5>
                        <ul class="list-unstyled">
                            ${animals.slice(0, 5).map(animal => `
                                <li class="mb-2">
                                    <strong>${animal.name}</strong>
                                    <br>
                                    <small>Habitat: ${animal.characteristics.habitat}</small>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
        } catch (e) {
            this.cards.animals.innerHTML = `<div class="alert alert-danger">Erro ao carregar animais</div>`;
        }
    }

    async renderBlockchainCard() {
        try {
            const blockchainService = new BlockchainService();
            const prices = await blockchainService.getMultiplePrices();
            this.cards.blockchain.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="fas fa-coins"></i> Criptomoedas
                            <small class="text-muted float-end">
                                <i class="fas fa-sync-alt"></i> Atualização: 30s
                            </small>
                        </h5>
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <tbody>
                                    ${prices.map(crypto => `
                                        <tr>
                                            <td><strong>${crypto.symbol}</strong></td>
                                            <td class="text-end">$${crypto.price}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        } catch (e) {
            this.cards.blockchain.innerHTML = `<div class="alert alert-danger">Erro ao carregar criptomoedas</div>`;
        }
    }
}

// Inicializa a aplicação
const app = new App();
app.init();

