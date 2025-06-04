import { ApiClient } from '../core/ApiClient.js';

class JokesService {
    constructor() {
        this.apiClient = new ApiClient();
        this.baseUrl = 'https://v2.jokeapi.dev/joke';
    }

    /**
     * Obtém uma piada da API JokeAPI.
     * @param {string} category - Categoria da piada (ex: 'programming', 'any').
     * @param {string} language - Idioma da piada (ex: 'en', 'pt').
     * @returns {Promise<Object>} - Dados da piada.
     */
    async getJoke(category = 'any', language = 'en') {
        try {
            const url = `${this.baseUrl}/${category}?lang=${language}`;
            const response = await this.apiClient.get(url);
            return response;
        } catch (error) {
            throw new Error('Erro ao buscar piada: ' + error.message);
        }
    }
}

class JokesController {
    constructor(jokesService) {
        this.jokesService = jokesService;
    }

    /**
     * Obtém uma piada com base na categoria e idioma selecionados.
     */
    async getJoke() {
        const categorySelect = document.getElementById('joke-category');
        const languageSelect = document.getElementById('joke-language');

        if (!categorySelect || !languageSelect) {
            this.displayError('Elementos "joke-category" ou "joke-language" não encontrados no DOM.');
            return;
        }

        const category = categorySelect.value || 'any';
        const language = languageSelect.value || 'en';

        try {
            const jokeData = await this.jokesService.getJoke(category, language);
            this.displayJoke(jokeData);
        } catch (error) {
            this.displayError(error.message || 'Erro ao buscar piada.');
        }
    }

    /**
     * Exibe a piada no DOM.
     * @param {Object} jokeData - Dados da piada retornados pela API.
     */
    displayJoke(jokeData) {
        const jokeDisplay = document.getElementById('joke-display');

        if (!jokeDisplay) {
            console.error('Elemento "joke-display" não encontrado no DOM.');
            return;
        }

        let jokeHtml = '';

        if (jokeData.type === 'single') {
            jokeHtml = `
                <div class="joke-card">
                    <p>${jokeData.joke}</p>
                </div>
            `;
        } else if (jokeData.type === 'twopart') {
            jokeHtml = `
                <div class="joke-card">
                    <p>${jokeData.setup}</p>
                    <p>${jokeData.delivery}</p>
                </div>
            `;
        } else {
            jokeHtml = `
                <div class="joke-card">
                    <p>Não foi possível carregar a piada.</p>
                </div>
            `;
        }

        jokeDisplay.innerHTML = jokeHtml;
    }

    /**
     * Exibe uma mensagem de erro no DOM.
     * @param {string} message - Mensagem de erro a ser exibida.
     */
    displayError(message) {
        const jokeDisplay = document.getElementById('joke-display');

        if (!jokeDisplay) {
            console.error('Elemento "joke-display" não encontrado no DOM.');
            return;
        }

        jokeDisplay.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }
}

export { JokesService, JokesController };