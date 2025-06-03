import { ApiClient } from '../core/ApiClient.js';

class MoviesService {
    constructor() {
        this.apiClient = new ApiClient();
        this.apiKey = 'SUA_CHAVE_API_TMDB'; // Substitua pela sua chave API do TMDB
        this.baseUrl = 'https://api.themoviedb.org/3';
    }
    
    async searchMovie(query, language = 'pt-BR') {
        const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&language=${language}`;
        return await this.apiClient.get(url);
    }
    
    async getPopularMovies(language = 'pt-BR') {
        const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=${language}`;
        return await this.apiClient.get(url);
    }
    
    async getMovieDetails(movieId, language = 'pt-BR') {
        const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&language=${language}`;
        return await this.apiClient.get(url);
    }
}

export { MoviesService };