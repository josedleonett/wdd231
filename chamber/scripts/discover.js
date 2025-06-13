
export async function loadAttractions() {
    try {
        const response = await fetch('data/attractions.json');
        const attractions = await response.json();
        displayAttractions(attractions);
    } catch (error) {
        console.error('Error loading attractions:', error);
    }
}

function displayAttractions(attractions) {
    const gallery = document.getElementById('attractions-gallery');
    if (!gallery) return;

    gallery.innerHTML = '';
    
    attractions.forEach(attraction => {
        const card = document.createElement('div');
        card.className = 'attraction-card';
        
        card.innerHTML = `
            <figure class="attraction-image">
                <img data-src="${attraction.image}" 
                     src="images/placeholder.svg" 
                     alt="${attraction.alt}"
                     loading="lazy">
            </figure>
            <div class="attraction-content">
                <h2>${attraction.name}</h2>
                <address>${attraction.address}</address>
                <p>${attraction.description}</p>
                <button class="learn-more-btn" type="button">Learn More</button>
            </div>
        `;
        
        gallery.appendChild(card);
    });
    
    initLazyLoading();
}

export function trackVisits() {
    const visitCounter = document.getElementById('visit-counter');
    if (!visitCounter) return;
    
    const lastVisit = localStorage.getItem('lastVisit');
    const currentDate = Date.now();
    
    if (!lastVisit) {
        visitCounter.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const previousVisit = parseInt(lastVisit);
        const timeDiff = currentDate - previousVisit;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 1) {
            visitCounter.textContent = "Back so soon! Awesome!";
        } else if (daysDiff === 1) {
            visitCounter.textContent = "You last visited 1 day ago.";
        } else {
            visitCounter.textContent = `You last visited ${daysDiff} days ago.`;
        }
    }
    
    localStorage.setItem('lastVisit', currentDate.toString());
}

export function initLazyLoading() {
    const images = document.querySelectorAll('.attraction-image img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

export async function initDiscover() {
    await loadAttractions();
    trackVisits();
}

if (typeof window !== 'undefined') {
    window.discoverModule = {
        loadAttractions,
        trackVisits,
        initLazyLoading,
        initDiscover
    };
}

document.addEventListener('DOMContentLoaded', initDiscover);

export default {
    loadAttractions,
    trackVisits,
    initLazyLoading,
    initDiscover
};
