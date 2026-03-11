var cityInput = document.getElementById("searchCity");

// Background images for different weather types
var backgrounds = {
  Clear: ["day1.jpg", "day2.jpg", "day3.jpg", "day4.jpg", "day5.jpg"],
  Clouds: ["cloudy1.jpg", "cloudy2.jpg", "cloudy3.jpg", "cloudy4.jpg", "cloudy5.jpg"],
  Rain: ["rainy1.jpg", "rainy2.jpg", "rainy3.jpg", "rainy4.jpg", "rainy5.jpg"],
  Night: ["night1.jpg", "night2.jpg", "night3.jpg", "night4.jpg", "night5.jpg"]
};

// Function to change background based on weather and time of day
function setWeatherBackground(weather, sunrise, sunset) {
  const now = Date.now() / 1000; // Current time in UNIX timestamp
  const isNightTime = now < sunrise || now > sunset;
  
  let category;
  
  if (isNightTime) {
    // Use night backgrounds for all weather conditions during night time
    category = backgrounds.Night;
  } else {
    // Use weather-specific backgrounds during day time
    category = backgrounds[weather] || backgrounds.Clear;
  }
  
  var randomImg = category[Math.floor(Math.random() * category.length)];
  document.body.style.background =
    "linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url('media/" + randomImg + "')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
}

// Function to format time from UNIX timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

// Weather Animation System
function createWeatherAnimation(weatherCondition, isNightTime) {
  const animationsContainer = document.getElementById('weatherAnimations');
  animationsContainer.innerHTML = ''; // Clear previous animations
  
  switch(weatherCondition.toLowerCase()) {
    case 'rain':
    case 'drizzle':
      createRainAnimation(animationsContainer);
      break;
    case 'snow':
      createSnowAnimation(animationsContainer);
      break;
    case 'thunderstorm':
      createRainAnimation(animationsContainer);
      createLightningEffect(animationsContainer);
      break;
    case 'clouds':
      createCloudAnimation(animationsContainer);
      break;
    case 'clear':
      if (!isNightTime) {
        createSunAnimation(animationsContainer);
      } else {
        createMoonAnimation(animationsContainer);
      }
      break;
  }
}

function createRainAnimation(container) {
  const rainContainer = document.createElement('div');
  rainContainer.className = 'rain-animation';
  
  for (let i = 0; i < 50; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
    drop.style.animationDelay = Math.random() * 2 + 's';
    rainContainer.appendChild(drop);
  }
  
  container.appendChild(rainContainer);
}

function createSnowAnimation(container) {
  const snowContainer = document.createElement('div');
  snowContainer.className = 'snow-animation';
  
  for (let i = 0; i < 30; i++) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
    snowflake.style.animationDelay = Math.random() * 2 + 's';
    snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
    snowContainer.appendChild(snowflake);
  }
  
  container.appendChild(snowContainer);
}

function createCloudAnimation(container) {
  const cloudContainer = document.createElement('div');
  cloudContainer.className = 'cloud-animation';
  
  for (let i = 0; i < 3; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.style.width = (Math.random() * 100 + 100) + 'px';
    cloud.style.height = (Math.random() * 40 + 40) + 'px';
    cloud.style.top = Math.random() * 100 + '%';
    cloud.style.animationDuration = (Math.random() * 10 + 15) + 's';
    cloud.style.animationDelay = Math.random() * 5 + 's';
    cloudContainer.appendChild(cloud);
  }
  
  container.appendChild(cloudContainer);
}

function createLightningEffect(container) {
  setInterval(() => {
    if (Math.random() > 0.8) {
      const lightning = document.createElement('div');
      lightning.className = 'lightning';
      container.appendChild(lightning);
      
      setTimeout(() => {
        lightning.remove();
      }, 200);
    }
  }, 3000);
}

