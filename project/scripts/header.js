function loadHeader() {
    const header = document.querySelector('header');
    const nav = document.querySelector('header nav');
    
    if (!header || !nav) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const navContent = `
        <button aria-label="Toggle menu">
            <span class="material-icons">menu</span>
        </button>
        <ul>
            <li><a href="index.html" ${currentPage === 'index.html' ? 'class="active"' : ''}>Home</a></li>
            <li><a href="planner.html" ${currentPage === 'planner.html' ? 'class="active"' : ''}>Planner</a></li>
            <li><a href="my-garden.html" ${currentPage === 'my-garden.html' ? 'class="active"' : ''}>My Garden</a></li>
        </ul>
    `;
    
    nav.innerHTML = navContent;
    
    header.innerHTML = '';
    
    const mainDiv = document.createElement('div');
    
    const logoDiv = document.createElement('div');
    logoDiv.className = 'header-logo';
    logoDiv.innerHTML = `
        <div>
            <span class="material-icons">eco</span>
            <span class="header-title">Garden Planner</span>
        </div>
    `;
    mainDiv.appendChild(logoDiv);
    
    mainDiv.appendChild(nav);
    
    header.appendChild(mainDiv);
    
    initializeMobileMenu();
}

function initializeMobileMenu() {
    const menuToggle = document.querySelector('nav button');
    const navLinks = document.querySelector('nav ul');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            
            const icon = menuToggle.querySelector('.material-icons');
            icon.textContent = isExpanded ? 'close' : 'menu';
        });

        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
                menuToggle.querySelector('.material-icons').textContent = 'menu';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
                menuToggle.querySelector('.material-icons').textContent = 'menu';
                menuToggle.focus();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', loadHeader);
