document.addEventListener('DOMContentLoaded', function() {
    setTimestamp();
    initializeModals();
    initializeFormValidation();
    
    animateMembershipCards();
    
    function setTimestamp() {
        const timestampField = document.getElementById('timestamp');
        if (timestampField) {
            const now = new Date();
            timestampField.value = now.toISOString();
        }
    }
      function initializeModals() {
        const modalButtons = document.querySelectorAll('[data-modal]');
        const modals = document.querySelectorAll('dialog.modal');
        const closeButtons = document.querySelectorAll('.close-button');
        
        modalButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal && modal.tagName.toLowerCase() === 'dialog') {
                    modal.showModal();
                    const closeButton = modal.querySelector('.close-button');
                    if (closeButton) {
                        closeButton.focus();
                    }
                }
            });
        });
        
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal && modal.tagName.toLowerCase() === 'dialog') {
                    modal.close();
                }
            });
        });
        
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                const rect = modal.getBoundingClientRect();
                const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                                  rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
                if (!isInDialog) {
                    modal.close();
                }
            });
        });
        
        modals.forEach(modal => {
            modal.addEventListener('cancel', function(e) {
            });
        });
    }
    
    function initializeFormValidation() {
        const form = document.getElementById('join-form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            setTimestamp();            
        });
        
        const orgTitleField = document.getElementById('org-title');
        if (orgTitleField) {
            orgTitleField.addEventListener('input', function() {
                const pattern = /^[a-zA-Z\s\-]{7,}$/;
                const value = this.value;
                
                if (value && !pattern.test(value)) {
                    this.setCustomValidity('Title must contain only letters, spaces, and hyphens with minimum 7 characters');
                } else {
                    this.setCustomValidity('');
                }
            });
        }
        
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                if (!this.value.trim() && this.hasAttribute('required')) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('error') && this.value.trim()) {
                    this.classList.remove('error');
                }
            });
        });
    }
    
    function animateMembershipCards() {
        const cards = document.querySelectorAll('.membership-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });
    }
    
    window.getFormData = function() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            firstName: urlParams.get('first-name') || 'N/A',
            lastName: urlParams.get('last-name') || 'N/A',
            email: urlParams.get('email') || 'N/A',
            mobile: urlParams.get('mobile') || 'N/A',
            businessName: urlParams.get('business-name') || 'N/A',
            membershipLevel: urlParams.get('membership-level') || 'N/A',
            timestamp: urlParams.get('timestamp') || 'N/A'
        };
    };
});
