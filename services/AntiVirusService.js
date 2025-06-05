import { ApiClient } from "../core/ApiClient.js";

class AntiVirusService {
    constructor() {
        this.apiClient = new ApiClient();
        this.baseUrl = "https://api.security.microsoft.com/api";
        this.apiKey = "your_api_key_here"; // Replace with your actual API key
    }

    async getScanStatus() {
        try {
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            };

            const response = await this.apiClient.get(
                `${this.baseUrl}/machines/scanStatus`,
                { headers }
            );

            return {
                status: response.status,
                lastScan: response.lastScanDate,
                threatsFound: response.threatsFound || 0
            };
        } catch (error) {
            console.error('Error fetching scan status:', error);
            throw error;
        }
    }

    async startScan(scanType = 'quick') {
        try {
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            };

            const body = {
                scanType: scanType,
                comment: 'Scan initiated from dashboard'
            };

            const response = await this.apiClient.post(
                `${this.baseUrl}/machines/runAntiVirusScan`,
                body,
                { headers }
            );

            return {
                scanId: response.scanId,
                status: response.status,
                startTime: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error starting scan:', error);
            throw error;
        }
    }

    async getThreatReport() {
        try {
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            };

            const response = await this.apiClient.get(
                `${this.baseUrl}/machines/threats`,
                { headers }
            );

            return {
                totalThreats: response.totalThreats || 0,
                criticalThreats: response.criticalThreats || 0,
                resolvedThreats: response.resolvedThreats || 0,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error fetching threat report:', error);
            throw error;
        }
    }
}

export { AntiVirusService };