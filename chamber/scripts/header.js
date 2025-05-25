document.addEventListener('DOMContentLoaded', function() {
    // Global configuration object for header settings
    window.chamberConfig = window.chamberConfig || {};
    const config = window.chamberConfig.header || {};

    // Create header HTML dynamically
    function createHeader() {
        const header = document.createElement('header');
        
        // Create header container
        const headerContainer = document.createElement('div');
        headerContainer.className = 'header-container';
        
        // Create logo
        const logo = document.createElement('img');
        logo.src = config.logoSrc || 'images/logo.webp';
        logo.alt = config.logoAlt || 'Chamber of Commerce of Province of Cordoba logo';
        logo.className = 'logo';
        
        // Create header text
        const headerText = document.createElement('div');
        headerText.className = 'header-text';
        
        const span1 = document.createElement('span');
        span1.textContent = config.titleTop || 'Chamber of Commerce of';
        
        const span2 = document.createElement('span');
        span2.className = 'highlight';
        span2.textContent = config.titleHighlight || 'Province of Cordoba';
        
        headerText.appendChild(span1);
        headerText.appendChild(span2);
        
        // Append logo and header text to header container
        headerContainer.appendChild(logo);
        headerContainer.appendChild(headerText);
          // Create navigation
        const nav = document.createElement('nav');
        nav.className = 'main-nav';
        
        // Create hamburger menu button
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-menu';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        
        // Create hamburger icon
        const hamburgerIcon = document.createElement('div');
        hamburgerIcon.className = 'hamburger-icon';
        for (let i = 0; i < 3; i++) {
            const line = document.createElement('span');
            hamburgerIcon.appendChild(line);
        }
        hamburger.appendChild(hamburgerIcon);
          const ul = document.createElement('ul');
        ul.className = 'nav-menu';
        
        // Create close button for mobile menu
        const closeButton = document.createElement('button');
        closeButton.className = 'nav-close-btn';
        closeButton.setAttribute('aria-label', 'Close navigation menu');
        closeButton.innerHTML = '<span class="material-symbols-outlined">close</span>';
        ul.appendChild(closeButton);
          // Navigation links
        const defaultNavItems = [
            { href: 'index.html', text: 'Home' },
            { href: 'directory.html', text: 'Directory' },
            { href: 'join.html', text: 'Join' },
            { href: 'discover.html', text: 'Discover' },
            { href: 'documentation.html', text: 'Documentation' }
        ];
        
        const navItems = config.navItems || defaultNavItems;
        
        // Get current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Create navigation items
        navItems.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.text;
            
            // Add active class if on current page
            if (currentPage === item.href) {
                a.className = 'active';
            }
            
            li.appendChild(a);
            ul.appendChild(li);
        });
        
        // Create dark mode toggle button
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.id = 'dark-mode-toggle';
        
        const span = document.createElement('span');
        span.className = 'material-symbols-outlined';
        span.textContent = 'dark_mode';
        
        button.appendChild(span);
        li.appendChild(button);
        ul.appendChild(li);
          // Append hamburger and ul to nav
        nav.appendChild(hamburger);
        nav.appendChild(ul);
        
        // Append header container and nav to header
        header.appendChild(headerContainer);
        header.appendChild(nav);
        
        return header;
    }
    
    // Function to initialize header
    function initHeader() {
        const body = document.body;
        const existingHeader = document.querySelector('header');
        
        if (existingHeader) {
            // Replace existing header
            const newHeader = createHeader();
            body.replaceChild(newHeader, existingHeader);
        } else {
            // Insert at beginning of body
            const newHeader = createHeader();
            body.insertBefore(newHeader, body.firstChild);
        }
          // Initialize dark mode toggle
        initDarkModeToggle();
        
        // Initialize hamburger menu
        initHamburgerMenu();
    }
    
    // Function to initialize dark mode toggle
    function initDarkModeToggle() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        
        // Check for saved preference
        const darkModePref = localStorage.getItem('darkMode');
        if (darkModePref === 'enabled') {
            document.body.classList.add('dark-mode');
            const icon = darkModeToggle.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = 'light_mode';
            }
        }
        
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                
                // Update icon based on mode
                const icon = this.querySelector('.material-symbols-outlined');
                if (icon) {
                    if (document.body.classList.contains('dark-mode')) {
                        icon.textContent = 'light_mode';
                        localStorage.setItem('darkMode', 'enabled');
                    } else {
                        icon.textContent = 'dark_mode';
                        localStorage.setItem('darkMode', 'disabled');
                    }
                }
            });
        }    }
      // Function to initialize hamburger menu
    function initHamburgerMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const navMenu = document.querySelector('.nav-menu');
        const closeBtn = document.querySelector('.nav-close-btn');
        
        // Function to close menu
        function closeMenu() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        
        // Function to open menu
        function openMenu() {
            navMenu.classList.add('active');
            hamburger.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            if (window.innerWidth <= 768) {
                document.body.style.overflow = 'hidden';
            }
        }
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                // Toggle menu visibility
                const isActive = navMenu.classList.contains('active');
                if (isActive) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });
            
            // Close button functionality
            if (closeBtn) {
                closeBtn.addEventListener('click', closeMenu);
            }
            
            // Close menu when clicking on navigation links
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', closeMenu);
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                    closeMenu();
                }
            });
            
            // Close menu on window resize to desktop size
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    closeMenu();
                }
            });
        }
    }

    // Initialize header
    initHeader();
});
