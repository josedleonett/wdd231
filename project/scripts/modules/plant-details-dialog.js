import StorageManager from './storage.js';

class PlantDetailsDialog {
    constructor() {
        this.storage = new StorageManager();
        this.dialog = document.getElementById('plant-details-dialog');
        this.plantName = document.getElementById('details-plant-name');
        this.scientificName = document.getElementById('details-scientific-name');
        this.description = document.getElementById('details-description');
        this.careInstructions = document.getElementById('details-care-instructions');
        this.type = document.getElementById('details-type');
        this.difficulty = document.getElementById('details-difficulty');
        this.sun = document.getElementById('details-sun');
        this.watering = document.getElementById('details-watering');
        this.closeBtn = document.getElementById('details-close');
        this.cancelBtn = document.getElementById('details-cancel');
        this.saveBtn = document.getElementById('details-save');
        
        this.currentPlant = null;
        this.onSave = null;
        this.init();
    }

    init() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.close());
        }

        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.save());
        }

        if (this.dialog) {
            this.dialog.addEventListener('cancel', () => this.close());
        }
    }

    show(plant, onSaveCallback = null) {
        this.currentPlant = plant;
        this.onSave = onSaveCallback;
        
        if (this.plantName) {
            this.plantName.textContent = plant.commonName || 'Unknown Plant';
        }
        
        if (this.scientificName) {
            this.scientificName.textContent = plant.scientificName || 'Unknown species';
        }
        
        if (this.description) {
            this.description.textContent = plant.description || 'No description available';
        }
        
        if (this.careInstructions) {
            this.careInstructions.textContent = plant.careInstructions || 'No care instructions available';
        }
        
        if (this.type) {
            this.type.textContent = this.capitalizeFirst(plant.plantType) || 'Unknown';
        }
        
        if (this.difficulty) {
            this.difficulty.textContent = this.capitalizeFirst(plant.difficulty) || 'Unknown';
        }
        
        if (this.sun) {
            this.sun.textContent = plant.sunRequirements || 'Full sun';
        }
          if (this.watering) {
            this.watering.textContent = plant.wateringFrequency || 'Regular';
        }
          // Update save button based on current state
        if (this.saveBtn) {
            const isCurrentlySaved = this.storage.isPlantSaved(plant.id);
            if (isCurrentlySaved) {
                this.saveBtn.innerHTML = '<span class="material-icons">bookmark_remove</span> Remove Plant';
                this.saveBtn.className = 'dialog-btn secondary remove';
            } else {
                this.saveBtn.innerHTML = '<span class="material-icons">bookmark_add</span> Save Plant';
                this.saveBtn.className = 'dialog-btn primary';
            }
        }
        
        if (this.dialog) {
            this.dialog.showModal();
            this.closeBtn?.focus();
        }
    }

    close() {
        if (this.dialog) {
            this.dialog.close();
        }
    }

    save() {
        if (this.currentPlant && this.onSave) {
            this.onSave(this.currentPlant);
        }
        this.close();
    }

    capitalizeFirst(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    }
}

export default PlantDetailsDialog;
