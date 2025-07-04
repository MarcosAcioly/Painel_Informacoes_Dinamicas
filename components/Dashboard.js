import { PaisesComponent } from './cards/PaisesComponent.js';
import { CardClima } from './cards/CardClima.js';
import { CardFilmes } from './cards/CardFilmes.js';
import { CardMusica } from './cards/CardMusica.js';
import { CardPiadas } from './cards/CardPiadas.js';
import { CardAnimal } from './cards/CardAnimal.js';
import { CardBlockchain } from './cards/CardBlockchain.js';
import { CardAntivirus } from './cards/CardAntivirus.js';
import { CardDog } from './cards/CardDog.js';

class Dashboard {
    constructor() {
        this.container = document.getElementById('dashboard-container');
        this.activeCategory = 'countries';
        this.components = {
            countries: new PaisesComponent(),
            weather: new CardClima(),
            movies: new CardFilmes(),
            music: new CardMusica(),
            jokes: new CardPiadas(),
            animals: new CardAnimal(),
            blockchain: new CardBlockchain(),
            antivirus: new CardAntivirus(),
            dog: new CardDog()
        };

        // Define categories configuration with grid layout settings
        this.categories = [
            { id: 'countries', icon: 'fas fa-globe-americas', label: 'Países', cols: 6 },
            { id: 'weather', icon: 'fas fa-cloud-sun', label: 'Clima', cols: 6 },
            { id: 'movies', icon: 'fas fa-film', label: 'Filmes', cols: 4 },
            { id: 'music', icon: 'fas fa-music', label: 'Música', cols: 4 },
            { id: 'jokes', icon: 'fas fa-laugh-squint', label: 'Piadas', cols: 4 },
            { id: 'animals', icon: 'fas fa-paw', label: 'Animais', cols: 6 },
            { id: 'blockchain', icon: 'fas fa-coins', label: 'Criptomoedas', cols: 6 },
            { id: 'antivirus', icon: 'fas fa-shield-virus', label: 'Antivírus', cols: 6 },
            { id: 'dog', icon: 'fas fa-dog', label: 'Cachorros', cols: 6 }
        ];

        this.init();
    }

    init() {
        this.renderCategorySelector();
        this.renderActiveComponent();
        this.addEventListeners();
    }

    // Renderiza o seletor de categorias e containers principais
    renderCategorySelector() {
        const categorySelectorHtml = `
            <div class="container-fluid p-3">
                <nav class="navbar navbar-expand-lg navbar-light bg-light rounded shadow-sm mb-4">
                    <div class="container-fluid">
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#categoryNav">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="categoryNav">
                            <div class="navbar-nav d-flex flex-wrap justify-content-center w-100 gap-2">
                                ${this.getCategoryButtonsHtml()}
                            </div>
                        </div>
                    </div>
                </nav>
                <div class="row" id="component-container"></div>
                <div class="position-relative">
                    <div id="info-display" class="mt-3"></div>
                    <div id="loading" class="position-absolute top-50 start-50 translate-middle d-none">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.container.innerHTML = categorySelectorHtml;
    }

    getCategoryButtonsHtml() {
        return this.categories
            .map((category, index) => `
                <button type="button" 
                        class="btn ${index === 0 ? 'btn-primary active' : 'btn-outline-primary'} category-btn"
                        data-category="${category.id}"
                        data-bs-toggle="tooltip"
                        title="${category.label}">
                    <i class="${category.icon}"></i>
                    <span class="d-none d-md-inline ms-2">${category.label}</span>
                </button>
            `)
            .join('');
    }

    async renderActiveComponent() {
        try {
            const componentContainer = document.getElementById('component-container');
            if (!componentContainer) {
                throw new Error('Elemento "component-container" não encontrado no DOM.');
            }

            this.showLoading();
            componentContainer.innerHTML = '';

            const component = this.components[this.activeCategory];
            if (!component) {
                throw new Error(`Componente para a categoria "${this.activeCategory}" não encontrado.`);
            }

            if (component instanceof HTMLElement) {
                componentContainer.appendChild(component);
            } else if (typeof component.render === 'function') {
                await component.render(componentContainer);
            } else {
                throw new Error(`Componente para a categoria "${this.activeCategory}" não é válido.`);
            }
        } catch (error) {
            this.displayError(error.message);
            console.error('Erro ao renderizar componente:', error);
        } finally {
            this.hideLoading();
        }
    }

    // Exibe mensagens de erro no painel
    displayError(message) {
        const infoDisplay = document.getElementById('info-display');
        if (infoDisplay) {
            infoDisplay.innerHTML = `
                <div class="alert alert-danger d-flex align-items-center" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    <div>${message}</div>
                </div>
            `;
        }
    }

    // Adiciona listeners aos botões de categoria
    addEventListeners() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', (event) => this.handleCategoryChange(event, categoryButtons));
        });
    }

    async handleCategoryChange(event, categoryButtons) {
        try {
            event.preventDefault();
            const button = event.currentTarget;
            
            // Update button styles
            categoryButtons.forEach(btn => {
                btn.classList.remove('active', 'btn-primary');
                btn.classList.add('btn-outline-primary');
            });
            
            button.classList.add('active', 'btn-primary');
            button.classList.remove('btn-outline-primary');

            // Clean up previous component if needed
            const oldComponent = this.components[this.activeCategory];
            if (oldComponent && typeof oldComponent.destroy === 'function') {
                await oldComponent.destroy();
            }

            // Update and render new component
            this.activeCategory = button.dataset.category;
            await this.renderActiveComponent();
        } catch (error) {
            this.displayError('Erro ao mudar de categoria: ' + error.message);
            console.error('Erro na mudança de categoria:', error);
        }
    }

    // Exibe o spinner de loading (útil para requisições assíncronas)
    showLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.classList.remove('d-none');
        }
    }

    // Esconde o spinner de loading
    hideLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.classList.add('d-none');
        }
    }
}

export { Dashboard };

