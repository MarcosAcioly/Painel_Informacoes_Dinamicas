import { Dashboard } from './components/Dashboard.js';
import { getCountries } from './services/CountriesService.js';
import { getWeather } from './services/WeatherService.js';
import { getMovies } from './services/MoviesService.js';
import { getMusic } from './services/MusicService.js';
import { getJoke } from './services/JokesService.js';
import { CardPiadas } from './components/cards/CardPiadas.js';

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
            piadas: document.createElement('div')
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
        // Países
        try {
            const countries = await getCountries();
            this.cards.countries.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-globe"></i> Países</h5>
                        <ul>
                            ${countries.slice(0, 5).map(c => `<li>${c.name}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        } catch (e) {
            this.cards.countries.innerHTML = `<div class="alert alert-danger">Erro ao carregar países</div>`;
        }

        // Clima
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

        // Filmes
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

        // Música
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

        // Piadas (usando componente interativo)
        try {
            const cardPiadas = new CardPiadas();
            cardPiadas.render(this.cards.piadas);
        } catch (e) {
            this.cards.piadas.innerHTML = `<div class="alert alert-danger">Erro ao carregar piadas</div>`;
        }
    }
}

// Inicializa a aplicação
const app = new App();
app.init();

