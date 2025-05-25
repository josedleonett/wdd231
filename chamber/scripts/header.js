document.addEventListener('DOMContentLoaded', function() {
    // Global configuration object for header settings
    window.chamberConfig = window.chamberConfig || {};
    const config = window.chamberConfig.header || {};

    function createHeader() {
        const header = document.createElement('header');
        
        const headerContainer = document.createElement('div');
        headerContainer.className = 'header-container';
        
        const logo = document.createElement('img');
        logo.src = config.logoSrc || 'images/logo.webp';
        logo.alt = config.logoAlt || 'Chamber of Commerce of Province of Cordoba logo';
        logo.className = 'logo';
        
        const headerText = document.createElement('div');
        headerText.className = 'header-text';
        
        const span1 = document.createElement('span');
        span1.textContent = config.titleTop || 'Chamber of Commerce of';
        
        const span2 = document.createElement('span');
        span2.className = 'highlight';
        span2.textContent = config.titleHighlight || 'Province of Cordoba';
        
        headerText.appendChild(span1);
        headerText.appendChild(span2);
        
        headerContainer.appendChild(logo);
        headerContainer.appendChild(headerText);
        const nav = document.createElement('nav');
        nav.className = 'main-nav';
        
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-menu';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        
        const hamburgerIcon = document.createElement('div');
        hamburgerIcon.className = 'hamburger-icon';
        for (let i = 0; i < 3; i++) {
            const line = document.createElement('span');
            hamburgerIcon.appendChild(line);
        }
        hamburger.appendChild(hamburgerIcon);
          const ul = document.createElement('ul');
        ul.className = 'nav-menu';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'nav-close-btn';
        closeButton.setAttribute('aria-label', 'Close navigation menu');
        closeButton.innerHTML = '<span class="material-symbols-outlined">close</span>';
        ul.appendChild(closeButton);

        const defaultNavItems = window.chamberConfig.defaultNavItems;
        const navItems = config.navItems || defaultNavItems;
        
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navItems.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.href;
            a.textContent = item.text;
            
            if (currentPage === item.href) {
                a.className = 'active';
            }
            
            li.appendChild(a);
            ul.appendChild(li);
        });
        
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.id = 'dark-mode-toggle';
        
        const span = document.createElement('span');
        span.className = 'material-symbols-outlined';
        span.textContent = 'dark_mode';
        
        button.appendChild(span);
        li.appendChild(button);
        ul.appendChild(li);
        nav.appendChild(hamburger);
        nav.appendChild(ul);
        
        header.appendChild(headerContainer);
        header.appendChild(nav);
        
        return header;
    }
    
    function initHeader() {
        const body = document.body;
        const existingHeader = document.querySelector('header');
        
        if (existingHeader) {
            const newHeader = createHeader();
            body.replaceChild(newHeader, existingHeader);
        } else {
            const newHeader = createHeader();
            body.insertBefore(newHeader, body.firstChild);
        }
        initDarkModeToggle();
        
        initHamburgerMenu();
    }
    
    function initDarkModeToggle() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        
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
        }
    }

    function initHamburgerMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const navMenu = document.querySelector('.nav-menu');
        const closeBtn = document.querySelector('.nav-close-btn');
        
        function closeMenu() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        
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
                const isActive = navMenu.classList.contains('active');
                if (isActive) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });
            
            if (closeBtn) {
                closeBtn.addEventListener('click', closeMenu);
            }
            
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', closeMenu);
            });
            
            document.addEventListener('click', function(event) {
                if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                    closeMenu();
                }
            });
            
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    closeMenu();
                }
            });
        }
    }

    initHeader();
});
