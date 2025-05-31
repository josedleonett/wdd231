document.addEventListener('DOMContentLoaded', function() {
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
        logo.width = 80;
        logo.height = 80;
        logo.loading = 'eager';
        logo.decoding = 'sync';
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
        const closeLi = document.createElement('li');
        const closeButton = document.createElement('button');
        closeButton.className = 'nav-close-btn';
        closeButton.setAttribute('aria-label', 'Close navigation menu');
        closeButton.innerHTML = '<img src="images/icons/close.svg" alt="Close" class="icon" aria-label="Close">';
        closeLi.appendChild(closeButton);        ul.appendChild(closeLi);
        const navItems = config.navItems || [];
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
        const img = document.createElement('img');
        img.src = 'images/icons/dark_mode.svg';
        img.alt = 'Dark mode';
        img.className = 'icon';
        img.setAttribute('aria-label', 'Toggle dark mode');
        button.appendChild(img);
        li.appendChild(button);
        ul.appendChild(li);
        nav.appendChild(hamburger);
        nav.appendChild(ul);
        header.appendChild(headerContainer);
        header.appendChild(nav);
        return header;
    }    function initHeader() {
        const body = document.body;
        const existingHeader = document.querySelector('header');
        if (existingHeader) {
            existingHeader.remove();
        }
        const header = createHeader();
        body.insertBefore(header, body.firstChild);
          const hamburger = document.querySelector('.hamburger-menu');
        const navMenu = document.querySelector('.nav-menu');
        const closeBtn = document.querySelector('.nav-close-btn');
        
        hamburger?.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
        
        closeBtn?.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
        
        document.addEventListener('click', function(e) {
            if (navMenu && hamburger && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
        
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        darkModeToggle?.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
        
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
    initHeader();
});
