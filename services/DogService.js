import { ApiClient } from '../core/ApiClient.js';

class DogService {
    constructor() {
        this.apiClient = new ApiClient();
        this.baseUrl = 'https://api.thedogapi.com/v1';
        this.apiKey = 'live_vcVI0MTic8hDHgp85jpKY6zbtT71ZzyoFCrW0r1ym7ZY4hoLIscxasQEPA7YQwGP'; // Replace with your API key
    }

    async getRandomDog() {
        try {
            const headers = {
                'x-api-key': this.apiKey
            };

            const response = await this.apiClient.get(
                `${this.baseUrl}/images/search?limit=1`,
                { headers }
            );

            if (!response || !response[0]) {
                throw new Error('Nenhuma imagem de cachorro encontrada');
            }

            return {
                imageUrl: response[0].url,
                id: response[0].id,
                breed: response[0].breeds[0]?.name || 'Raça desconhecida'
            };
        } catch (error) {
            console.error('Erro ao buscar cachorro:', error);
            throw error;
        }
    }

    async getBreeds() {
        try {
            const headers = {
                'x-api-key': this.apiKey
            };

            const response = await this.apiClient.get(
                `${this.baseUrl}/breeds`,
                { headers }
            );

            if (!response || !Array.isArray(response)) {
                throw new Error('Não foi possível obter lista de raças');
            }

            return response.map(breed => ({
                id: breed.id,
                name: breed.name,
                temperament: breed.temperament,
                lifeSpan: breed.life_span
            }));
        } catch (error) {
            console.error('Erro ao buscar raças:', error);
            throw error;
        }
    }

    async getDogByBreed(breedId) {
        try {
            const headers = {
                'x-api-key': this.apiKey
            };

            const response = await this.apiClient.get(
                `${this.baseUrl}/images/search?breed_id=${breedId}&limit=1`,
                { headers }
            );

            if (!response || !response[0]) {
                throw new Error('Nenhuma imagem encontrada para esta raça');
            }

            return {
                imageUrl: response[0].url,
                id: response[0].id,
                breed: response[0].breeds[0]
            };
        } catch (error) {
            console.error('Erro ao buscar cachorro por raça:', error);
            throw error;
        }
    }
}

export { DogService };