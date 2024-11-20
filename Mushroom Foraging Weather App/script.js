console.log("Mushroom Foraging Weather App Loaded");
const apiKey = "e02ccfe7503cf3bd2a056f16cff5a378"; // Replace with your actual API key
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
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

async function getWeather(location) {
    try {
        const response = await fetch(`${apiUrl}?q=${location}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error("Location not found!");
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
}
function displayWeather(data) {
    const weatherDisplay = document.getElementById("weather-display");
    const temperature = data.main.temp; // Temperature in Celsius
    const humidity = data.main.humidity; // Humidity percentage
    const conditions = data.weather[0].description; // Weather description

    let mushroomMessage = "";
    let mushroomImage = "";

    // Mushroom logic
    if (humidity > 70 && temperature > 10 && temperature < 25) {
        mushroomMessage = "Perfect conditions for foraging! Look for Chanterelles or Chicken of the Woods.";
        mushroomImage = "images/chanterelle.webp"; // Replace with your image path
    } else if (humidity > 50 && temperature > 5 && temperature < 30) {
        mushroomMessage = "Fair conditions for foraging. You might find some Oyster mushrooms.";
        mushroomImage = "images/oyster.webp"; // Replace with your image path
    } else if (temperature <= 0) {
        mushroomMessage = "Too cold! Mushrooms are unlikely to fruit in freezing temperatures.";
        mushroomImage = "images/no-mushrooms.webp"; // Replace with your image path
    } else {
        mushroomMessage = "Too dry for mushrooms today! Wait for more rain.";
        mushroomImage = "images/dry.webp"; // Replace with your image path
    }

    // Display weather and mushroom info
    weatherDisplay.innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Conditions: ${conditions}</p>
        <h3>${mushroomMessage}</h3>
        <img src="${mushroomImage}" alt="Mushroom Image" style="width: 200px; margin-top: 10px;">
    `;
}
