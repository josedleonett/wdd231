document.addEventListener('DOMContentLoaded', function() {
    
    function generateMembershipCards() {
        const membershipConfig = window.chamberConfig?.membership;
        const cardsContainer = document.querySelector('.membership-cards');
        
        if (!membershipConfig || !cardsContainer) return;
        
        cardsContainer.innerHTML = '';
        
        membershipConfig.levels.forEach(level => {
            const card = document.createElement('div');
            card.className = 'membership-card';
              const priceDisplay = level.price === 0 ? 'Free' : `${level.currency}${level.price}/${level.period}`;
            
            card.innerHTML = `
                <div class="membership-badge membership-level-${level.id}">${level.name}</div>
                <h3>${level.name}</h3>
                <div class="membership-price">${priceDisplay}</div>
                <ul class="membership-features">
                    ${level.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <button class="join-button" data-level="${level.name.toLowerCase()}">Select</button>
            `;
            
            cardsContainer.appendChild(card);
        });
        
        setupJoinButtonHandlers();
    }
    
    function setupJoinButtonHandlers() {
        const joinButtons = document.querySelectorAll('.join-button[data-level]');
        joinButtons.forEach(button => {
            button.addEventListener('click', function() {
                const level = this.getAttribute('data-level');
                const membershipConfig = window.chamberConfig?.membership;
                
                if (membershipConfig) {
                    const levelConfig = membershipConfig.getLevelByName(level);
                    if (levelConfig) {
                        const radioButton = document.getElementById(`membership-${level}`);
                        if (radioButton) {
                            radioButton.checked = true;
                        }
                        
                        const form = document.querySelector('.join-form-container');
                        if (form) {
                            form.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            });
        });
    }
    generateMembershipCards();
    const membershipConfig = window.chamberConfig?.membership;
    if (membershipConfig && typeof membershipConfig.initializeDynamicStyles === 'function') {
        membershipConfig.initializeDynamicStyles();
    }
    
    function setTimestamp() {
        const timestampField = document.getElementById('timestamp');
        if (timestampField) {
            timestampField.value = new Date().toISOString();
        }
    }
    
    function validateForm(event) {
        event.preventDefault();
        
        const businessName = document.getElementById('business-name');
        const contactName = document.getElementById('contact-name');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const membershipLevel = document.querySelector('input[name="membership-level"]:checked');
        
        const formControls = document.querySelectorAll('.form-control');
        formControls.forEach(control => {
            control.classList.remove('is-invalid');
            const feedback = control.parentNode.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.remove();
            }
        });
        
        let isValid = true;
        
        if (!businessName.value.trim()) {
            showError(businessName, 'Business name is required');
            isValid = false;
        }
        
        if (!contactName.value.trim()) {
            showError(contactName, 'Contact name is required');
            isValid = false;
        }
        
        if (!phone.value.trim()) {
            showError(phone, 'Phone number is required');
            isValid = false;
        }
        
        if (!email.value.trim()) {
            showError(email, 'Email address is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!membershipLevel) {
            const membershipGroup = document.querySelector('.radio-group');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = 'Please select a membership level';
            membershipGroup.appendChild(errorDiv);
            isValid = false;
        }
        
        if (isValid) {
            setTimestamp();
            
            alert('Thank you for your application! We will contact you soon.');
            document.getElementById('join-form').reset();
        }
    }
    
    function showError(input, message) {
        input.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function initMembershipSelection() {
        const membershipButtons = document.querySelectorAll('.membership-card .join-button');
        
        membershipButtons.forEach(button => {
            button.addEventListener('click', function() {
                const level = this.getAttribute('data-level');
                let radioId;
                
                switch(level) {
                    case 'bronze':
                        radioId = 'membership-bronze';
                        break;
                    case 'silver':
                        radioId = 'membership-silver';
                        break;
                    case 'gold':
                        radioId = 'membership-gold';
                        break;
                    case 'platinum':
                        radioId = 'membership-platinum';
                        break;
                }
                
                if (radioId) {
                    const radio = document.getElementById(radioId);
                    if (radio) {
                        radio.checked = true;
                    }
                }
                
                const form = document.getElementById('join-form');
                if (form) {
                    form.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', validateForm);
    }
    
    initMembershipSelection();
});
