import { ApiClient } from "../core/ApiClient.js";

class AnimalService {
    constructor() {
        this.apiClient = new ApiClient();
        this.baseUrl = "https://api.api-ninjas.com/v1";
        this.apiKey = "+eIq63qTg81XySfzQR4Dmw==nSW5wqUkPVR23AK0";
    }

    async getRandomAnimal(){
        try{
            const headers = {
                "X-Api-Key": this.apiKey
            };

            const response = await this.apiClient.get(`${this.baseUrl}/animals`, {headers});
            if(!response || response.length === 0) {
                throw new Error("Nenhum animal encontrado.");
            }

            const randomAnimal = response[Math.floor(Math.random() * response.length)];
            return randomAnimal;
        }catch(e){
            console.log(e);
        }
    }

    async getAnimals(searchTerm = 'lion') {
        try {
            const headers = {
                "X-Api-Key": this.apiKey
            };
            
            const response = await this.apiClient.get(
                `${this.baseUrl}/animals?name=${encodeURIComponent(searchTerm)}`, 
                { headers }
            );

            if (!response || response.length === 0) {
                return [];
            }

            return response.map(animal => ({
                name: animal.name,
                characteristics: {
                    habitat: animal.habitat || 'Não informado',
                    diet: animal.diet || 'Não informada'
                }
            }));
        } catch (error) {
            console.error('Erro ao buscar animais:', error);
            throw error;
        }
    }
}

export { AnimalService };