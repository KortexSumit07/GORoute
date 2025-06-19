// OpenWeatherMap API key
const API_KEY = '00590b80869a6a684a3dcfa34c891c81';
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');

// Add event listener for Enter key
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    try {
        // Get current weather
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!weatherResponse.ok) {
            throw new Error('City not found');
        }

        const weatherData = await weatherResponse.json();

        // Get 5-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();

        displayWeather(weatherData, forecastData);
        hideError();
    } catch (error) {
        showError(error.message === 'City not found' ? 'City not found. Please try again.' : 'Failed to fetch weather data');
    }
}

function displayWeather(weatherData, forecastData) {
    // Display current weather
    document.getElementById('temp').textContent = Math.round(weatherData.main.temp);
    document.getElementById('description').textContent = weatherData.weather[0].description;
    document.getElementById('humidity').textContent = `${weatherData.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${weatherData.wind.speed} m/s`;
    document.getElementById('cityName').textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    document.getElementById('weatherIcon').src = 
        `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

    // Display forecast
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    // Get one forecast per day (excluding current day)
    const dailyForecasts = forecastData.list.filter(forecast => 
        forecast.dt_txt.includes('12:00:00')
    ).slice(0, 5);

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        forecastContainer.innerHTML += `
            <div class="forecast-day">
                <div>${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" 
                     alt="Weather icon">
                <div>${Math.round(forecast.main.temp)}°C</div>
            </div>
        `;
    });

    weatherInfo.style.display = 'block';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    weatherInfo.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
} 