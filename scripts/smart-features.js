// Smart Weather Features System

// Smart Suggestions Based on Weather
function generateSmartSuggestions(data) {
  const temp = data.main.temp;
  const weatherMain = data.weather[0].main.toLowerCase();
  const windSpeed = data.wind.speed;
  const humidity = data.main.humidity;
  const visibility = data.visibility / 1000;
  
  const suggestions = [];
  
  // Temperature-based suggestions
  if (temp < 0) {
    suggestions.push("🧥 Bundle up! It's freezing outside");
    suggestions.push("⚠️ Risk of hypothermia - limit outdoor time");
  } else if (temp < 10) {
    suggestions.push("🧣 Wear warm layers today");
    suggestions.push("☕ Perfect weather for hot coffee");
  } else if (temp < 20) {
    suggestions.push("👕 Light jacket recommended");
    suggestions.push("🚶 Great weather for a walk");
  } else if (temp < 30) {
    suggestions.push("😊 Perfect temperature for outdoor activities");
    suggestions.push("🌻 Ideal weather for gardening");
  } else {
    suggestions.push("🌞 Stay hydrated and seek shade");
    suggestions.push("🏖️ Perfect beach weather!");
  }
  
  // Weather condition suggestions
  switch(weatherMain) {
    case 'rain':
    case 'drizzle':
      suggestions.push("☔ Don't forget your umbrella");
      suggestions.push("🚗 Drive carefully - wet roads");
      break;
    case 'snow':
      suggestions.push("⛄ Snow day! Build a snowman");
      suggestions.push("🚗 Winter tires recommended");
      break;
    case 'thunderstorm':
      suggestions.push("⚡ Stay indoors during lightning");
      suggestions.push("📱 Unplug electronic devices");
      break;
    case 'clouds':
      suggestions.push("☁️ Overcast but comfortable");
      suggestions.push("📷 Good lighting for photography");
      break;
    case 'clear':
      suggestions.push("🕶️ Don't forget sunglasses");
      suggestions.push("🧴 Apply sunscreen before going out");
      break;
  }
  
  // Wind-based suggestions
  if (windSpeed > 30) {
    suggestions.push("💨 Strong winds - secure loose objects");
    suggestions.push("🏃‍♂️ Challenging for cycling");
  } else if (windSpeed > 15) {
    suggestions.push("🪁 Great weather for kite flying");
  }
  
  // Humidity-based suggestions
  if (humidity > 80) {
    suggestions.push("💧 High humidity - may feel warmer");
    suggestions.push("🏃‍♂️ Exercise may be more strenuous");
  } else if (humidity < 30) {
    suggestions.push("💦 Low humidity - stay moisturized");
    suggestions.push("👃 Consider using lip balm");
  }
  
  // Visibility-based suggestions
  if (visibility < 1) {
    suggestions.push("🌫️ Very low visibility - avoid driving");
  } else if (visibility < 5) {
    suggestions.push("🚗 Use fog lights when driving");
  }
  
  return suggestions.slice(0, 4); // Return max 4 suggestions
}

// Clothing Recommendations
function getClothingRecommendations(temp, weatherMain) {
  const clothing = [];
  
  if (temp < 0) {
    clothing.push("Heavy winter coat", "Warm boots", "Gloves", "Scarf", "Hat");
  } else if (temp < 10) {
    clothing.push("Winter jacket", "Long sleeves", "Pants", "Closed shoes");
  } else if (temp < 20) {
    clothing.push("Light jacket", "Long sleeves", "Jeans", "Sneakers");
  } else if (temp < 30) {
    clothing.push("T-shirt", "Shorts", "Light pants", "Sandals/Sneakers");
  } else {
    clothing.push("Light breathable clothes", "Shorts", "Sun hat", "Sunglasses");
  }
  
  if (weatherMain.includes('rain')) {
    clothing.push("Rain jacket", "Waterproof shoes");
  }
  
  if (weatherMain.includes('snow')) {
    clothing.push("Waterproof boots", "Extra warm layers");
  }
  
  return clothing;
}

// Activity Recommendations
function getActivityRecommendations(data) {
  const temp = data.main.temp;
  const weatherMain = data.weather[0].main.toLowerCase();
  const windSpeed = data.wind.speed;
  const activities = [];
  
  // Perfect conditions
  if (weatherMain === 'clear' && temp >= 15 && temp <= 25 && windSpeed < 15) {
    activities.push("🏃‍♂️ Running/Jogging", "🚴‍♂️ Cycling", "🧘‍♂️ Outdoor Yoga", "📸 Photography");
  }
  
  // Temperature-based activities
  if (temp >= 20 && temp <= 30) {
    activities.push("🏖️ Beach activities", "🏊‍♂️ Swimming", "🎨 Outdoor painting");
  }
  
  if (temp < 10) {
    activities.push("☕ Indoor café visits", "📚 Reading indoors", "🎬 Movie marathon");
  }
  
  // Weather-based activities
  switch(weatherMain) {
    case 'rain':
      activities.push("🏛️ Museum visits", "☕ Cozy café time", "🎮 Indoor gaming");
      break;
    case 'snow':
      activities.push("⛄ Snow activities", "🏔️ Winter sports", "🍲 Hot soup making");
      break;
    case 'clouds':
      activities.push("🚶‍♂️ Light walking", "🛍️ Shopping", "🎨 Indoor crafts");
      break;
  }
  
  return activities.slice(0, 4);
}

// Display Smart Suggestions
function displaySmartFeatures(data) {
  const suggestions = generateSmartSuggestions(data);
  const clothing = getClothingRecommendations(data.main.temp, data.weather[0].main);
  const activities = getActivityRecommendations(data);
  
  // Create or update smart features container
  let smartFeaturesContainer = document.getElementById('smartFeatures');
  if (!smartFeaturesContainer) {
    smartFeaturesContainer = document.createElement('div');
    smartFeaturesContainer.id = 'smartFeatures';
    smartFeaturesContainer.className = 'smart-features-container';
    
    // Insert after the daily forecast section
    const dailyForecast = document.querySelector('.daily-forecast');
    if (dailyForecast) {
      dailyForecast.parentNode.insertBefore(smartFeaturesContainer, dailyForecast.nextSibling);
    }
  }
  
  smartFeaturesContainer.innerHTML = `
    <div class="smart-features-grid">
      <div class="smart-feature-card">
        <h3>💡 Smart Tips</h3>
        <ul>
          ${suggestions.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      
      <div class="smart-feature-card">
        <h3>👕 What to Wear</h3>
        <ul>
          ${clothing.slice(0, 4).map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
      
      <div class="smart-feature-card">
        <h3>🎯 Activities</h3>
        <ul>
          ${activities.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}
