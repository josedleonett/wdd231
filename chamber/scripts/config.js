/**
 * Chamber of Commerce Configuration File
 * 
 * This file customizes the website for the Chamber of Commerce of Province of Cordoba
 * by modifying the global chamberConfig object.
 */

window.chamberConfig = {
    /**
     * Header Component Configuration
     */
    header: {
        // Logo settings
        logoSrc: 'images/logo.webp',
        logoAlt: 'Chamber of Commerce of Province of Cordoba logo',
        
        // Header title text
        titleTop: 'Chamber of Commerce of',
        titleHighlight: 'Province of Cordoba',
        
        // Navigation menu items
        navItems: [
            { href: 'index.html', text: 'Home' },
            { href: 'directory.html', text: 'Directory' },
            { href: 'join.html', text: 'Join' },
            { href: 'discover.html', text: 'Discover' },
            // { href: 'documentation.html', text: 'Documentation' }
        ]
    },
    
    /**
     * Footer Component Configuration
     */
    footer: {
        // Company information
        companyName: 'Chamber of Commerce of Province of Cordoba',
        address: '123 Main St, Cordoba, Argentina',
        email: 'info@chambercordoba.com',
        phone: '(123) 456-7890',
        
        // Social media links
        socialLinks: [
            { href: 'https://www.facebook.com/chambercordoba', label: 'Facebook', icon: 'facebook-f' },
            { href: 'https://www.twitter.com/chambercordoba', label: 'Twitter', icon: 'twitter' },
            { href: 'https://www.instagram.com/chambercordoba', label: 'Instagram', icon: 'instagram' },
            { href: 'https://www.linkedin.com/company/chambercordoba', label: 'LinkedIn', icon: 'linkedin-in' }
        ],
        
        // Author information
        projectTitle: 'WDD231 Chamber Project',
        authorName: 'Jose D. Leonett',
        authorWebsite: 'https://josedleonett.github.io',
        authorWebsiteText: 'josedleonett.github.io'
    },
      /**
     * Directory page configuration
     */
    directory: {
        defaultSortBy: 'name',
        defaultView: 'grid',
        itemsPerPage: 12
    },
      /**
     * Membership configuration
     */
    membership: {
        levels: [
            {
                id: 1,
                name: 'Non-profit',
                price: 0,
                currency: '$',
                period: 'yr',                color: {
                    light: 'var(--color-membership-bronze-end)',
                    dark: 'var(--color-dark-membership-bronze-end)'
                },
                textColor: {
                    light: 'var(--color-text-white)',
                    dark: 'var(--color-text-white)'
                },
                features: [
                    'Basic directory listing',
                    'Chamber newsletter access',
                    'Networking events access',
                    'Community event announcements'
                ]
            },
            {
                id: 2,
                name: 'Silver',
                price: 150,
                currency: '$',
                period: 'yr',
                color: {
                    light: 'var(--color-membership-silver-start)',
                    dark: 'var(--color-dark-membership-silver-end)'
                },
                textColor: {
                    light: 'var(--color-text-white)',
                    dark: 'var(--color-text-white)'
                },
                features: [
                    'Enhanced directory listing',
                    'Chamber newsletter and publications',
                    'All networking events access',
                    'Social media work and promotion',
                    'Business training workshops',
                    'Monthly luncheon invitations'
                ]
            },
            {
                id: 3,
                name: 'Gold',
                price: 300,
                currency: '$',
                period: 'yr',
                color: {
                    light: 'var(--color-membership-gold-end)',
                    dark: 'var(--color-dark-membership-gold-end)'
                },
                textColor: {
                    light: 'var(--color-text)',
                    dark: 'var(--color-text-white)'
                },
                features: [
                    'Premium directory listing with featured placement',
                    'Chamber newsletter and all publications',
                    'Priority networking events access',
                    'Comprehensive social media work and campaigns',
                    'Advanced business training and workshops',
                    'Exclusive luncheon hosting opportunities',
                    'Event sponsorship opportunities',
                    'Website advertising placement',
                    'Quarterly business spotlight features'
                ]
            },
            {
                id: 4,
                name: 'Platinum',
                price: 500,
                currency: '$',
                period: 'yr',
                color: {
                    light: 'var(--color-membership-platinum-end)',
                    dark: 'var(--color-dark-membership-platinum-end)'
                },
                textColor: {
                    light: 'var(--color-text)',
                    dark: 'var(--color-text-inverted)'
                },
                features: [
                    'Featured directory listing with premium placement',
                    'Chamber newsletter and all publications',
                    'VIP networking events access',
                    'Comprehensive social media work and campaigns',
                    'Advanced business training and workshops',
                    'Exclusive luncheon hosting opportunities',
                    'Event sponsorship opportunities',
                    'Website advertising placement',
                    'Quarterly business spotlight features',
                    'Exclusive executive events',
                    'Annual banner ad on chamber website'
                ]
            }
        ],
        
        getLevelById: function(id) {
            return this.levels.find(level => level.id === id);
        },
        
        getLevelByName: function(name) {
            return this.levels.find(level => level.name.toLowerCase() === name.toLowerCase());
        },
        
        getAllLevelNames: function() {
            return this.levels.map(level => level.name);
        },
        
        generateBadgeCSS: function() {
            const isDarkMode = document.body.classList.contains('dark-mode');
            let css = '';
              this.levels.forEach(level => {
                const colorTheme = isDarkMode ? 'dark' : 'light';
                const background = level.color[colorTheme];
                const textColor = level.textColor[colorTheme];
                const textShadow = (textColor.includes('white') || textColor.includes('#ffffff')) ? 
                    '0 1px 2px rgba(0, 0, 0, 0.5)' : '0 1px 2px rgba(255, 255, 255, 0.5)';
                
                css += `
                .membership-badge.membership-level-${level.id} {
                    background: ${background};
                    color: ${textColor};
                    text-shadow: ${textShadow};
                }
                `;
            });
            
            return css;
        },
        
        applyDynamicStyles: function() {
            const styleId = 'dynamic-membership-styles';
            let styleElement = document.getElementById(styleId);
            
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
            }
            
            styleElement.textContent = this.generateBadgeCSS();
        },
        
        initializeDynamicStyles: function() {
            this.applyDynamicStyles();
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        this.applyDynamicStyles();
                    }
                });
            });
            
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }
};
