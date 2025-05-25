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
    
    function displayWeather() {
        const weatherContent = document.querySelector('.weather-content');
        if (!weatherContent) return;
        
        const weatherData = {
            temperature: 22, // Celsius
            condition: 'Sunny',
            humidity: 45, // Percentage
            windSpeed: 8, // km/h
            highTemp: 26,
            lowTemp: 14
        };
        
        let weatherIcon = 'sunny';
        switch(weatherData.condition.toLowerCase()) {
            case 'cloudy':
                weatherIcon = 'cloud';
                break;
            case 'rainy':
                weatherIcon = 'rainy';
                break;
            case 'partly cloudy':
                weatherIcon = 'partly_cloudy_day';
                break;
            case 'stormy':
                weatherIcon = 'thunderstorm';
                break;
            case 'snowy':
                weatherIcon = 'weather_snowy';
                break;
            default:
                weatherIcon = 'sunny';
        }
        
        weatherContent.innerHTML = `
            <span class="material-symbols-outlined weather-icon">${weatherIcon}</span>
            <div class="current-temp">${weatherData.temperature}°C</div>
            <p>${weatherData.condition}</p>
            <div class="weather-details">
                <div class="weather-detail-item">
                    <div class="detail-value">${weatherData.highTemp}°C</div>
                    <div class="detail-label">High</div>
                </div>
                <div class="weather-detail-item">
                    <div class="detail-value">${weatherData.lowTemp}°C</div>
                    <div class="detail-label">Low</div>
                </div>
                <div class="weather-detail-item">
                    <div class="detail-value">${weatherData.humidity}%</div>
                    <div class="detail-label">Humidity</div>
                </div>
                <div class="weather-detail-item">
                    <div class="detail-value">${weatherData.windSpeed} km/h</div>
                    <div class="detail-label">Wind</div>
                </div>
            </div>
        `;
    }
    
    trackVisits();
    displayWeather();
    
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
