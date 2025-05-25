/**
 * Sample Chamber of Commerce Configuration File
 * 
 * This file demonstrates how to customize the website for a specific
 * Chamber of Commerce by modifying the global chamberConfig object.
 * 
 * To use this configuration:
 * 1. Copy this file to your project
 * 2. Update the values to match your chamber's information
 * 3. Include this file in your HTML pages before header.js and footer.js
 */

// Initialize global configuration object
window.chamberConfig = {
    /**
     * Header Component Configuration
     */
    header: {
        // Logo settings
        logoSrc: 'images/your-logo.webp',
        logoAlt: 'Your Chamber of Commerce logo',
        
        // Header title text
        titleTop: 'Chamber of Commerce of',
        titleHighlight: 'Your City Name',
        
        // Custom navigation menu items
        // Uncomment and modify to customize your navigation
        /*
        navItems: [
            { href: 'index.html', text: 'Home' },
            { href: 'directory.html', text: 'Members' },  // You can change the text
            { href: 'join.html', text: 'Become a Member' },
            { href: 'discover.html', text: 'Our City' },
            { href: 'events.html', text: 'Events' },  // You can add new pages
            { href: 'contact.html', text: 'Contact Us' }
        ]
        */
    },
    
    /**
     * Footer Component Configuration
     */
    footer: {
        // Company information
        companyName: 'Chamber of Commerce of Your City Name',
        address: '123 Main St, Your City, Your Country',
        email: 'info@yourchamber.com',
        phone: '(123) 456-7890',
        
        // Social media links
        socialLinks: [
            { href: 'https://www.facebook.com/yourchamber', label: 'Facebook', icon: 'facebook-f' },
            { href: 'https://www.twitter.com/yourchamber', label: 'Twitter', icon: 'twitter' },
            { href: 'https://www.instagram.com/yourchamber', label: 'Instagram', icon: 'instagram' },
            { href: 'https://www.linkedin.com/company/yourchamber', label: 'LinkedIn', icon: 'linkedin-in' },
            // You can add more social media platforms
            { href: 'https://www.youtube.com/channel/yourchamber', label: 'YouTube', icon: 'youtube' }
        ],
        
        // Author information - update with your details
        projectTitle: 'Your Project Name',
        authorName: 'Your Name',
        authorWebsite: 'https://yourwebsite.com',
        authorWebsiteText: 'yourwebsite.com'
    }
    
    /**
     * You can add more configuration sections for other components
     * as the website grows. For example:
     * 
     * directory: {
     *     defaultSortBy: 'name',
     *     defaultView: 'grid',
     *     itemsPerPage: 12
     * }
     */
};
