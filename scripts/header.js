document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initWayfinding();
});

function initMobileMenu() {
    const menuButton = document.querySelector('.hamburger-button');
    const headerNav = document.querySelector('.header-main-navigation');
    
    menuButton.addEventListener('click', toggleMobileMenu);
    
    headerNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    function toggleMobileMenu() {
        menuButton.classList.toggle('active');
        headerNav.classList.toggle('active');
    }
    
    function closeMobileMenu() {
        menuButton.classList.remove('active');
        headerNav.classList.remove('active');
    }
}

function initWayfinding() {
    const navLinks = document.querySelectorAll('.header-main-navigation a');
    const currentPath = window.location.hash || '#home';

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }

        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    window.addEventListener('hashchange', () => {
        const newPath = window.location.hash;
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === newPath);
        });
    });
}
