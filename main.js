import { Dashboard } from './components/Dashboard.js';

class App {
    constructor() {
        this.dashboard = null;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupDOMStructure();
            this.initializeDashboard();
        });
    }

    setupDOMStructure() {
        const container = document.getElementById('dashboard-container');
        if (!container) {
            throw new Error('Elemento "dashboard-container" não encontrado no DOM.');
        }

        // Cria a estrutura básica do DOM
        container.innerHTML = `
            <div class="container-fluid">
                <!-- Área de navegação -->
                <div id="nav-container"></div>
                
                <!-- Área principal do conteúdo -->
                <div class="row">
                    <div class="col-12">
                        <!-- Container para o componente ativo -->
                        <div id="component-container" class="mb-4"></div>
                        
                        <!-- Container para exibição de informações -->
                        <div id="info-display" class="mt-3"></div>
                        
                        <!-- Container específico para piadas -->
                        <div id="joke-display" class="mt-3"></div>
                    </div>
                </div>

                <!-- Indicador de carregamento -->
                <div id="loading" class="position-fixed top-50 start-50 translate-middle" style="display: none;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                </div>
            </div>
        `;
    }

    initializeDashboard() {
        try {
            this.dashboard = new Dashboard();
        } catch (error) {
            console.error('Erro ao inicializar o dashboard:', error.message);
            this.displayError(error.message);
        }
    }

    displayError(message) {
        const infoDisplay = document.getElementById('info-display');
        if (infoDisplay) {
            infoDisplay.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    ${message}
                </div>
            `;
        }
    }
}

// Inicializa a aplicação
const app = new App();
app.init();

