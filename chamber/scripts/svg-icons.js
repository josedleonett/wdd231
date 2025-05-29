/**
 * SVG Icon Helper Utility
 * Provides functions to easily insert SVG icons in the application
 */

class SvgIconHelper {
    constructor(iconBasePath = 'images/icons/') {
        this.iconBasePath = iconBasePath;
        this.iconCache = new Map();
    }

    /**
     * Create an SVG icon element
     * @param {string} iconName - Name of the icon file (without .svg extension)
     * @param {Object} options - Options for the icon
     * @param {string} options.className - CSS classes to apply
     * @param {string} options.size - Size class (e.g., 'icon-lg', 'icon-xl')
     * @param {string} options.ariaLabel - Accessibility label
     * @returns {Promise<HTMLElement>} The icon element
     */
    async createIcon(iconName, options = {}) {
        const {
            className = '',
            size = '',
            ariaLabel = iconName,
            inline = false
        } = options;

        try {
            const svgContent = await this.loadSvgContent(iconName);
            
            if (inline) {
                // Return inline SVG
                const wrapper = document.createElement('span');
                wrapper.innerHTML = svgContent;
                const svg = wrapper.firstElementChild;
                
                if (svg) {
                    svg.setAttribute('class', `icon ${className} ${size}`.trim());
                    svg.setAttribute('aria-label', ariaLabel);
                    svg.setAttribute('role', 'img');
                    return svg;
                }
            } else {
                // Return img element with SVG src
                const img = document.createElement('img');
                img.src = `${this.iconBasePath}${iconName}.svg`;
                img.alt = ariaLabel;
                img.className = `icon ${className} ${size}`.trim();
                img.setAttribute('aria-label', ariaLabel);
                return img;
            }
        } catch (error) {
            console.warn(`Failed to load icon: ${iconName}`, error);
            
            // Return fallback element
            const fallback = document.createElement('span');
            fallback.className = `icon icon-fallback ${className} ${size}`.trim();
            fallback.setAttribute('aria-label', ariaLabel);
            fallback.textContent = '⚠';
            return fallback;
        }
    }

    /**
     * Load SVG content from file
     * @param {string} iconName 
     * @returns {Promise<string>}
     */
    async loadSvgContent(iconName) {
        if (this.iconCache.has(iconName)) {
            return this.iconCache.get(iconName);
        }

        const response = await fetch(`${this.iconBasePath}${iconName}.svg`);
        if (!response.ok) {
            throw new Error(`Failed to load icon: ${iconName}`);
        }

        const svgContent = await response.text();
        this.iconCache.set(iconName, svgContent);
        return svgContent;
    }

    /**
     * Replace Material Symbols with local SVG icons
     * @param {HTMLElement} container - Container element to search within
     */
    async replaceMaterialSymbols(container = document) {
        const materialIcons = container.querySelectorAll('.material-symbols-outlined');
        
        for (const iconElement of materialIcons) {
            const iconName = iconElement.textContent.trim();
            const className = iconElement.className.replace('material-symbols-outlined', '').trim();
            
            try {
                const newIcon = await this.createIcon(iconName, {
                    className: className,
                    ariaLabel: iconName.replace(/_/g, ' '),
                    inline: true
                });
                
                iconElement.parentNode.replaceChild(newIcon, iconElement);
            } catch (error) {
                console.warn(`Failed to replace Material Symbol: ${iconName}`, error);
            }
        }
    }

    /**
     * Replace Font Awesome icons with local SVG icons
     * @param {HTMLElement} container - Container element to search within
     */
    async replaceFontAwesome(container = document) {
        const faIcons = container.querySelectorAll('[class*="fab fa-"], [class*="fas fa-"], [class*="far fa-"]');
        
        for (const iconElement of faIcons) {
            const classList = Array.from(iconElement.classList);
            const faClass = classList.find(cls => cls.startsWith('fa-') && cls !== 'fab' && cls !== 'fas' && cls !== 'far');
            
            if (faClass) {
                const iconName = faClass.replace('fa-', '');
                const otherClasses = classList.filter(cls => !cls.startsWith('fa')).join(' ');
                
                try {
                    const newIcon = await this.createIcon(iconName, {
                        className: otherClasses,
                        ariaLabel: iconName.replace(/-/g, ' '),
                        inline: true
                    });
                    
                    iconElement.parentNode.replaceChild(newIcon, iconElement);
                } catch (error) {
                    console.warn(`Failed to replace Font Awesome icon: ${iconName}`, error);
                }
            }
        }
    }

    /**
     * Initialize icon replacement for the entire page
     */
    async initializeIcons() {
        await this.replaceMaterialSymbols();
        await this.replaceFontAwesome();
        
        // Set up mutation observer for dynamically added content
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            await this.replaceMaterialSymbols(node);
                            await this.replaceFontAwesome(node);
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Create global instance
window.svgIconHelper = new SvgIconHelper();

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.svgIconHelper.initializeIcons();
    });
} else {
    window.svgIconHelper.initializeIcons();
}
