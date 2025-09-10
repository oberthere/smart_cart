/**
 * Base API Service
 * Abstract base class for all store API services
 * Provides common functionality for making API requests        
 */ 
export class BaseAPIService {
    constructor(store) {
        if (new.target === BaseAPIService) {
            throw new Error('BaseAPIService is abstract and cannot be instantiated directly');
        }
        this.store = store;
        this.baseURL = store.apiEndpoint;
        this.headers = store.getAPIConfig().headers;
        this.cache = new Map(); // Simple in-memory cache
        this.cacheTTL = 5 * 60 * 1000; // 5 minutes   
        this.apiKey = store.apiKey || null;
    }

    async searchProducts(query, options = {}) {
        throw new Error('searchProducts method must be implemented by subclass');
    }

    async getProductById(productId) {
        throw new Error('getProductById method must be implemented by subclass');
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.headers,
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error for ${this.store.name}:`, error);
            throw error;
        }

    }

    async getCachedOrFetch(key, fetchFunction) {
        const cached = this.cache.get(key);

        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            console.log(`Cache hit for: ${key}`);
            return cached.data;
        }

        console.log(`Cache miss for: ${key}, fetching...`);
        const data = await fetchFunction();
        
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });

        return data;
    }

    clearCache() {
        this.cache.clear();
    }

    /**
     * Transform raw API response to Product model
     * Override in subclasses for specific transformations
     */
    transformToProduct(rawData) {
        throw new Error('transformToProduct() must be implemented by subclass');
    }
}