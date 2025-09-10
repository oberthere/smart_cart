import { Product } from './Product.js';

/**
 * PriceComparison Model
 * Represents a comparison of prices for the same product across different stores       
 */
export class PriceComparison {
    constructor(product = []) {
        this.product = product;
        this.storePrices = new Map(); // Map of store name to price
        this.comparisonId = this.generateId();
        this.createdAt = new Date();

    }

    generateId() {
        return 'pc_' + Math.random().toString(36).substring(2, 9);
    }

    addProduct(product) {
        if (!(product instanceof Product)) {
            throw new Error('Invalid product type');
        }
        
        // Check if we already have a product from this store
        const existingIndex = this.products.findIndex(p => p.store === product.store);
        
        if (existingIndex !== -1) {
            // Replace existing product from same store
            this.products[existingIndex] = product;
        } else {
            // Add new product
            this.products.push(product);
        }
        
        // Update the map
        this.storePriceMap.set(product.store, product);
    }

    /**
     * Get product by store name
     */
    getProductByStore(storeName) {
        return this.storePriceMap.get(storeName) || null;
    }

    /**
     * Get price for a specific store
     */
    getPriceByStore(storeName) {
        const product = this.storePriceMap.get(storeName);
        return product ? product.price : null;
    }

    /**
     * Check if a store has this product
     */
    hasStore(storeName) {
        return this.storePriceMap.has(storeName);
    }

    /**
     * Get all participating stores
     */
    getStores() {
        return Array.from(this.storePriceMap.keys());
    }

    /**
     * Get price range statistics
     */
    getPriceStats() {
        if (this.products.length === 0) {
            return {
                min: 0,
                max: 0,
                average: 0,
                median: 0,
                range: 0
            };
        }

        const prices = this.products.map(p => p.price).sort((a, b) => a - b);
        const sum = prices.reduce((acc, price) => acc + price, 0);
        const mid = Math.floor(prices.length / 2);

        return {
            min: prices[0],
            max: prices[prices.length - 1],
            average: sum / prices.length,
            median: prices.length % 2 === 0 
                ? (prices[mid - 1] + prices[mid]) / 2 
                : prices[mid],
            range: prices[prices.length - 1] - prices[0]
        };
    }

    /**
     * Get a comparison summary
     */
    getComparisonSummary() {
        const cheapest = this.getCheapestProduct();
        const mostExpensive = this.getMostExpensiveProduct();
        const stats = this.getPriceStats();

        return {
            productName: this.products[0]?.name || 'Unknown Product',
            storeCount: this.storePriceMap.size,
            priceRange: `$${stats.min.toFixed(2)} - $${stats.max.toFixed(2)}`,
            averagePrice: `$${stats.average.toFixed(2)}`,
            bestDeal: cheapest ? {
                store: cheapest.store,
                price: cheapest.price,
                savings: this.getPotentialSavings()
            } : null,
            worstDeal: mostExpensive ? {
                store: mostExpensive.store,
                price: mostExpensive.price
            } : null,
            stores: this.getStoreBreakdown()
        };
    }

    /**
     * Get detailed breakdown by store
     */
    getStoreBreakdown() {
        const breakdown = {};
        const cheapestPrice = this.getCheapestProduct()?.price || 0;

        this.storePriceMap.forEach((product, store) => {
            breakdown[store] = {
                price: product.price,
                priceFormatted: `$${product.price.toFixed(2)}`,
                inStock: product.inStock,
                isOnSale: product.isOnSale(),
                discountPercentage: product.getDiscountPercentage(),
                differenceFromBest: product.price - cheapestPrice,
                percentageAboveBest: cheapestPrice > 0 
                    ? ((product.price - cheapestPrice) / cheapestPrice * 100).toFixed(1)
                    : 0
            };
        });

        return breakdown;
    }

    getCheapestProduct() {
        if (this.products.length === 0) return null;
        return this.products.reduce((min, product) => 
            product.price < min.price ? product : min
        );
    }

    getMostExpensiveProduct() {
        if (this.products.length === 0) return null;
        return this.products.reduce((max, product) => 
            product.price > max.price ? product : max
        );
    }

    getPotentialSavings() {
        const cheapest = this.getCheapestProduct();
        const mostExpensive = this.getMostExpensiveProduct();
        if (!cheapest || !mostExpensive) return 0;
        return mostExpensive.price - cheapest.price;
    }

    getProductsSortedByPrice(ascending = true) {
        return [...this.products].sort((a, b) => 
            ascending ? a.price - b.price : b.price - a.price
        );
    }

    /**
     * Convert to JSON for storage/transmission
     */
    toJSON() {
        return {
            comparisonId: this.comparisonId,
            createdAt: this.createdAt,
            products: this.products.map(p => p.toJSON()),
            summary: this.getComparisonSummary()
        };
    }
}