import { ApiClient } from "../core/ApiClient.js";

class BlockchainService {
    constructor() {
        this.apiClient = new ApiClient();
        this.baseUrl = "https://api.api-ninjas.com/v1/cryptoprice";
        this.apiKey = "+eIq63qTg81XySfzQR4Dmw==nSW5wqUkPVR23AK0";
    }

    async getCryptoPrice(symbol = 'BTC') {
        try {
            const headers = {
                'X-Api-Key': this.apiKey
            };

            const response = await this.apiClient.get(
                `${this.baseUrl}?symbol=${symbol}USD`,
                { headers }
            );

            if (!response || !response.price) {
                throw new Error(`Preço não encontrado para ${symbol}`);
            }

            return {
                symbol: symbol,
                price: parseFloat(response.price).toFixed(2),
                currency: 'USD'
            };
        } catch (error) {
            console.error('Erro ao buscar preço da criptomoeda:', error);
            throw error;
        }
    }

    async getMultiplePrices() {
        const cryptoSymbols = [
            'BTC',  // Bitcoin
            'ETH',  // Ethereum
            'BNB',  // Binance Coin
            'XRP',  // Ripple
            'ADA',  // Cardano
            'DOGE', // Dogecoin
            'SOL',  // Solana
            'DOT',  // Polkadot
            'SHIB', // Shiba Inu
            'MATIC', // Polygon
            'AVAX', // Avalanche
            'LTC',  // Litecoin
            'LINK', // Chainlink
            'UNI',  // Uniswap
            'ATOM', // Cosmos
            'XLM',  // Stellar
            'ALGO', // Algorand
            'VET',  // VeChain
            'MANA', // Decentraland
            'SAND'  // The Sandbox
        ];

        try {
            const prices = await Promise.all(
                cryptoSymbols.map(symbol => this.getCryptoPrice(symbol))
            );
            return prices;
        } catch (error) {
            console.error('Erro ao buscar múltiplos preços:', error);
            throw error;
        }
    }
}

export { BlockchainService };