const API_CONFIG = {
    TREFLE_TOKEN: 'ckC5oFHH4Z9J1O0R9gw14s1PuyhQZerUJCKc4IGWmWc',
    BASE_URL: 'https://trefle.io/api/v1',
    FALLBACK_DATA_URL: './data/fallback-plants.json'
};

class PlantAPI {
    constructor() {
        this.cache = new Map();
        this.fallbackData = null;
    }

    async fetchPlants(filters = {}) {
        try {
            const apiData = await this.fetchFromAPI(filters);
            return apiData;
        } catch (error) {
            console.warn('API fetch failed, using fallback data:', error);
            return await this.fetchFallbackData(filters);
        }
    }

    async fetchFromAPI(filters) {
        const cacheKey = JSON.stringify(filters);
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const params = new URLSearchParams({
            token: API_CONFIG.TREFLE_TOKEN,
            page_size: 20,
            ...this.buildAPIFilters(filters)
        });

        const response = await fetch(`${API_CONFIG.BASE_URL}/plants?${params}`);
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const processedData = this.processAPIData(data.data);
        
        this.cache.set(cacheKey, processedData);
        return processedData;
    }

    // Fetch fallback data
    async fetchFallbackData(filters) {
        if (!this.fallbackData) {
            const response = await fetch(API_CONFIG.FALLBACK_DATA_URL);
            if (!response.ok) {
                throw new Error('Failed to load fallback data');
            }
            this.fallbackData = await response.json();
        }

        return this.filterFallbackData(this.fallbackData, filters);
    }

    buildAPIFilters(filters) {
        const apiFilters = {};
        
        if (filters.climateZone) {
            const zoneMapping = {
                'tropical': 'tropical',
                'subtropical': 'subtropical', 
                'temperate': 'temperate',
                'cold': 'cold',
                'arid': 'dry',
                'mediterranean': 'mediterranean'
            };
            apiFilters.filter_climate = zoneMapping[filters.climateZone];
        }

        if (filters.plantType) {
            apiFilters.filter_category = filters.plantType;
        }

        return apiFilters;
    }

    processAPIData(plants) {
        return plants.map(plant => ({
            id: plant.id,
            commonName: plant.common_name || 'Unknown',
            scientificName: plant.scientific_name || '',
            imageUrl: plant.image_url || null,
            plantType: this.determinePlantType(plant),
            difficulty: this.determineDifficulty(plant),
            season: this.determineSeason(plant),
            wateringFrequency: plant.main_species?.specifications?.average_height || 'Moderate',
            sunRequirements: plant.main_species?.growth?.light || 'Full sun',
            description: plant.main_species?.specifications?.toxicity || 'No description available',
            careInstructions: this.generateCareInstructions(plant)
        }));
    }

    filterFallbackData(data, filters) {
        let filtered = [...data];

        if (filters.climateZone) {
            filtered = filtered.filter(plant => 
                plant.climateZones?.includes(filters.climateZone)
            );
        }

        if (filters.plantType) {
            filtered = filtered.filter(plant => 
                plant.plantType === filters.plantType
            );
        }

        if (filters.difficulty) {
            filtered = filtered.filter(plant => 
                plant.difficulty === filters.difficulty
            );
        }

        if (filters.season) {
            filtered = filtered.filter(plant => 
                plant.season?.includes(filters.season)
            );
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(plant => 
                plant.commonName.toLowerCase().includes(searchTerm) ||
                plant.scientificName.toLowerCase().includes(searchTerm)
            );
        }

        return filtered;
    }

    determinePlantType(plant) {
        const name = plant.common_name?.toLowerCase() || '';
        if (name.includes('tomato') || name.includes('lettuce') || name.includes('carrot')) return 'vegetable';
        if (name.includes('basil') || name.includes('mint') || name.includes('oregano')) return 'herb';
        if (name.includes('rose') || name.includes('tulip') || name.includes('daisy')) return 'flower';
        if (name.includes('apple') || name.includes('orange') || name.includes('berry')) return 'fruit';
        if (name.includes('oak') || name.includes('pine') || name.includes('maple')) return 'tree';
        return 'other';
    }

    determineDifficulty(plant) {
        const common = ['tomato', 'lettuce', 'basil', 'mint', 'marigold'];
        const name = plant.common_name?.toLowerCase() || '';
        
        if (common.some(c => name.includes(c))) return 'easy';
        return Math.random() > 0.5 ? 'moderate' : 'challenging';
    }

    determineSeason(plant) {
        const seasons = ['spring', 'summer', 'fall'];
        return [seasons[Math.floor(Math.random() * seasons.length)]];
    }

    generateCareInstructions(plant) {
        return `Water regularly and provide adequate sunlight. Monitor for pests and diseases.`;
    }
}

export default PlantAPI;
