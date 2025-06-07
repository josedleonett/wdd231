document.addEventListener('DOMContentLoaded', function() {
    // Get form data from URL parameters
    const formData = getFormDataFromURL();
    
    // Display the form data
    displayFormData(formData);
    
    function getFormDataFromURL() {
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
    }
    
    function displayFormData(data) {
        // Display first name
        const firstNameElement = document.getElementById('display-first-name');
        if (firstNameElement) {
            firstNameElement.textContent = data.firstName;
        }
        
        // Display last name
        const lastNameElement = document.getElementById('display-last-name');
        if (lastNameElement) {
            lastNameElement.textContent = data.lastName;
        }
        
        // Display email
        const emailElement = document.getElementById('display-email');
        if (emailElement) {
            emailElement.textContent = data.email;
        }
        
        // Display mobile phone
        const mobileElement = document.getElementById('display-mobile');
        if (mobileElement) {
            mobileElement.textContent = data.mobile;
        }
        
        // Display business name
        const businessNameElement = document.getElementById('display-business-name');
        if (businessNameElement) {
            businessNameElement.textContent = data.businessName;
        }
        
        // Display membership level
        const membershipLevelElement = document.getElementById('display-membership-level');
        if (membershipLevelElement) {
            membershipLevelElement.textContent = formatMembershipLevel(data.membershipLevel);
        }
        
        // Display timestamp
        const timestampElement = document.getElementById('display-timestamp');
        if (timestampElement) {
            timestampElement.textContent = formatTimestamp(data.timestamp);
        }
    }
    
    function formatMembershipLevel(level) {
        if (level === 'N/A') return level;
        
        switch(level.toLowerCase()) {
            case 'np':
                return 'Non-Profit Membership (Free)';
            case 'bronze':
                return 'Bronze Membership';
            case 'silver':
                return 'Silver Membership';
            case 'gold':
                return 'Gold Membership';
            default:
                return level;
        }
    }
    
    function formatTimestamp(timestamp) {
        if (timestamp === 'N/A' || !timestamp) return 'N/A';
        
        try {
            const date = new Date(timestamp);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            };
            return date.toLocaleDateString('en-US', options);
        } catch (error) {
            return timestamp;
        }
    }
    
    // Add animation to confirmation card
    const confirmationCard = document.querySelector('.confirmation-card');
    if (confirmationCard) {
        confirmationCard.style.opacity = '0';
        confirmationCard.style.transform = 'translateY(20px)';
        confirmationCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            confirmationCard.style.opacity = '1';
            confirmationCard.style.transform = 'translateY(0)';
        }, 300);
    }
});
