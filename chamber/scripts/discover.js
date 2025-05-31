document.addEventListener('DOMContentLoaded', function() {
    function trackVisits() {
        const visitCounter = document.getElementById('visit-counter');
        if (!visitCounter) return;
        
        const lastVisit = localStorage.getItem('lastVisit');
        const currentDate = new Date();
        
        if (!lastVisit) {
            visitCounter.textContent = "Welcome! This is your first visit to our site.";
        } else {
            const previousVisit = new Date(lastVisit);
            const timeDiff = currentDate.getTime() - previousVisit.getTime();
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
    
    trackVisits();
    
    const images = document.querySelectorAll('.attraction-image img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});
