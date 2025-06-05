import { AntiVirusService } from "../../services/AntiVirusService.js";

class CardAntivirus {
    constructor() {
        this.antiVirusService = new AntiVirusService();
        this.updateInterval = null;
    }

    async render(container) {
        try {
            const scanStatus = await this.antiVirusService.getScanStatus();
            
            container.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="fas fa-shield-alt"></i> Status do Sistema
                            <small class="text-muted float-end">
                                <i class="fas fa-sync-alt"></i> Atualização: 30s
                            </small>
                        </h5>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="p-3 border rounded">
                                    <h6>Status da Varredura</h6>
                                    <div class="d-flex align-items-center mb-2">
                                        <span class="badge ${scanStatus.status === 'clean' ? 'bg-success' : 'bg-warning'} me-2">
                                            ${scanStatus.status === 'clean' ? 'Seguro' : 'Atenção'}
                                        </span>
                                        <span class="text-muted small">
                                            Última verificação: ${new Date(scanStatus.lastScan).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 border rounded">
                                    <h6>Ameaças Detectadas</h6>
                                    <div class="text-center">
                                        <h3 class="${scanStatus.threatsFound > 0 ? 'text-danger' : 'text-success'}">
                                            ${scanStatus.threatsFound}
                                        </h3>
                                        <small class="text-muted">Total de ameaças</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <button id="start-scan" class="btn btn-primary me-2">
                                    <i class="fas fa-play"></i> Iniciar Varredura
                                </button>
                                <button id="update-now" class="btn btn-outline-secondary">
                                    <i class="fas fa-sync"></i> Atualizar Agora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            this.setupEventListeners(container);
            this.setupAutoRefresh(container);

        } catch (error) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i>
                    Erro ao carregar status do sistema: ${error.message}
                </div>
            `;
        }
    }

    setupEventListeners(container) {
        const scanButton = container.querySelector('#start-scan');
        const updateButton = container.querySelector('#update-now');

        scanButton?.addEventListener('click', async () => {
            try {
                scanButton.disabled = true;
                await this.antiVirusService.startScan();
                await this.render(container);
            } catch (error) {
                console.error('Erro ao iniciar varredura:', error);
            } finally {
                scanButton.disabled = false;
            }
        });

        updateButton?.addEventListener('click', async () => {
            try {
                updateButton.disabled = true;
                await this.render(container);
            } finally {
                updateButton.disabled = false;
            }
        });
    }

    setupAutoRefresh(container) {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            this.render(container);
        }, 30000); // Atualiza a cada 30 segundos
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

export { CardAntivirus };