function createSunAnimation(container) {
  const sun = document.createElement('div');
  sun.className = 'celestial-body sun';
  sun.style.top = '10%';
  sun.style.right = '10%';
  container.appendChild(sun);
}

function createMoonAnimation(container) {
  const moon = document.createElement('div');
  moon.className = 'celestial-body moon';
  moon.style.top = '10%';
  moon.style.right = '10%';
  container.appendChild(moon);
}

// Function to get weather by coordinates
async function getWeatherByCoords(lat, lon) {
  var apiKey = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
  var unit = "metric";
  var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  
  try {
    // Get current weather
    var weatherResponse = await fetch(weatherUrl);
    var weatherData = await weatherResponse.json();
    
    if (weatherData.cod === 200) {
      updateWeatherDisplay(weatherData);
      setWeatherBackground(weatherData.weather[0].main, weatherData.sys.sunrise, weatherData.sys.sunset);
      
      // Get forecast
      var forecastResponse = await fetch(forecastUrl);
      var forecastData = await forecastResponse.json();
      updateForecastDisplay(forecastData);
    }
  } catch (error) {
    console.error("Error fetching weather by coordinates:", error);
    document.getElementById("locationName").innerHTML = "Location Error";
  }
}

// Function to update weather display
function updateWeatherDisplay(data) {
  var location = data.name;
  var temperature = data.main.temp;
  var weatherType = data.weather[0].description;
  var weatherMain = data.weather[0].main;
  var realFeel = data.main.feels_like;
  var windSpeed = data.wind.speed;
  var windDirection = data.wind.deg;
  var visibility = data.visibility / 1000;
  var pressure = data.main.pressure;
  var maxTemperature = data.main.temp_max;
  var minTemperature = data.main.temp_min;
  var humidity = data.main.humidity;
  var sunrise = data.sys.sunrise;
  var sunset = data.sys.sunset;

  // Determine if it's night time
  const now = Date.now() / 1000;
  const isNightTime = now < sunrise || now > sunset;
  
  // Create weather animations
  createWeatherAnimation(weatherMain, isNightTime);
  
  // Display smart features
  displaySmartFeatures(data);

  document.getElementById("locationName").innerHTML = location;
  document.getElementById("temperatureValue").innerHTML = temperature + "<sup>o</sup>C";
  document.getElementById("weatherType").innerHTML = weatherType;
  document.getElementById("realFeelAdditionalValue").innerHTML = realFeel + "<sup>o</sup>C";
  document.getElementById("windSpeedAdditionalValue").innerHTML = windSpeed + " km/h";
  document.getElementById("windDirectionAdditionalValue").innerHTML = windDirection + "°";
  document.getElementById("visibilityAdditionalValue").innerHTML = visibility + " km";
  document.getElementById("pressureAdditionalValue").innerHTML = pressure + " hPa";
  document.getElementById("maxTemperatureAdditionalValue").innerHTML = maxTemperature + "<sup>o</sup>C";
  document.getElementById("minTemperatureAdditionalValue").innerHTML = minTemperature + "<sup>o</sup>C";
  document.getElementById("humidityAdditionalValue").innerHTML = humidity + "%";
  document.getElementById("sunriseAdditionalValue").innerHTML = formatTime(sunrise);
  document.getElementById("sunsetAdditionalValue").innerHTML = formatTime(sunset);
}

