const apiKey = "YOUR_API_KEY_HERE";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const message = document.getElementById("message");
const celsiusBtn = document.getElementById("celsius-btn");
const fahrenheitBtn = document.getElementById("fahrenheit-btn");

let currentTempC = null;
let currentFeelsLikeC = null;
let currentUnit = "C";

async function getWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    if (apiKey === "YOUR_API_KEY_HERE") {
        message.textContent = "Please add your OpenWeather API key in script.js.";
        return;
    }

    message.textContent = "Loading weather...";
    searchBtn.disabled = true;

    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to get weather data."
            );
        }

        document.getElementById("city-name").textContent =
            `${data.name}, ${data.sys.country}`;

       currentTempC = data.main.temp;
currentFeelsLikeC = data.main.feels_like;
currentUnit = "C";
updateTemperatures();

document.getElementById("pressure").textContent =
    `${data.main.pressure} hPa`;

function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kolkata"
        }
    );
}

document.getElementById("sunrise").textContent =
    formatTime(data.sys.sunrise);

document.getElementById("sunset").textContent =
    formatTime(data.sys.sunset);

        document.getElementById("description").textContent =
            data.weather[0].description;

        document.getElementById("humidity").textContent =
            `${data.main.humidity}%`;

        document.getElementById("wind-speed").textContent =
            `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

        const iconCode = data.weather[0].icon;
        document.getElementById("weather-icon").innerHTML =
            `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;

        message.textContent = "";
    } catch (error) {
        message.textContent =
            error.message === "city not found"
                ? "City not found. Please check the spelling."
                : error.message;

    } finally {
        searchBtn.disabled = false;
    }
    
    if (event.key === "Enter") {
        getWeather();
    }
};
function updateTemperatures() {
    if (currentTempC === null) return;

    const temperature = currentUnit === "C"
        ? currentTempC
        : (currentTempC * 9 / 5) + 32;

    const feelsLike = currentUnit === "C"
        ? currentFeelsLikeC
        : (currentFeelsLikeC * 9 / 5) + 32;

    document.getElementById("temperature").textContent =
        `${Math.round(temperature)}°${currentUnit}`;

    document.getElementById("feels-like").textContent =
        `${Math.round(feelsLike)}°${currentUnit}`;

    celsiusBtn.classList.toggle("active", currentUnit === "C");
    fahrenheitBtn.classList.toggle("active", currentUnit === "F");
}

celsiusBtn.addEventListener("click", function() {
    currentUnit = "C";
    updateTemperatures();
});

fahrenheitBtn.addEventListener("click", function() {
    currentUnit = "F";
    updateTemperatures();
});
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
searchBtn.addEventListener("click", getWeather);