import { ApiClient } from '../core/ApiClient.js';

class CountriesService {
    constructor() {
        this.apiClient = new ApiClient();
        this.baseUrl = 'https://restcountries.com/v3.1'; // Corrigido: sem espaço no início
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

    async getIndependentCountries() {
        const url = `${this.baseUrl}/independent?status=true&fields=languages,capital`;
        return await this.apiClient.get(url);
    }

    async getCountriesWithNameAndFlags() {
        const url = `${this.baseUrl}/all?fields=name,flags`;
        return await this.apiClient.get(url);
    }
}

export { CountriesService };

export async function getCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    console.log('Resposta da API de países:', data); // Adicione esta linha para depuração
    if (!Array.isArray(data)) {
        throw new Error('Resposta inesperada da API de países');
    }
    return data.map(country => ({
        name: country.name.common
    }));
}