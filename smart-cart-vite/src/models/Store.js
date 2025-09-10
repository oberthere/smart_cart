/**
 * Store Model
 * Represents a grocery store configuration
 */
export class Store {
    constructor(data = {}) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.displayName = data.displayName || data.name || '';
        this.apiEndpoint = data.apiEndpoint || '';
        this.apiKey = data.apiKey || '';
        this.logoUrl = data.logoUrl || '';
        this.color = data.color || '#666';
        this.icon = data.icon || 'icon-store';
        this.isActive = data.isActive !== undefined ? data.isActive : true;
    }

    getAPIConfig() {
        return {
            endpoint: this.apiEndpoint,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            }
        };
    }

    toJSON() {
        return {   
            id: this.id,
            name: this.name,
            displayName: this.displayName,
            color: this.color,
            icon: this.icon,
            isActive: this.isActive
        };
    }
}