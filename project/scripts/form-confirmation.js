class FormConfirmation {
    constructor() {
        this.init();
    }

    init() {
        this.displayFormData();
        this.initializeNavigation();
    }

    displayFormData() {
        const urlParams = new URLSearchParams(window.location.search);
        
        const fields = {
            'plant-name': urlParams.get('plantName') || 'Not provided',
            'scientific-name': urlParams.get('scientificName') || 'Not provided',
            'plant-type': this.formatValue(urlParams.get('plantType')) || 'Not provided',
            'difficulty': this.formatValue(urlParams.get('difficulty')) || 'Not provided',
            'planted-date': urlParams.get('plantedDate') || 'Not provided',
            'watering-frequency': urlParams.get('wateringFrequency') || 'Not provided',
            'notes': urlParams.get('notes') || 'No notes added'
        };
        
        Object.entries(fields).forEach(([fieldId, value]) => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    formatValue(value) {
        if (!value) return value;
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    initializeNavigation() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const isExpanded = navLinks.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', isExpanded);
                
                const icon = menuToggle.querySelector('.emoji-icon');
                icon.textContent = isExpanded ? '✖️' : '☰';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FormConfirmation();
});
