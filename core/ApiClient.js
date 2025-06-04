class ApiClient {
    constructor(options = {}) {
        this.timeout = options.timeout || 5000;
        this.retries = options.retries || 0;
    }

    async get(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    ...options.headers
                },
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${this.timeout}ms`);
            }
            
            if (this.retries > 0) {
                this.retries--;
                return this.get(url, options);
            }

            throw new Error(`API request failed: ${error.message}`);

        } finally {
            clearTimeout(timeoutId);
        }
    }
}

export { ApiClient };