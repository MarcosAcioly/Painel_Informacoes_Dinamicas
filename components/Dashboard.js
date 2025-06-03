import { PaisesComponent } from './cards/PaisesComponent.js';
import { CardClima } from './cards/CardClima.js';
import { CardFilmes } from './cards/CardFilmes.js';
import { CardMusica } from './cards/CardMusica.js';
import { CardPiadas } from './cards/CardPiadas.js';

class Dashboard {
    constructor() {
        this.container = document.getElementById('dashboard-container');
        this.activeCategory = 'countries';
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
    
    renderCategorySelector() {
        const categorySelectorHtml = `
            <div class="category-selector">
                <button class="category-btn active" data-category="countries">
                    <i class="fas fa-globe-americas"></i> Países
                </button>
                <button class="category-btn" data-category="weather">
                    <i class="fas fa-cloud-sun"></i> Clima
                </button>
                <button class="category-btn" data-category="movies">
                    <i class="fas fa-film"></i> Filmes
                </button>
                <button class="category-btn" data-category="music">
                    <i class="fas fa-music"></i> Música
                </button>
                <button class="category-btn" data-category="jokes">
                    <i class="fas fa-laugh-squint"></i> Piadas
                </button>
            </div>
            <div id="component-container"></div>
            <div class="info-display" id="info-display">
                <div id="loading" style="display: none;">Carregando...</div>
            </div>
        `;
        
        this.container.innerHTML = categorySelectorHtml;
    }
    
    renderActiveComponent() {
        const componentContainer = document.getElementById('component-container');
        componentContainer.innerHTML = '';
        
        // Renderiza o componente ativo
        const component = this.components[this.activeCategory];
        if (component) {
            component.render(componentContainer);
        }
    }
    
    addEventListeners() {
        // Adiciona listeners para os botões de categoria
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove a classe active de todos os botões
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adiciona a classe active ao botão clicado
                button.classList.add('active');
                
                // Atualiza a categoria ativa
                this.activeCategory = button.dataset.category;
                
                // Renderiza o componente ativo
                this.renderActiveComponent();
            });
        });
    }
    
    showLoading() {
        const loadingElement = document.getElementById('loading');
        console.log(loadingElement);
        loadingElement.style.display = 'flex';
    }
    
    hideLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        } else {
            console.error('Elemento "loading" não encontrado no DOM.');
        }
    }
}

export { Dashboard };

