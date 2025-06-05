import { BlockchainService } from "../../services/BlockchainService.js";

class CardBlockchain {
    constructor() {
        this.blockchainService = new BlockchainService();
        this.updateInterval = null;
    }

    async render(container) {
        try {
            const prices = await this.blockchainService.getMultiplePrices();
            
            container.innerHTML = `
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="fas fa-coins"></i> Criptomoedas
                            <small class="text-muted float-end">
                                <i class="fas fa-sync-alt"></i> Atualização: 30s
                            </small>
                        </h5>
                        <div class="table-responsive" style="max-height: 500px; overflow-y: auto;">
                            <table class="table table-hover table-sm">
                                <thead class="sticky-top bg-light">
                                    <tr>
                                        <th>Moeda</th>
                                        <th class="text-end">Preço (USD)</th>
                                        <th class="text-end">Variação 24h</th>
                                    </tr>
                                </thead>
                                <tbody id="crypto-prices">
                                    ${this.renderPricesRows(prices)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

            // Setup auto-refresh
            this.setupAutoRefresh(container);

        } catch (error) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i>
                    Erro ao carregar preços das criptomoedas
                </div>
            `;
        }
    }

    renderPricesRows(prices) {
        return prices.map(crypto => {
            const priceChange = Math.random() * 10 - 5; // Simulated 24h change
            const changeClass = priceChange >= 0 ? 'text-success' : 'text-danger';
            const changeIcon = priceChange >= 0 ? '▲' : '▼';
            
            return `
                <tr>
                    <td>
                        <strong>${crypto.symbol}</strong>
                    </td>
                    <td class="text-end">
                        $${Number(crypto.price).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </td>
                    <td class="text-end ${changeClass}">
                        ${changeIcon} ${Math.abs(priceChange).toFixed(2)}%
                    </td>
                </tr>
            `;
        }).join('');
    }

    setupAutoRefresh(container) {
        // Clear existing interval if any
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        // Update prices every 30 seconds
        this.updateInterval = setInterval(async () => {
            try {
                const prices = await this.blockchainService.getMultiplePrices();
                const tbody = container.querySelector('#crypto-prices');
                if (tbody) {
                    tbody.innerHTML = this.renderPricesRows(prices);
                }
            } catch (error) {
                console.error('Erro na atualização automática:', error);
            }
        }, 30000); // 30 seconds
    }

    // Cleanup method to clear interval when component is destroyed
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

export { CardBlockchain };