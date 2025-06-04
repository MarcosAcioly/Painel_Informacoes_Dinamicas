import { PaisesComponent } from './cards/PaisesComponent.js';
import { CardClima } from './cards/CardClima.js';
import { CardFilmes } from './cards/CardFilmes.js';
import { CardMusica } from './cards/CardMusica.js';
import { CardPiadas } from './cards/CardPiadas.js';

class Dashboard {
    constructor() {
        this.container = document.getElementById('dashboard-container');
        this.activeCategory = 'countries';
        // Mapeamento dos componentes por categoria
        this.components = {
            countries: new PaisesComponent(),
            weather: new CardClima(),
            movies: new CardFilmes(),
            music: new CardMusica(),
            jokes: new CardPiadas()
        };

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
                        <div class="navbar-nav d-flex justify-content-around w-100">
                            ${this.getCategoryButtonsHtml()}
                        </div>
                    </div>
                </nav>
                <div id="component-container" class="mb-4"></div>
                <div class="position-relative">
                    <div id="info-display" class="mt-3"></div>
                    <div id="loading" class="position-absolute top-50 start-50 translate-middle" style="display: none;">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.container.innerHTML = categorySelectorHtml;
    }

    // Gera os botões de categoria dinamicamente
    getCategoryButtonsHtml() {
        const categories = [
            { id: 'countries', icon: 'fas fa-globe-americas', label: 'Países' },
            { id: 'weather', icon: 'fas fa-cloud-sun', label: 'Clima' },
            { id: 'movies', icon: 'fas fa-film', label: 'Filmes' },
            { id: 'music', icon: 'fas fa-music', label: 'Música' },
            { id: 'jokes', icon: 'fas fa-laugh-squint', label: 'Piadas' }
        ];

        // O primeiro botão começa como ativo
        return categories
            .map((category, index) => `
                <button type="button" 
                        class="btn btn-outline-primary category-btn ${index === 0 ? 'active' : ''}" 
                        data-category="${category.id}">
                    <i class="${category.icon} me-2"></i>${category.label}
                </button>
            `)
            .join('');
    }

    // Renderiza o componente ativo no container correto
    renderActiveComponent(category) {
        const componentContainer = document.getElementById('component-container');
        if (!componentContainer) {
            this.displayError('Elemento "component-container" não encontrado no DOM.');
            return;
        }

        componentContainer.innerHTML = '';

        // Instancia e renderiza o componente da categoria ativa
        const component = this.components[this.activeCategory];
        if (component) {
            // Se for um custom element (HTMLElement), apenas adiciona ao DOM
            if (component instanceof HTMLElement) {
                componentContainer.appendChild(component);
            }
            // Se for um componente com método render, chama render
            else if (typeof component.render === 'function') {
                component.render(componentContainer);
            }
            else {
                this.displayError(`Componente para a categoria "${this.activeCategory}" não é válido.`);
            }
        } else {
            this.displayError(`Componente para a categoria "${this.activeCategory}" não encontrado.`);
        }

        // Exemplo para o card de clima (remova se não for necessário)
        if (category === 'weather') {
            const container = document.getElementById('weather-card');
            if (container) {
                container.innerHTML = '';
                const cardClima = document.createElement('card-clima');
                container.appendChild(cardClima);
            }
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

    // Troca a categoria ativa e atualiza o visual dos botões
    handleCategoryChange(event, categoryButtons) {
        event.preventDefault();
        const button = event.currentTarget;

        // Remove estilos ativos de todos os botões
        categoryButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-primary');
        });

        // Ativa o botão clicado
        button.classList.add('active');
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-primary');

        // Atualiza a categoria ativa e renderiza o componente correspondente
        this.activeCategory = button.dataset.category;
        this.renderActiveComponent();
    }

    // Exibe o spinner de loading (útil para requisições assíncronas)
    showLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
    }

    // Esconde o spinner de loading
    hideLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

export { Dashboard };