// Function to update forecast display
function updateForecastDisplay(data) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = '';

  const dailyForecasts = {};
  data.list.forEach(entry => {
    const dateTime = new Date(entry.dt * 1000);
    const date = dateTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date: date,
        icon: `https://openweathermap.org/img/w/${entry.weather[0].icon}.png`,
        maxTemp: -Infinity,
        minTemp: Infinity,
        weatherType: entry.weather[0].main
      };
    }
    if (entry.main.temp_max > dailyForecasts[date].maxTemp) {
      dailyForecasts[date].maxTemp = entry.main.temp_max;
    }
    if (entry.main.temp_min < dailyForecasts[date].minTemp) {
      dailyForecasts[date].minTemp = entry.main.temp_min;
    }
  });

  Object.values(dailyForecasts).slice(0, 5).forEach(day => {
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('daily-forecast-card');
    forecastCard.innerHTML = `
      <p class="daily-forecast-date">${day.date}</p>
      <div class="daily-forecast-logo">
        <img class="imgs-as-icons" src="${day.icon}">
      </div>
      <div class="max-min-temperature-daily-forecast">
        <span class="max-daily-forecast">${Math.round(day.maxTemp)}<sup>o</sup>C</span>
        <span class="min-daily-forecast">${Math.round(day.minTemp)}<sup>o</sup>C</span>
      </div>
      <p class="weather-type-daily-forecast">${day.weatherType}</p>
    `;
    forecastContainer.appendChild(forecastCard);
  });
}

// Function to get user's current location
function getCurrentLocationWeather() {
  loader();
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        await getWeatherByCoords(lat, lon);
      },
      (error) => {
        console.error("Geolocation error:", error);
        document.getElementById("locationName").innerHTML = "Location access denied";
        document.getElementById("temperatureValue").innerHTML = "";
        document.getElementById("weatherType").innerHTML = "Please search manually";
      }
    );
  } else {
    document.getElementById("locationName").innerHTML = "Geolocation not supported";
    document.getElementById("temperatureValue").innerHTML = "";
    document.getElementById("weatherType").innerHTML = "Please search manually";
  }
}

// Loader animation for weather data
function loader() {
  document.getElementById("locationName").innerHTML = "";
  document.getElementById("temperatureValue").innerHTML = "";
  document.getElementById("weatherType").innerHTML = "";

  const loaders = ["locationName", "temperatureValue", "weatherType"];
  loaders.forEach(id => {
    const img = document.createElement("img");
    img.src = "icons/loader.gif";
    img.id = `loader-${id}`;
    document.getElementById(id).appendChild(img);
  });
}

cityInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    loader();
    var cityInput = document.getElementById("searchCity");
    var searchBtn = document.getElementById("searchBtn");
    var apiKey = process.env.OPENWEATHER_API_KEY || "YOUR_API_KEY_HERE";
    var unit = "metric";
    var cityInputValue = cityInput.value.trim();
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInputValue}&appid=${apiKey}&units=${unit}`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInputValue}&appid=${apiKey}&units=${unit}`;

    if (cityInputValue !== "") {
      async function getWeather() {
        try {
          var response = await fetch(apiUrl);
          var data = await response.json();

          if (data.message !== "city not found" && data.cod !== "404") {
            updateWeatherDisplay(data);
            setWeatherBackground(data.weather[0].main, data.sys.sunrise, data.sys.sunset);
            
            // Get forecast
            var forecastResponse = await fetch(forecastUrl);
            var forecastData = await forecastResponse.json();
            updateForecastDisplay(forecastData);
          } else {
            document.getElementById("locationName").innerHTML = "City Not Found";
            document.getElementById("temperatureValue").innerHTML = "";
            document.getElementById("weatherType").innerHTML = "";
          }
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }

      getWeather();
    } else {
      document.getElementById("locationName").innerHTML = "Enter a city name...";
    }
  }
});

// Auto-load weather for current location on page load
document.addEventListener('DOMContentLoaded', function() {
  getCurrentLocationWeather();
  
  // Add event listener for location button
  const locationBtn = document.getElementById('locationBtn');
  if (locationBtn) {
    locationBtn.addEventListener('click', function(e) {
      e.preventDefault();
      getCurrentLocationWeather();
    });
  }
  
  // Add event listener for mobile location button
  const mobileLocationBtn = document.getElementById('mobileLocationBtn');
  if (mobileLocationBtn) {
    mobileLocationBtn.addEventListener('click', function(e) {
      e.preventDefault();
      getCurrentLocationWeather();
    });
  }
});
