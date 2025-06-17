import PlantAPI from './modules/api.js';
import StorageManager from './modules/storage.js';
import PlantDetailsDialog from './modules/plant-details-dialog.js';

class PlantPlanner {    constructor() {
        this.api = new PlantAPI();
        this.storage = new StorageManager();
        this.plantDetailsDialog = new PlantDetailsDialog();
        this.currentPlants = [];
        this.currentFilters = {};
        
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // Navigation
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        
        // Location selection
        this.geolocationBtn = document.getElementById('geolocation-btn');
        this.climateSelect = document.getElementById('climate-zone');
        
        // Filters
        this.filtersSection = document.getElementById('filters-section');
        this.plantTypeSelect = document.getElementById('plant-type');
        this.difficultySelect = document.getElementById('difficulty');
        this.seasonSelect = document.getElementById('season');
        this.searchInput = document.getElementById('search-plants');
        
        // Results
        this.resultsSection = document.getElementById('plants-results');
        this.resultsCount = document.getElementById('results-count');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorMessage = document.getElementById('error-message');
        this.plantsGrid = document.getElementById('plants-grid');
    }

    attachEventListeners() {
        // Navigation
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Location selection
        if (this.geolocationBtn) {
            this.geolocationBtn.addEventListener('click', () => this.requestGeolocation());
        }

        if (this.climateSelect) {
            this.climateSelect.addEventListener('change', (e) => this.handleClimateSelection(e.target.value));
        }

        // Filters
        [this.plantTypeSelect, this.difficultySelect, this.seasonSelect].forEach(select => {
            if (select) {
                select.addEventListener('change', () => this.applyFilters());
            }
        });

        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.debounce(() => this.applyFilters(), 300));
        }
    }

    // Navigation methods
    toggleMobileMenu() {
        this.navLinks.classList.toggle('active');
        const isExpanded = this.navLinks.classList.contains('active');
        this.menuToggle.setAttribute('aria-expanded', isExpanded);
        
        const icon = this.menuToggle.querySelector('.material-icons');
        icon.textContent = isExpanded ? 'close' : 'menu';
    }

    // Geolocation methods
    async requestGeolocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        this.geolocationBtn.disabled = true;
        this.geolocationBtn.innerHTML = '<span class="material-icons">hourglass_empty</span> Getting Location...';

        try {
            const position = await this.getCurrentPosition();
            const climateZone = await this.getClimateZoneFromCoords(position.coords.latitude, position.coords.longitude);
            
            this.climateSelect.value = climateZone;
            this.handleClimateSelection(climateZone);
            
        } catch (error) {
            console.error('Geolocation error:', error);
            this.showError('Unable to get your location. Please select manually.');
        } finally {
            this.geolocationBtn.disabled = false;
            this.geolocationBtn.innerHTML = '<span class="material-icons">my_location</span> Use My Location';
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000
            });
        });
    }

    async getClimateZoneFromCoords(lat, lng) {
        if (lat > 40) return 'cold';
        if (lat > 30) return 'temperate';
        if (lat > 20) return 'subtropical';
        if (lat > -20) return 'tropical';
        return 'temperate';
    }

    async handleClimateSelection(climateZone) {
        if (!climateZone) return;

        this.currentFilters = { climateZone };
        this.showFilters();
        await this.loadPlants();
    }

    showFilters() {
        this.filtersSection.classList.remove('hidden');
    }

    async loadPlants() {
        this.showLoading();
        this.hideError();

        try {
            this.currentPlants = await this.api.fetchPlants(this.currentFilters);
            this.displayPlants(this.currentPlants);
            this.showResults();
        } catch (error) {
            console.error('Error loading plants:', error);
            this.showError('Failed to load plant recommendations. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    async applyFilters() {
        const filters = {
            ...this.currentFilters,
            plantType: this.plantTypeSelect?.value || '',
            difficulty: this.difficultySelect?.value || '',
            season: this.seasonSelect?.value || '',
            search: this.searchInput?.value || ''
        };

        Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
        });

        this.currentFilters = filters;
        await this.loadPlants();
    }

    displayPlants(plants) {
        if (!plants || plants.length === 0) {
            this.plantsGrid.innerHTML = '<p class="no-results">No plants found matching your criteria.</p>';
            this.updateResultsCount(0);
            return;
        }

        this.plantsGrid.innerHTML = plants.map(plant => this.createPlantCard(plant)).join('');
        this.updateResultsCount(plants.length);
        
        this.attachPlantCardListeners();
    }

    createPlantCard(plant) {
        const isSaved = this.storage.isPlantSaved(plant.id);
        
        return `
            <div class="plant-card" data-plant-id="${plant.id}">
                <div class="plant-image">
                    ${plant.imageUrl ? 
                        `<img src="${plant.imageUrl}" alt="${plant.commonName}" loading="lazy">` :
                        '<span class="material-icons">local_florist</span>'
                    }
                </div>
                <div class="plant-info">
                    <h4>${plant.commonName}</h4>
                    <p class="plant-scientific">${plant.scientificName}</p>                    <div class="plant-details">
                        <div class="plant-detail">
                            <span class="emoji-icon">🏷️</span>
                            <span>${this.capitalizeFirst(plant.plantType)}</span>
                        </div>
                        <div class="plant-detail">
                            <span class="emoji-icon">📈</span>
                            <span>${this.capitalizeFirst(plant.difficulty)}</span>
                        </div>
                        <div class="plant-detail">
                            <span class="emoji-icon">☀️</span>
                            <span>${plant.sunRequirements}</span>
                        </div>
                        <div class="plant-detail">
                            <span class="emoji-icon">💧</span>
                            <span>${plant.wateringFrequency}</span>
                        </div>
                    </div>
                    <div class="plant-actions">
                        <button class="btn-save ${isSaved ? 'saved' : ''}" data-plant-id="${plant.id}">
                            <span class="material-icons">${isSaved ? 'bookmark' : 'bookmark_border'}</span>
                            ${isSaved ? 'Saved' : 'Save'}
                        </button>
                        <button class="btn-details" data-plant-id="${plant.id}">
                            <span class="material-icons">info</span>
                            Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachPlantCardListeners() {
        document.querySelectorAll('.btn-save').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSavePlant(e));
        });

        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleShowDetails(e));
        });
    }    handleSavePlant(e) {
        const plantId = parseInt(e.target.closest('button').dataset.plantId);
        const plant = this.currentPlants.find(p => p.id === plantId);
        
        if (!plant) return;

        const isCurrentlySaved = this.storage.isPlantSaved(plantId);
        
        if (isCurrentlySaved) {
            const success = this.storage.removePlant(plantId);
            if (success) {
                e.target.closest('button').classList.remove('saved');
                e.target.closest('button').innerHTML = '<span class="material-icons">bookmark_border</span> Save';
                this.showSuccessMessage('Plant removed from your garden!');
            }
        } else {
            const success = this.storage.savePlant(plant);
            if (success) {
                e.target.closest('button').classList.add('saved');
                e.target.closest('button').innerHTML = '<span class="material-icons">bookmark</span> Saved';
                this.showSuccessMessage('Plant saved to your garden!');
            }
        }
    }    handleShowDetails(e) {
        const plantId = parseInt(e.target.closest('button').dataset.plantId);
        const plant = this.currentPlants.find(p => p.id === plantId);
        
        if (plant) {
            this.plantDetailsDialog.show(plant, (plantToSave) => {
                const isCurrentlySaved = this.storage.isPlantSaved(plantToSave.id);
                
                if (isCurrentlySaved) {
                    const success = this.storage.removePlant(plantToSave.id);
                    if (success) {
                        this.showSuccessMessage('Plant removed from your garden!');
                        this.updateSaveButtonState(plantId);
                    }
                } else {
                    const success = this.storage.savePlant(plantToSave);
                    if (success) {
                        this.showSuccessMessage('Plant saved to your garden!');
                        this.updateSaveButtonState(plantId);
                    }
                }
            });
        }
    }

    showLoading() {
        this.loadingIndicator.classList.remove('hidden');
        this.plantsGrid.innerHTML = '';
    }

    hideLoading() {
        this.loadingIndicator.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.querySelector('p').textContent = message;
        this.errorMessage.classList.remove('hidden');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    showResults() {
        this.resultsSection.classList.remove('hidden');
    }

    updateResultsCount(count) {
        this.resultsCount.textContent = count;
    }    updateSaveButtonState(plantId) {
        const saveBtn = document.querySelector(`[data-plant-id="${plantId}"].btn-save`);
        if (saveBtn) {
            const isCurrentlySaved = this.storage.isPlantSaved(plantId);
            
            if (isCurrentlySaved) {
                saveBtn.classList.add('saved');
                saveBtn.innerHTML = '<span class="material-icons">bookmark</span> Saved';
            } else {
                saveBtn.classList.remove('saved');
                saveBtn.innerHTML = '<span class="material-icons">bookmark_border</span> Save';
            }
        }
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <span class="material-icons">check_circle</span>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PlantPlanner();
});
