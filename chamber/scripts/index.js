import { chamberConfig } from './config.js';

export async function initializeWeather() {
    const weatherConfig = chamberConfig?.weather;
    if (!weatherConfig || !weatherConfig.apiKey) {
        displayStaticWeather();
        return;
    }
    try {
        await fetchWeatherData();
    } catch (error) {
        console.warn('Weather API failed, showing static data:', error);
        displayStaticWeather();
    }
}

export async function fetchWeatherData() {
    const weatherConfig = chamberConfig.weather;
    const currentWeatherUrl = `${weatherConfig.apiUrl}/weather?q=${weatherConfig.cityName}&appid=${weatherConfig.apiKey}&units=${weatherConfig.units}`;
    const forecastUrl = `${weatherConfig.apiUrl}/forecast?q=${weatherConfig.cityName}&appid=${weatherConfig.apiKey}&units=${weatherConfig.units}`;
    const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl)
    ]);
    if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Weather API request failed');
    }
    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    displayWeatherFromAPI(currentData, forecastData);
}

export function displayWeatherFromAPI(current, forecast) {
    const weatherContent = document.querySelector('.weather-content');
    if (!weatherContent) return;
    const weatherConfig = chamberConfig.weather;
    const unitConfig = weatherConfig.unitConfig[weatherConfig.units];
    const temperature = Math.round(current.main.temp);
    const condition = current.weather[0].main;
    const description = current.weather[0].description;
    const humidity = current.main.humidity;
    const windSpeed = Math.round(current.wind.speed * unitConfig.windSpeedConversion);
    const highTemp = Math.round(current.main.temp_max);
    const lowTemp = Math.round(current.main.temp_min);
    const cityName = weatherConfig.displayCityName || current.name;
    const weatherEmoji = getWeatherEmoji(current.weather[0].main, current.weather[0].icon);
    weatherContent.innerHTML = `
        <div class="weather-location">${cityName}, </div>
        <div class="weather-emoji">${weatherEmoji}</div>
        <div class="current-temp">${temperature}${unitConfig.temperature}</div>
        <div class="weather-description">${description.charAt(0).toUpperCase() + description.slice(1)}</div>
        <div class="weather-condition">${condition}</div>
        <div class="weather-details">
            <div class="weather-detail-item">
                <div class="detail-value">${highTemp}${unitConfig.temperature}</div>
                <div class="detail-label">High</div>
            </div>
            <div class="weather-detail-item">
                <div class="detail-value">${lowTemp}${unitConfig.temperature}</div>
                <div class="detail-label">Low</div>
            </div>
            <div class="weather-detail-item">
                <div class="detail-value">${humidity}%</div>
                <div class="detail-label">Humidity</div>
            </div>
            <div class="weather-detail-item">
                <div class="detail-value">${windSpeed} ${unitConfig.speedLabel}</div>
                <div class="detail-label">Wind</div>
            </div>
        </div>
    `;
    displayWeatherForecast(forecast);
}

export function displayWeatherForecast(forecastData) {
    const weatherConfig = chamberConfig.weather;
    const unitConfig = weatherConfig.unitConfig[weatherConfig.units];
    const forecastConfig = weatherConfig.forecastConfig;
    const dailyForecasts = forecastData.list
        .filter((item, index) => index % forecastConfig.hoursInterval === 0)
        .slice(1, forecastConfig.daysToShow + 1);
    const forecastContainer = document.querySelector('.weather-forecast');
    if (forecastContainer) {
        const forecastHTML = dailyForecasts.map(forecast => {
            const date = new Date(forecast.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const temp = Math.round(forecast.main.temp);
            const emoji = getWeatherEmoji(forecast.weather[0].main, forecast.weather[0].icon);
            const description = forecast.weather[0].description;
            return `
                <div class="forecast-day">
                    <div class="forecast-day-name">${dayName}</div>
                    <div class="forecast-emoji">${emoji}</div>
                    <div class="forecast-description">${description.charAt(0).toUpperCase() + description.slice(1)}</div>
                    <div class="forecast-temp">${temp}${unitConfig.temperature}</div>
                </div>
            `;
        }).join('');
        forecastContainer.innerHTML = `
            <h3>${forecastConfig.title}</h3>
            <div class="forecast-days">${forecastHTML}</div>
        `;
    }
}

export function displayStaticWeather() {
    const weatherContent = document.querySelector('.weather-content');
    if (!weatherContent) return;
    const weatherConfig = chamberConfig?.weather;
    const unitConfig = weatherConfig?.unitConfig?.[weatherConfig.units] || weatherConfig?.unitConfig?.metric;
    const cityName = weatherConfig?.displayCityName || chamberConfig?.header?.titleHighlight || "Córdoba, Argentina";
    const currentUnits = weatherConfig?.units || 'metric';
    const weatherData = weatherConfig?.staticWeatherData?.[currentUnits] || weatherConfig?.staticWeatherData?.metric || {
        temperature: 22,
        condition: 'Clear',
        description: 'sunny',
        humidity: 45,
        windSpeed: 8,
        highTemp: 26,
        lowTemp: 14
    };
    const weatherEmoji = getWeatherEmoji(weatherData.condition);
    weatherContent.innerHTML = `
        <div class="weather-location">${cityName}</div>
        <div class="weather-emoji">${weatherEmoji}</div>
        <div class="current-temp">${weatherData.temperature}${unitConfig?.temperature || '°C'}</div>
        <div class="weather-description">${weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1)}</div>
        <div class="weather-condition">${weatherData.condition}</div>
        <div class="weather-details">
            <div class="weather-detail-item">
                <div class="detail-value">${weatherData.highTemp}${unitConfig?.temperature || '°C'}</div>
                <div class="detail-label">High</div>
            </div>
            <div class="weather-detail-item">
                <div class="detail-value">${weatherData.lowTemp}${unitConfig?.temperature || '°C'}</div>
                <div class="detail-label">Low</div>
            </div>
            <div class="weather-detail-item">
                <div class="detail-value">${weatherData.humidity}%</div>
                <div class="detail-label">Humidity</div>
            </div>
            <div class="weather-detail-item">
                <div class="detail-value">${weatherData.windSpeed} ${unitConfig?.speedLabel || 'km/h'}</div>
                <div class="detail-label">Wind</div>
            </div>
        </div>
    `;
}

export function getWeatherEmoji(condition, iconCode) {
    const weatherConfig = chamberConfig?.weather;
    const emojiMap = weatherConfig?.emojiMap || {};
    const nightEmojis = weatherConfig?.nightEmojis || {};
    const defaultEmoji = weatherConfig?.defaultEmoji || '🌤️';
    const partlyCloudyIconCodes = weatherConfig?.partlyCloudyIconCodes || ['02', '03'];
    if (iconCode && iconCode.endsWith('n')) {
        if (nightEmojis[condition]) {
            return nightEmojis[condition];
        }
    }
    if (iconCode && partlyCloudyIconCodes.some(code => iconCode.includes(code))) {
        return '⛅';
    }
    return emojiMap[condition] || defaultEmoji;
}

export async function initializeMemberSpotlight() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Failed to fetch members data');
        }
        const members = await response.json();
        displayMemberSpotlight(members);
    } catch (error) {
        console.error('Error loading member spotlight:', error);
        displayStaticSpotlight();
    }
}

