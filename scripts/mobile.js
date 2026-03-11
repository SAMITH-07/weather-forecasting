var cityInputMobile = document.getElementById("mobileSearchCity");

// Mobile search event listener
cityInputMobile.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    loader();
    var cityInputValue = cityInputMobile.value.trim();
    var apiKey = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
    var unit = "metric";
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