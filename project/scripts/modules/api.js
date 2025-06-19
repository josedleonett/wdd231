const API_CONFIG = {
    GBIF_API_URL: 'https://api.gbif.org/v1',
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
            limit: 20,
            ...this.buildAPIFilters(filters)
        });

        const response = await fetch(`${API_CONFIG.GBIF_API_URL}/species/search?${params}`);
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const processedData = this.processAPIData(data.results);
        
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
        const apiFilters = {
            rank: "SPECIES",
            highertaxonKey: "6" // Plants kingdom taxon key in GBIF
        };
        
        if (filters.search) {
            apiFilters.q = filters.search;
        }

        if (filters.plantType) {
            const taxonomyMapping = {
                'vegetable': 'Vegetables',
                'herb': 'Herbs',
                'flower': 'Flowering plants',
                'fruit': 'Fruits',
                'tree': 'Trees'
            };
            
            if (taxonomyMapping[filters.plantType]) {
                apiFilters.q = apiFilters.q ? 
                    `${apiFilters.q} ${taxonomyMapping[filters.plantType]}` : 
                    taxonomyMapping[filters.plantType];
            }
        }

        return apiFilters;
    }

    async fetchSpeciesDetails(speciesKey) {
        try {
            const response = await fetch(`${API_CONFIG.GBIF_API_URL}/species/${speciesKey}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch species details: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching species details:', error);
            return null;
        }
    }

    async fetchSpeciesImage(scientificName) {
        try {
            const encodedName = encodeURIComponent(scientificName);
            const response = await fetch(
                `${API_CONFIG.GBIF_API_URL}/occurrence/search?scientificName=${encodedName}&mediaType=StillImage&limit=1`
            );
            
            if (!response.ok) {
                throw new Error(`Failed to fetch images: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.results && data.results.length > 0 && data.results[0].media) {
                const media = data.results[0].media.find(m => m.type === 'StillImage');
                return media ? media.identifier : null;
            }
            return null;
        } catch (error) {
            console.error('Error fetching species image:', error);
            return null;
        }
    }

    processAPIData(species) {
        return Promise.all(species.map(async (species) => {
            const imageUrl = await this.fetchSpeciesImage(species.scientificName);
            
            return {
                id: species.key,
                commonName: species.vernacularName || species.canonicalName || 'Unknown',
                scientificName: species.scientificName || '',
                imageUrl: imageUrl,
                plantType: this.determinePlantType(species),
                difficulty: this.determineDifficulty(species),
                season: this.determineSeason(species),
                wateringFrequency: 'Moderate',
                sunRequirements: 'Full sun',
                description: `${species.scientificName} is a species of the ${species.genus} genus in the ${species.family} family.`,
                careInstructions: this.generateCareInstructions(species)
            };
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

    determinePlantType(species) {
        const name = species.vernacularName?.toLowerCase() || species.canonicalName?.toLowerCase() || '';
        
        if (name.includes('tomato') || name.includes('lettuce') || name.includes('carrot')) return 'vegetable';
        if (name.includes('basil') || name.includes('mint') || name.includes('oregano')) return 'herb';
        if (name.includes('rose') || name.includes('tulip') || name.includes('daisy')) return 'flower';
        if (name.includes('apple') || name.includes('orange') || name.includes('berry')) return 'fruit';
        if (name.includes('oak') || name.includes('pine') || name.includes('maple')) return 'tree';
        
        // Check family and order info
        if (species.family === 'Poaceae' || species.family === 'Rosaceae') return 'herb';
        if (species.order === 'Rosales') return 'flower';
        
        return 'other';
    }

    determineDifficulty(species) {
        const common = ['tomato', 'lettuce', 'basil', 'mint', 'marigold'];
        const name = species.vernacularName?.toLowerCase() || '';
        
        if (common.some(c => name.includes(c))) return 'easy';
        return Math.random() > 0.5 ? 'moderate' : 'challenging';
    }

    determineSeason(species) {
        const seasons = ['spring', 'summer', 'fall'];
        return [seasons[Math.floor(Math.random() * seasons.length)]];
    }

    generateCareInstructions(species) {
        return `Water regularly and provide adequate sunlight. Monitor for pests and diseases.`;
    }
}

export default PlantAPI;
