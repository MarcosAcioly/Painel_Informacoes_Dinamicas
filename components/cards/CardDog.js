import { DogService } from '../../services/DogService.js';

class CardDog {
    constructor() {
        this.dogService = new DogService();
        this.currentBreed = null;
    }

    async render(container) {
        try {
            const [dog, breeds] = await Promise.all([
                this.dogService.getRandomDog(),
                this.dogService.getBreeds()
            ]);
            
            container.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="fas fa-dog"></i> Cachorro do Dia
                            <button class="btn btn-sm btn-outline-primary float-end" id="refresh-dog">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </h5>
                        
                        <div class="text-center my-3">
                            <img src="${dog.imageUrl}" 
                                 alt="${dog.breed}"
                                 class="img-fluid rounded shadow-sm"
                                 style="max-height: 300px; object-fit: cover;">
                        </div>

                        <div class="dog-info mb-3">
                            <h6 class="text-center">${dog.breed}</h6>
                        </div>

                        <div class="input-group">
                            <select class="form-select" id="breed-select">
                                <option value="">Escolha uma raça...</option>
                                ${breeds.map(breed => `
                                    <option value="${breed.id}" 
                                            ${breed.id === dog.breedId ? 'selected' : ''}>
                                        ${breed.name}
                                    </option>
                                `).join('')}
                            </select>
                            <button class="btn btn-primary" id="search-breed">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            this.setupEventListeners(container);

        } catch (error) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i>
                    Erro ao carregar cachorro: ${error.message}
                </div>
            `;
        }
    }

    setupEventListeners(container) {
        const refreshBtn = container.querySelector('#refresh-dog');
        const breedSelect = container.querySelector('#breed-select');
        const searchBtn = container.querySelector('#search-breed');
        const imgElement = container.querySelector('img');

        refreshBtn?.addEventListener('click', async () => {
            try {
                refreshBtn.disabled = true;
                const dog = await this.dogService.getRandomDog();
                imgElement.src = dog.imageUrl;
                imgElement.alt = dog.breed;
                container.querySelector('.dog-info h6').textContent = dog.breed;
            } catch (error) {
                console.error('Erro ao atualizar cachorro:', error);
            } finally {
                refreshBtn.disabled = false;
            }
        });

        searchBtn?.addEventListener('click', async () => {
            const breedId = breedSelect.value;
            if (!breedId) return;

            try {
                searchBtn.disabled = true;
                const dog = await this.dogService.getDogByBreed(breedId);
                imgElement.src = dog.imageUrl;
                imgElement.alt = dog.breed?.name || 'Cachorro';
                container.querySelector('.dog-info h6').textContent = dog.breed?.name || 'Raça desconhecida';
            } catch (error) {
                console.error('Erro ao buscar raça:', error);
            } finally {
                searchBtn.disabled = false;
            }
        });
    }

    destroy() {
        // Cleanup if needed
    }
}

export { CardDog };