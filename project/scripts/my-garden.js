import StorageManager from './modules/storage.js';
import Modal from './modules/modal.js';
import ConfirmDialog from './modules/confirm-dialog.js';

class MyGarden {    constructor() {
        this.storage = new StorageManager();
        this.modal = new Modal('plant-modal');
        this.confirmDialog = new ConfirmDialog();
        this.currentPlantId = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadGardenData();
    }

    initializeElements() {
        // Navigation
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        
        // Stats
        this.totalPlantsEl = document.getElementById('total-plants');
        this.pendingTasksEl = document.getElementById('pending-tasks');
        this.recentPlantsEl = document.getElementById('recent-plants');
        
        // Form
        this.addPlantForm = document.getElementById('add-plant-form');
        
        // Plants display
        this.emptyState = document.getElementById('empty-state');
        this.savedPlantsGrid = document.getElementById('saved-plants-grid');
        
        // Actions
        this.exportBtn = document.getElementById('export-data');
        this.clearAllBtn = document.getElementById('clear-all');
        
        // Modal elements
        this.modalPlantName = document.getElementById('modal-plant-name');
        this.modalPlantScientific = document.getElementById('modal-plant-scientific');
        this.modalPlantType = document.getElementById('modal-plant-type');
        this.modalPlantDifficulty = document.getElementById('modal-plant-difficulty');
        this.modalPlantWatering = document.getElementById('modal-plant-watering');
        this.modalPlantSun = document.getElementById('modal-plant-sun');
        this.modalCareInstructions = document.getElementById('modal-care-instructions');
        this.modalNotes = document.getElementById('modal-notes');
        this.remindersList = document.getElementById('reminders-list');
        this.newReminderInput = document.getElementById('new-reminder');
    }

