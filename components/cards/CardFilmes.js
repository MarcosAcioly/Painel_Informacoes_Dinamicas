import { MoviesService } from '../../services/MoviesService.js';
import { Dashboard } from '../Dashboard.js';
class CardFilmes {
    constructor() {
        this.moviesService = new MoviesService();
    }
    
    render(container) {
        const html = `
            <div class="card p-3 mb-3" id="movies-panel">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" id="movie-input" placeholder="Digite o nome de um filme...">
                    <button class="btn btn-primary" id="search-movie-btn">
                        <i class="fas fa-search me-1"></i> Buscar
                    </button>
                    <button class="btn btn-secondary" id="popular-movies-btn">
                        <i class="fas fa-fire me-1"></i> Populares
                    </button>
                </div>
                <div class="form-group">
                    <label for="movie-language" class="form-label">Idioma:</label>
                    <select class="form-select" id="movie-language">
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

        const languageSelect = document.getElementById('movie-language');
        const language = languageSelect ? languageSelect.value : 'pt-BR'; // valor padrão

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
    
    async getPopularMovies() {
        const url = 'https://api.themoviedb.org/3/movie/popular?language=pt-BR';
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZDg4YTY2N2YzMjE1NzgzYTRhZTEzODJhNjVhOTkzNSIsIm5iZiI6MTczMjQ4MDY5OS4zMDMsInN1YiI6IjY3NDM4ZWJiZjNmMjkxOTEyZTk1NTk2YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xOOxzpg9KsuMHV0epv8YjuR76KH4oLYdWzG5EZOZo8E'
          }
        };
        
        const response = await fetch(url, options);
        const data = await response.json();
        this.displayPopularMovies(data);
    }
    
    displayMovieData(data) {
        const infoDisplay = document.getElementById('info-display');
        
        if (data.results && data.results.length > 0) {
            const movie = data.results[0];
            const posterPath = movie.poster_path ? 
                `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 
                'https://via.placeholder.com/300x450?text=Sem+Imagem';
            
            const html = `
                <div class="card shadow-sm">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${posterPath}" class="img-fluid rounded-start" alt="${movie.title}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h2 class="card-title h4">${movie.title}</h2>
                                <p class="card-text text-muted">
                                    <small>Data de Lançamento: ${this.formatDate(movie.release_date)}</small>
                                </p>
                                <p class="card-text">
                                    <span class="badge bg-warning text-dark">
                                        <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}/10
                                    </span>
                                </p>
                                <p class="card-text">${movie.overview || 'Sem descrição disponível.'}</p>
                            </div>
                        </div>
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
            let html = '<div class="row row-cols-1 row-cols-md-3 g-4">';
            
            data.results.slice(0, 6).forEach(movie => {
                const posterPath = movie.poster_path ? 
                    `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 
                    'https://via.placeholder.com/150x225?text=Sem+Imagem';
                
                html += `
                    <div class="col">
                        <div class="card h-100 movie-item" data-id="${movie.id}">
                            <img src="${posterPath}" class="card-img-top" alt="${movie.title}">
                            <div class="card-body">
                                <h3 class="card-title h5">${movie.title}</h3>
                                <p class="card-text">
                                    <span class="badge bg-warning text-dark">
                                        <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}/10
                                    </span>
                                </p>
                            </div>
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
            <div class="card shadow">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${posterPath}" class="img-fluid rounded-start" alt="${movie.title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h2 class="card-title h4">${movie.title}</h2>
                            <p class="card-text text-muted">${movie.tagline || ''}</p>
                            <p class="card-text">
                                <small class="text-muted">Data de Lançamento: ${this.formatDate(movie.release_date)}</small>
                            </p>
                            <p class="card-text">Gêneros: ${genres}</p>
                            <p class="card-text">
                                <span class="badge bg-warning text-dark">
                                    <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}/10
                                </span>
                            </p>
                            <p class="card-text">Duração: ${this.formatRuntime(movie.runtime)}</p>
                            <p class="card-text">${movie.overview || 'Sem descrição disponível.'}</p>
                        </div>
                    </div>
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
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                ${message}
            </div>
        `;
    }
}

export {CardFilmes}