/**
 * Product Model
 * Represents a single grocery product
 */
export class Product {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.brand = data.brand || '';
        this.price = data.price || 0;
        this.originalPrice = data.originalPrice || data.price || 0;
        this.store = data.store || '';
        this.storeId = data.storeId || '';
        this.imageUrl = data.imageUrl || null;
        this.unit = data.unit || 'each';
        this.quantity = data.quantity || 1;
        this.inStock = data.inStock !== undefined ? data.inStock : true;
        this.category = data.category || '';
        this.upc = data.upc || null;
        this.sku = data.sku || null;
        this.lastUpdated = data.lastUpdated || new Date();
    }

    getPricePerUnit() {
        return this.quantity > 0 ? this.price / this.quantity : this.price;
    }

    getDiscountPercentage() {
        if (this.originalPrice <= this.price) return 0;
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }

    isOnSale() {
        return this.originalPrice > this.price;
    }

    isValid() {
        return this.name && this.price >= 0 && this.store;
    }

    toJSON() {
        return { ...this };
    }
}