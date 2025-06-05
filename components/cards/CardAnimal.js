import { AnimalService } from "../../services/AnimalService.js";

class CardAnimal {
    constructor() {
        this.animalService = new AnimalService();
    }

    async searchAnimals(searchTerm) {
        try {
            const animals = await this.animalService.getAnimals(searchTerm);
            return animals;
        } catch (error) {
            console.error('Erro na busca:', error);
            return [];
        }
    }

    async render(container) {
        try {
            const animals = await this.animalService.getAnimals('lion'); // Default search
            
            container.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="fas fa-paw"></i> Animais
                        </h5>
                        <form id="animal-search-form" class="mb-3">
                            <div class="input-group">
                                <input type="text" 
                                       class="form-control" 
                                       placeholder="Buscar animal..."
                                       id="animal-search-input"
                                       required>
                                <button class="btn btn-primary" type="submit">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </form>
                        <div id="animals-list">
                            <ul class="list-unstyled">
                                ${animals.map(animal => `
                                    <li class="mb-2">
                                        <strong>${animal.name}</strong>
                                        <br>
                                        <small>
                                            Habitat: ${animal.characteristics.habitat || 'Não informado'}
                                            <br>
                                            Dieta: ${animal.characteristics.diet || 'Não informada'}
                                        </small>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;

            // Add event listener for search form
            const searchForm = container.querySelector('#animal-search-form');
            const animalsList = container.querySelector('#animals-list');

            searchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const searchInput = container.querySelector('#animal-search-input');
                const searchTerm = searchInput.value.trim();

                if (searchTerm) {
                    animalsList.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div></div>';
                    const results = await this.searchAnimals(searchTerm);
                    
                    if (results.length > 0) {
                        animalsList.innerHTML = `
                            <ul class="list-unstyled">
                                ${results.map(animal => `
                                    <li class="mb-2">
                                        <strong>${animal.name}</strong>
                                        <br>
                                        <small>
                                            Habitat: ${animal.characteristics.habitat || 'Não informado'}
                                            <br>
                                            Dieta: ${animal.characteristics.diet || 'Não informada'}
                                        </small>
                                    </li>
                                `).join('')}
                            </ul>
                        `;
                    } else {
                        animalsList.innerHTML = `
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i>
                                Nenhum animal encontrado com o termo "${searchTerm}"
                            </div>
                        `;
                    }
                }
            });

        } catch (error) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i>
                    Erro ao carregar informações dos animais
                </div>
            `;
        }
    }
}

export { CardAnimal };