import { ApiClient } from '../core/ApiClient.js';

class CountriesService {
    constructor() {
        this.apiClient = new ApiClient();
        this.baseUrl = 'https://restcountries.com/v3.1';
    }
    
    async getAllCountries() {
        const url = `${this.baseUrl}/all?fields=name,capital,population,flags,cca2`;
        return await this.apiClient.get(url);
    }
    
    async getCountryByName(name) {
        const url = `${this.baseUrl}/name/${encodeURIComponent(name)}`;
        return await this.apiClient.get(url);
    }
    
    async getCountryByCode(code) {
        const url = `${this.baseUrl}/alpha/${code}`;
        return await this.apiClient.get(url);
    }
    
    async getCountriesByRegion(region) {
        const url = `${this.baseUrl}/region/${encodeURIComponent(region)}`;
        return await this.apiClient.get(url);
    }
    
    async getCountriesByLanguage(language) {
        // A API não suporta diretamente busca por idioma, então precisamos filtrar os resultados
        const countries = await this.getAllCountries();
        return countries.filter(country => {
            if (country.languages) {
                return Object.values(country.languages).some(lang => 
                    lang.toLowerCase().includes(language.toLowerCase())
                );
            }
            return false;
        });
    }
    
    async getCountriesByCurrency(currency) {
        // A API não suporta diretamente busca por moeda, então precisamos filtrar os resultados
        const countries = await this.getAllCountries();
        return countries.filter(country => {
            if (country.currencies) {
                return Object.keys(country.currencies).some(curr => 
                    curr.toLowerCase().includes(currency.toLowerCase())
                );
            }
            return false;
        });
    }
}

export { CountriesService };