    attachEventListeners() {
        // Navigation
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Form submission
        if (this.addPlantForm) {
            this.addPlantForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Action buttons
        if (this.exportBtn) {
            this.exportBtn.addEventListener('click', () => this.exportData());
        }

        if (this.clearAllBtn) {
            this.clearAllBtn.addEventListener('click', () => this.clearAllData());
        }

        // Modal tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Modal actions
        const saveNotesBtn = document.getElementById('save-notes');
        if (saveNotesBtn) {
            saveNotesBtn.addEventListener('click', () => this.saveNotes());
        }

        const addReminderBtn = document.getElementById('add-reminder-btn');
        if (addReminderBtn) {
            addReminderBtn.addEventListener('click', () => this.addReminder());
        }

        const removePlantBtn = document.getElementById('remove-plant');
        if (removePlantBtn) {
            removePlantBtn.addEventListener('click', () => this.removePlantFromModal());
        }

        if (this.newReminderInput) {
            this.newReminderInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.addReminder();
                }
            });
        }
    }

    toggleMobileMenu() {
        this.navLinks.classList.toggle('active');
        const isExpanded = this.navLinks.classList.contains('active');
        this.menuToggle.setAttribute('aria-expanded', isExpanded);
        
        const icon = this.menuToggle.querySelector('.material-icons');
        icon.textContent = isExpanded ? 'close' : 'menu';
    }

    loadGardenData() {
        this.updateStats();
        this.displaySavedPlants();
    }

    updateStats() {
        const stats = this.storage.getGardenStats();
        
        if (this.totalPlantsEl) {
            this.totalPlantsEl.textContent = stats.totalPlants;
        }
        
        if (this.recentPlantsEl) {
            this.recentPlantsEl.textContent = stats.recentlyAdded;
        }
        
        const savedPlants = this.storage.getSavedPlants();
        const pendingTasks = savedPlants.reduce((total, plant) => {
            const uncompleted = plant.careReminders?.filter(r => !r.completed) || [];
            return total + uncompleted.length;
        }, 0);
        
        if (this.pendingTasksEl) {
            this.pendingTasksEl.textContent = pendingTasks;
        }
    }

    displaySavedPlants() {
        const savedPlants = this.storage.getSavedPlants();
        
        if (savedPlants.length === 0) {
            this.emptyState.classList.remove('hidden');
            this.savedPlantsGrid.innerHTML = '';
            return;
        }

        this.emptyState.classList.add('hidden');
        
        const sortedPlants = savedPlants.sort((a, b) => 
            new Date(b.savedAt) - new Date(a.savedAt)
        );

        this.savedPlantsGrid.innerHTML = sortedPlants
            .map(plant => this.createSavedPlantCard(plant))
            .join('');
        
        this.attachPlantCardListeners();
    }

    createSavedPlantCard(plant) {
        const plantedDate = plant.plantedDate ? 
            new Date(plant.plantedDate).toLocaleDateString() : 'Not planted';
        
        const pendingReminders = plant.careReminders?.filter(r => !r.completed).length || 0;
        
        return `
            <div class="saved-plant-card" data-plant-id="${plant.id}">
                <div class="saved-plant-header">
                    <div class="saved-plant-info">
                        <h4>${plant.commonName}</h4>
                        <p class="saved-plant-scientific">${plant.scientificName || 'Unknown species'}</p>
                    </div>
                    <span class="saved-plant-badge">${this.capitalizeFirst(plant.plantType || 'Unknown')}</span>
                </div>                <div class="saved-plant-details">
                    <div class="plant-detail-row">
                        <span class="emoji-icon">📈</span>
                        <span>Difficulty: ${this.capitalizeFirst(plant.difficulty || 'Unknown')}</span>
                    </div>
                    <div class="plant-detail-row">
                        <span class="emoji-icon">💧</span>
                        <span>${plant.wateringFrequency || 'Regular watering'}</span>
                    </div>
                    <div class="plant-detail-row">
                        <span class="emoji-icon">📅</span>
                        <span>Planted: ${plantedDate}</span>
                    </div>
                    ${pendingReminders > 0 ? `
                        <div class="plant-detail-row">
                            <span class="emoji-icon">⚠️</span>
                            <span>${pendingReminders} pending task${pendingReminders > 1 ? 's' : ''}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="saved-plant-actions">
                    <button class="btn-details-saved" data-plant-id="${plant.id}">
                        <span class="material-icons">info</span>
                        Details
                    </button>
                    <button class="btn-remove-saved" data-plant-id="${plant.id}">
                        <span class="material-icons">delete</span>
                        Remove
                    </button>
                </div>
            </div>
        `;
    }

    attachPlantCardListeners() {
        document.querySelectorAll('.btn-details-saved').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const plantId = parseInt(e.target.closest('button').dataset.plantId);
                this.showPlantDetails(plantId);
            });
        });

        document.querySelectorAll('.btn-remove-saved').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const plantId = parseInt(e.target.closest('button').dataset.plantId);
                this.removePlant(plantId);
            });
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.addPlantForm);
        const plantData = {
            id: Date.now(),
            commonName: formData.get('plantName'),
            scientificName: formData.get('scientificName') || '',
            plantType: formData.get('plantType'),
            difficulty: formData.get('difficulty') || 'moderate',
            plantedDate: formData.get('plantedDate') || null,
            wateringFrequency: formData.get('wateringFrequency') || 'Regular',
            sunRequirements: 'Full sun to partial shade',
            description: 'Custom plant added by user',
            careInstructions: 'Follow standard care practices for this plant type',
            notes: formData.get('notes') || '',
            careReminders: []
        };

        const success = this.storage.savePlant(plantData);
        
        if (success) {
            this.addPlantForm.reset();
            this.loadGardenData();
            this.showSuccessMessage('Plant added to your garden!');
        } else {
            this.showErrorMessage('Failed to add plant. Please try again.');
        }
    }

    showPlantDetails(plantId) {
        const plants = this.storage.getSavedPlants();
        const plant = plants.find(p => p.id === plantId);
        
        if (!plant) return;
        
        this.currentPlantId = plantId;
        this.populateModal(plant);
        this.modal.open();
    }

    populateModal(plant) {
        if (this.modalPlantName) this.modalPlantName.textContent = plant.commonName;
        if (this.modalPlantScientific) this.modalPlantScientific.textContent = plant.scientificName || 'Unknown species';
        if (this.modalPlantType) this.modalPlantType.textContent = this.capitalizeFirst(plant.plantType || 'Unknown');
        if (this.modalPlantDifficulty) this.modalPlantDifficulty.textContent = this.capitalizeFirst(plant.difficulty || 'Unknown');
        if (this.modalPlantWatering) this.modalPlantWatering.textContent = plant.wateringFrequency || 'Regular';
        if (this.modalPlantSun) this.modalPlantSun.textContent = plant.sunRequirements || 'Full sun';
        if (this.modalCareInstructions) this.modalCareInstructions.textContent = plant.careInstructions || 'No specific instructions available';
        if (this.modalNotes) this.modalNotes.value = plant.notes || '';
        
        this.loadReminders(plant.careReminders || []);
    }

    loadReminders(reminders) {
        if (!this.remindersList) return;
        
        this.remindersList.innerHTML = reminders.length === 0 ? 
            '<li class="no-reminders">No reminders added yet</li>' :
            reminders.map(reminder => `
                <li class="reminder-item ${reminder.completed ? 'completed' : ''}">
                    <input type="checkbox" class="reminder-checkbox" 
                           ${reminder.completed ? 'checked' : ''} 
                           data-reminder-id="${reminder.id}">
                    <span class="reminder-text">${reminder.text}</span>
                </li>
            `).join('');
        
        this.remindersList.querySelectorAll('.reminder-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const reminderId = parseInt(e.target.dataset.reminderId);
                this.toggleReminder(reminderId);
            });
        });
    }    removePlant(plantId) {
        this.confirmDialog.show({
            title: 'Remove Plant',
            message: 'Are you sure you want to remove this plant from your garden?',
            confirmText: 'Remove',
            type: 'danger'
        }).then((confirmed) => {
            if (confirmed) {
                this.storage.removePlant(plantId);
                this.loadGardenData();
                this.showSuccessMessage('Plant removed from garden');
            }
        });
    }    removePlantFromModal() {
        this.confirmDialog.show({
            title: 'Remove Plant',
            message: 'Are you sure you want to remove this plant from your garden?',
            confirmText: 'Remove',
            type: 'danger'
        }).then((confirmed) => {
            if (confirmed && this.currentPlantId) {
                this.storage.removePlant(this.currentPlantId);
                this.modal.close();
                this.loadGardenData();
                this.showSuccessMessage('Plant removed from garden');
            }
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-panel`).classList.add('active');
    }

    saveNotes() {
        if (!this.currentPlantId || !this.modalNotes) return;
        
        const notes = this.modalNotes.value;
        const success = this.storage.updatePlant(this.currentPlantId, { notes });
        
        if (success) {
            this.showSuccessMessage('Notes saved successfully');
        }
    }

    addReminder() {
        if (!this.currentPlantId || !this.newReminderInput) return;
        
        const reminderText = this.newReminderInput.value.trim();
        if (!reminderText) return;
        
        const success = this.storage.addCareReminder(this.currentPlantId, reminderText);
        
        if (success) {
            this.newReminderInput.value = '';
            const plants = this.storage.getSavedPlants();
            const plant = plants.find(p => p.id === this.currentPlantId);
            if (plant) {
                this.loadReminders(plant.careReminders || []);
            }
            this.updateStats();
        }
    }

    toggleReminder(reminderId) {
        if (!this.currentPlantId) return;
        
        this.storage.toggleCareReminder(this.currentPlantId, reminderId);
        this.updateStats();
    }

    exportData() {
        const data = this.storage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `garden-planner-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccessMessage('Data exported successfully');
    }    clearAllData() {
        this.confirmDialog.show({
            title: 'Clear All Data',
            message: 'Are you sure you want to clear all your garden data? This action cannot be undone.',
            confirmText: 'Clear All',
            type: 'danger'
        }).then((confirmed) => {
            if (confirmed) {
                this.storage.clearAllData();
                this.loadGardenData();
                this.showSuccessMessage('All data cleared');
            }
        });
    }

    capitalizeFirst(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="material-icons">${type === 'success' ? 'check_circle' : 'error'}</span>
            <span>${message}</span>
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--color-primary);
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    z-index: 1001;
                    animation: slideIn 0.3s ease;
                }
                .notification.error {
                    background: #f44336;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MyGarden();
});
