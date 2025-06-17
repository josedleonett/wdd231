// LocalStorage management module
class StorageManager {
    constructor() {
        this.storageKey = 'gardenPlannerData';
        this.init();
    }

    // Initialize storage structure
    init() {
        const data = this.getData();
        if (!data.savedPlants) {
            this.saveData({
                savedPlants: [],
                userPreferences: {},
                lastUpdated: new Date().toISOString()
            });
        }
    }

    // Get all data from localStorage
    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return {};
        }
    }

    // Save data to localStorage
    saveData(data) {
        try {
            const existingData = this.getData();
            const mergedData = { ...existingData, ...data, lastUpdated: new Date().toISOString() };
            localStorage.setItem(this.storageKey, JSON.stringify(mergedData));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    // Plant management methods
    savePlant(plant) {
        const data = this.getData();
        const savedPlants = data.savedPlants || [];
        
        const existingIndex = savedPlants.findIndex(p => p.id === plant.id);
        
        if (existingIndex === -1) {
            const plantToSave = {
                ...plant,
                savedAt: new Date().toISOString(),
                notes: '',
                plantedDate: null,
                careReminders: []
            };
            savedPlants.push(plantToSave);
            
            this.saveData({ savedPlants });
            return true;
        }
        
        return false;
    }

    removePlant(plantId) {
        const data = this.getData();
        const savedPlants = data.savedPlants || [];
        const filteredPlants = savedPlants.filter(plant => plant.id !== plantId);
        
        this.saveData({ savedPlants: filteredPlants });
        return true;
    }

    getSavedPlants() {
        const data = this.getData();
        return data.savedPlants || [];
    }

    isPlantSaved(plantId) {
        const savedPlants = this.getSavedPlants();
        return savedPlants.some(plant => plant.id === plantId);
    }

    updatePlant(plantId, updates) {
        const data = this.getData();
        const savedPlants = data.savedPlants || [];
        const plantIndex = savedPlants.findIndex(p => p.id === plantId);
        
        if (plantIndex !== -1) {
            savedPlants[plantIndex] = { ...savedPlants[plantIndex], ...updates };
            this.saveData({ savedPlants });
            return true;
        }
        
        return false;
    }

    addCareReminder(plantId, reminder) {
        const data = this.getData();
        const savedPlants = data.savedPlants || [];
        const plant = savedPlants.find(p => p.id === plantId);
        
        if (plant) {
            if (!plant.careReminders) plant.careReminders = [];
            plant.careReminders.push({
                id: Date.now(),
                text: reminder,
                completed: false,
                createdAt: new Date().toISOString()
            });
            
            this.saveData({ savedPlants });
            return true;
        }
        
        return false;
    }

    toggleCareReminder(plantId, reminderId) {
        const data = this.getData();
        const savedPlants = data.savedPlants || [];
        const plant = savedPlants.find(p => p.id === plantId);
        
        if (plant && plant.careReminders) {
            const reminder = plant.careReminders.find(r => r.id === reminderId);
            if (reminder) {
                reminder.completed = !reminder.completed;
                this.saveData({ savedPlants });
                return true;
            }
        }
        
        return false;
    }

    // User preferences
    saveUserPreferences(preferences) {
        const data = this.getData();
        this.saveData({ 
            userPreferences: { ...data.userPreferences, ...preferences }
        });
    }

    getUserPreferences() {
        const data = this.getData();
        return data.userPreferences || {};
    }

    // Statistics and analytics
    getGardenStats() {
        const savedPlants = this.getSavedPlants();
        const stats = {
            totalPlants: savedPlants.length,
            plantsByType: {},
            plantsByDifficulty: {},
            recentlyAdded: savedPlants.filter(plant => {
                const savedDate = new Date(plant.savedAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return savedDate > weekAgo;
            }).length
        };

        // Count by type and difficulty
        savedPlants.forEach(plant => {
            stats.plantsByType[plant.plantType] = 
                (stats.plantsByType[plant.plantType] || 0) + 1;
            stats.plantsByDifficulty[plant.difficulty] = 
                (stats.plantsByDifficulty[plant.difficulty] || 0) + 1;
        });

        return stats;
    }

    // Data export/import
    exportData() {
        const data = this.getData();
        const exportData = {
            ...data,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    importData(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            if (importedData.savedPlants && Array.isArray(importedData.savedPlants)) {
                this.saveData(importedData);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Clear all data
    clearAllData() {
        try {
            localStorage.removeItem(this.storageKey);
            this.init();
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }
}

export default StorageManager;
