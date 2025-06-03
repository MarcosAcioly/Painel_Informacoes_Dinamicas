import { ApiClient } from '../core/ApiClient.js';

class JokesService {
    constructor() {
        this.apiClient = new ApiClient();
        this.baseUrl = 'https://v2.jokeapi.dev/joke';
    }
    
    async getJoke(category = 'any', language = 'en') {
        const url = `${this.baseUrl}/${category}?lang=${language}`;
        return await this.apiClient.get(url);
    }
}

export {JokesService}