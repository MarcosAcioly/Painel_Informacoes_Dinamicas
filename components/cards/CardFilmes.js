import { MoviesService } from '../../services/MoviesService.js';
import { Dashboard } from '../Dashboard.js';
class CardFilmes {
    constructor() {
        this.moviesService = new MoviesService();
    }
    
    render(container) {
        const html = `
            <div class="search-panel" id="movies-panel">
                <div class="search-container">
                    <input type="text" id="movie-input" placeholder="Digite o nome de um filme...">
                    <button id="search-movie-btn"><i class="fas fa-search"></i> Buscar</button>
                    <button id="popular-movies-btn"><i class="fas fa-fire"></i> Populares</button>
                </div>
                <div class="language-selector">
                    <label for="movie-language">Idioma:</label>
                    <select id="movie-language">
                        <option value="pt-BR">Português</option>
                        <option value="en-US">Inglês</option>
                        <option value="es-ES">Espanhol</option>
                        <option value="fr-FR">Francês</option>
                        <option value="de-DE">Alemão</option>
                        <option value="it-IT">Italiano</option>
                        <option value="ru-RU">Russo</option>
                    </select>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.addEventListeners();
    }
    
    addEventListeners() {
        const searchBtn = document.getElementById('search-movie-btn');
        const popularBtn = document.getElementById('popular-movies-btn');
        const movieInput = document.getElementById('movie-input');
        const languageSelect = document.getElementById('movie-language');
        
        searchBtn.addEventListener('click', () => {
            const movie = movieInput.value.trim();
            if (movie) {
                this.searchMovie(movie);
            }
        });
        
        popularBtn.addEventListener('click', () => {
            this.getPopularMovies();
        });
        
        movieInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const movie = movieInput.value.trim();
                if (movie) {
                    this.searchMovie(movie);
                }
            }
        });
        
        languageSelect.addEventListener('change', () => {
            const movie = movieInput.value.trim();
            if (movie) {
                this.searchMovie(movie);
            }
        });
    }
    
    searchMovie(movieName) {
        const dashboard = new Dashboard();
        dashboard.showLoading();
        
        const language = document.getElementById('movie-language').value;
        
        this.moviesService.searchMovie(movieName, language)
            .then(data => {
                this.displayMovieData(data);
                dashboard.hideLoading();
            })
            .catch(error => {
                this.displayError(error);
                dashboard.hideLoading();
            });
    }
    
    getPopularMovies() {
        const dashboard = new Dashboard();
        dashboard.showLoading();
        
        const language = document.getElementById('movie-language').value;
        
        this.moviesService.getPopularMovies(language)
            .then(data => {
                this.displayPopularMovies(data);
                dashboard.hideLoading();
            })
            .catch(error => {
                this.displayError(error);
                dashboard.hideLoading();
            });
    }
    
    displayMovieData(data) {
        const infoDisplay = document.getElementById('info-display');
        
        if (data.results && data.results.length > 0) {
            const movie = data.results[0];
            const posterPath = movie.poster_path ? 
                `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 
                'https://via.placeholder.com/300x450?text=Sem+Imagem';
            
            const html = `
                <div class="movie-card">
                    <div class="movie-poster">
                        <img src="${posterPath}" alt="${movie.title}">
                    </div>
                    <div class="movie-details">
                        <h2>${movie.title}</h2>
                        <p class="release-date">Data de Lançamento: ${this.formatDate(movie.release_date)}</p>
                        <p class="rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}/10</p>
                        <p class="overview">${movie.overview || 'Sem descrição disponível.'}</p>
                    </div>
                </div>
            `;
            
            infoDisplay.innerHTML = html;
        } else {
            this.displayError('Nenhum filme encontrado com esse nome.');
        }
    }
    
    displayPopularMovies(data) {
        const infoDisplay = document.getElementById('info-display');
        
        if (data.results && data.results.length > 0) {
            let html = '<div class="popular-movies">';
            
            data.results.slice(0, 6).forEach(movie => {
                const posterPath = movie.poster_path ? 
                    `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 
                    'https://via.placeholder.com/150x225?text=Sem+Imagem';
                
                html += `
                    <div class="movie-item" data-id="${movie.id}">
                        <img src="${posterPath}" alt="${movie.title}">
                        <div class="movie-item-details">
                            <h3>${movie.title}</h3>
                            <p><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}/10</p>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            infoDisplay.innerHTML = html;
            
            // Adiciona evento de clique para cada filme
            document.querySelectorAll('.movie-item').forEach(item => {
                item.addEventListener('click', () => {
                    const movieId = item.dataset.id;
                    this.getMovieDetails(movieId);
                });
            });
        } else {
            this.displayError('Não foi possível carregar os filmes populares.');
        }
    }
    
    getMovieDetails(movieId) {
        const dashboard = new Dashboard();
        dashboard.showLoading();
        
        const language = document.getElementById('movie-language').value;
        
        this.moviesService.getMovieDetails(movieId, language)
            .then(data => {
                this.displayMovieDetails(data);
                dashboard.hideLoading();
            })
            .catch(error => {
                this.displayError(error);
                dashboard.hideLoading();
            });
    }
    
    displayMovieDetails(movie) {
        const infoDisplay = document.getElementById('info-display');
        const posterPath = movie.poster_path ? 
            `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 
            'https://via.placeholder.com/300x450?text=Sem+Imagem';
        
        const genres = movie.genres.map(genre => genre.name).join(', ');
        
        const html = `
            <div class="movie-details-card">
                <div class="movie-poster">
                    <img src="${posterPath}" alt="${movie.title}">
                </div>
                <div class="movie-info">
                    <h2>${movie.title}</h2>
                    <p class="tagline">${movie.tagline || ''}</p>
                    <p class="release-date">Data de Lançamento: ${this.formatDate(movie.release_date)}</p>
                    <p class="genres">Gêneros: ${genres}</p>
                    <p class="rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}/10</p>
                    <p class="runtime">Duração: ${this.formatRuntime(movie.runtime)}</p>
                    <p class="overview">${movie.overview || 'Sem descrição disponível.'}</p>
                </div>
            </div>
        `;
        
        infoDisplay.innerHTML = html;
    }
    
    formatDate(dateString) {
        if (!dateString) return 'Data desconhecida';
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(document.documentElement.lang, options);
    }
    
    formatRuntime(minutes) {
        if (!minutes) return 'Duração desconhecida';
        
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        return `${hours}h ${mins}min`;
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

export {CardFilmes}