export function displayMemberSpotlight(members) {
    const spotlightConfig = chamberConfig?.memberSpotlight;
    const qualifyingLevels = spotlightConfig?.qualifyingLevels || [2, 3];
    const numberOfMembers = spotlightConfig?.numberOfMembers || 2;
    const qualifyingMembers = members.filter(member => 
        qualifyingLevels.includes(member.membershipLevel)
    );
    if (qualifyingMembers.length === 0) {
        displayStaticSpotlight();
        return;
    }
    const numberOfSpotlights = Math.min(numberOfMembers, qualifyingMembers.length);
    const selectedMembers = getRandomMembers(qualifyingMembers, numberOfSpotlights);
    const spotlightContainer = document.querySelector('.spotlight-container');
    if (!spotlightContainer) return;
    const spotlightHTML = selectedMembers.map(member => {
        const membershipConfig = chamberConfig?.membership;
        const levelConfig = membershipConfig?.getLevelById?.(member.membershipLevel);
        const levelName = levelConfig ? levelConfig.name : `Level ${member.membershipLevel}`;
        return `
            <div class="spotlight-card member-spotlight-card">
                <img src="${member.image}" alt="${member.name}" class="spotlight-image" 
                     onerror="this.src='images/placeholder.svg'; this.alt='Logo not available';">
                <div class="spotlight-content">
                    <h3>${member.name}</h3>
                    <div class="member-level">${levelName} Member</div>
                    <p class="member-description">${member.description}</p>
                    <div class="member-details">
                        ${member.phone ? `<p><strong>Phone:</strong> <a href="tel:${member.phone}">${member.phone}</a></p>` : ''}
                        ${member.address ? `<p><strong>Address:</strong> ${member.address}</p>` : ''}
                        ${member.website ? `<p><strong>Website:</strong> <a href="${member.website}" target="_blank">${new URL(member.website).hostname}</a></p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    spotlightContainer.innerHTML = spotlightHTML;
}

export function getRandomMembers(members, count) {
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export function displayStaticSpotlight() {
    const spotlightContainer = document.querySelector('.spotlight-container');
    if (!spotlightContainer) return;
    const spotlightConfig = chamberConfig?.memberSpotlight;
    const fallbackData = spotlightConfig?.staticFallback || {
        name: "TechNova Solutions",
        image: "images/placeholder.svg",
        description: "Joining the Chamber has connected us with valuable partners and clients. Our business has grown 30% since becoming a member.",
        attribution: "- John Smith, CEO"
    };
    const existingSpotlight = spotlightContainer.querySelector('.spotlight-card');
    if (!existingSpotlight) {
        spotlightContainer.innerHTML = `
            <div class="spotlight-card">
                <img src="${fallbackData.image}" alt="${fallbackData.name}" class="spotlight-image">
                <div class="spotlight-content">
                    <h3>${fallbackData.name}</h3>
                    <p>"${fallbackData.description}"</p>
                    <p class="spotlight-attribution">${fallbackData.attribution}</p>
                </div>
            </div>
        `;
    }
}

export function initIndex() {
    initializeWeather();
    initializeMemberSpotlight();
}

// Backward compatibility - expose to global scope
if (typeof window !== 'undefined') {
    window.indexModule = {
        initializeWeather,
        fetchWeatherData,
        displayWeatherFromAPI,
        displayWeatherForecast,
        displayStaticWeather,
        getWeatherEmoji,
        initializeMemberSpotlight,
        displayMemberSpotlight,
        getRandomMembers,
        displayStaticSpotlight,
        initIndex
    };
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initIndex);

// Default export
export default {
    initializeWeather,
    fetchWeatherData,
    displayWeatherFromAPI,
    displayWeatherForecast,
    displayStaticWeather,
    getWeatherEmoji,
    initializeMemberSpotlight,
    displayMemberSpotlight,
    getRandomMembers,
    displayStaticSpotlight,
    initIndex
};
