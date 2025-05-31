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
            showError(email, 'Email is required');
            isValid = false;
        }
        if (!membershipLevel) {
            const membershipSection = document.querySelector('.membership-levels');
            if (membershipSection) {
                membershipSection.classList.add('is-invalid');
            }
            isValid = false;
        }
        if (isValid) {
            document.getElementById('join-form').submit();
        }
    }
    function showError(input, message) {
        input.classList.add('is-invalid');
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        input.parentNode.appendChild(feedback);
    }
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', validateForm);
    }
    setTimestamp();
});
