console.log("Mushroom Foraging Weather App Loaded");

const apiKey = "e02ccfe7503cf3bd2a056f16cff5a378"; // Replace with your actual API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast";

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");
    document.getElementById("get-weather").addEventListener("click", () => {
        const location = document.getElementById("location").value.trim();
        if (location) {
            getWeather(location);
        } else {
            alert("Please enter a location!");
        }
    });
});


const mushroomImages = {
    chanterelle: "images/chanterelle.webp",
    oyster: "images/oyster.webp",
    noMushroom: "images/no-mushrooms.webp",
    tooDry: "images/dry.webp"
};

const mushroomData = [
    {
        name: "Chanterelle",
        season: ["summer", "fall"],
        idealConditions: {
            minTemp: 10,
            maxTemp: 25,
            minHumidity: 70
        },
        image: mushroomImages.chanterelle,
        message: "Chanterelles thrive in warm, humid conditions, typically in summer and fall."
    },
    {
        name: "Oyster Mushroom",
        season: ["spring", "fall", "winter"],
        idealConditions: {
            minTemp: 5,
            maxTemp: 30,
            minHumidity: 50
        },
        image: mushroomImages.oyster,
        message: "Oyster mushrooms prefer cool to moderate temperatures and moist environments."
    },
    {
        name: "No Mushrooms",
        season: ["all"],
        idealConditions: {
            minTemp: -Infinity,
            maxTemp: Infinity,
            minHumidity: 0
        },
        image: mushroomImages.noMushroom,
        message: "Conditions are not suitable for mushrooms right now. Check back later!"
    }
];

async function getWeather(location) {
    try {
        const weatherResponse = await fetch(`${apiUrl}?q=${location}&appid=${apiKey}&units=metric`);
        if (!weatherResponse.ok) {
            throw new Error("Location not found!");
        }
        const weatherData = await weatherResponse.json();

        const forecastResponse = await fetch(`${forecastApiUrl}?q=${location}&appid=${apiKey}&units=metric`);
        if (!forecastResponse.ok) {
            throw new Error("Unable to fetch forecast data!");
        }
        const forecastData = await forecastResponse.json();

        // Pass weather and forecast data to displayWeather
        displayWeather(weatherData, forecastData);
    } catch (error) {
        alert(error.message);
    }
}

function getCurrentSeason() {
    const month = new Date().getMonth(); // 0 = January, 11 = December
    if ([11, 0, 1].includes(month)) return "winter";
    if ([2, 3, 4].includes(month)) return "spring";
    if ([5, 6, 7].includes(month)) return "summer";
    if ([8, 9, 10].includes(month)) return "fall";
}
const customMessages = {
    Philadelphia: "Philadelphia forests are great for finding Chicken of the Woods!",
    Seattle: "Seattle's damp climate is perfect for Chanterelles!",
    NewYork: "Try Central Park after rainy days for Oyster mushrooms.",
    default: "Explore nearby wooded areas for the best foraging spots!"
};

function displayWeather(weatherData, forecastData) {
    const weatherDisplay = document.getElementById("weather-display");

    // Reset animation
    weatherDisplay.style.animation = "none";
    void weatherDisplay.offsetWidth; // Trigger reflow to restart animation
    weatherDisplay.style.animation = "fadeIn 1s ease-in-out";

    const temperature = weatherData.main.temp; // Current temperature
    const humidity = weatherData.main.humidity; // Current humidity
    const conditions = weatherData.weather[0].description; // Current conditions
    const currentSeason = getCurrentSeason(); // Determine the season

    // Check for rainfall in the past 3 days
    let recentRain = false;
    let rainAmount = 0;
    for (const forecast of forecastData.list) {
        if (forecast.rain && forecast.rain["3h"]) {
            recentRain = true;
            rainAmount += forecast.rain["3h"]; // Total rainfall in mm
        }
    }

    let mushroomMessage = "No suitable mushrooms found.";
    let mushroomImage = mushroomImages.noMushroom;

    // Advanced mushroom logic: Match based on season, weather, and rainfall
    for (const mushroom of mushroomData) {
        if (
            mushroom.season.includes(currentSeason) && // Check if in-season
            temperature >= mushroom.idealConditions.minTemp &&
            temperature <= mushroom.idealConditions.maxTemp &&
            humidity >= mushroom.idealConditions.minHumidity &&
            (recentRain || mushroom.name === "No Mushrooms") // Rainfall check
        ) {
            mushroomMessage = mushroom.message;
            mushroomImage = mushroom.image;

            if (recentRain) {
                mushroomMessage += ` Recent rain (${rainAmount.toFixed(1)} mm) improves chances of finding this mushroom!`;
            }
            break;
        }
    }
    const locationMessage = customMessages[weatherData.name] || customMessages.default;

    // Display weather and mushroom info
    weatherDisplay.innerHTML = `
        <h2>Weather in ${weatherData.name}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Conditions: ${conditions}</p>
        <p>Rainfall in the past 3 days: ${recentRain ? `${rainAmount.toFixed(1)} mm` : "None"}</p>
        <h3>${mushroomMessage}</h3>
        <img src="${mushroomImage}" alt="Mushroom Image" style="width: 200px; margin-top: 10px;">
    `;
}