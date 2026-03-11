// Location Features System - Saved Locations, Recent Searches, Location History

class LocationFeatures {
  constructor() {
    this.favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
    this.recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    this.locationHistory = JSON.parse(localStorage.getItem('locationHistory')) || [];
    this.maxRecentSearches = 5;
    this.init();
  }

  init() {
    this.createLocationUI();
    this.setupEventListeners();
    this.updateLocationUI();
  }

  createLocationUI() {
    // Create location features container
    const locationContainer = document.createElement('div');
    locationContainer.id = 'locationFeatures';
    locationContainer.className = 'location-features-container';
    locationContainer.innerHTML = `
      <div class="location-tabs">
        <button class="tab-btn active" data-tab="favorites">⭐ Favorites</button>
        <button class="tab-btn" data-tab="recent">🕐 Recent</button>
        <button class="tab-btn" data-tab="history">📊 History</button>
      </div>
      
      <div class="location-content">
        <div id="favorites-tab" class="tab-content active">
          <div class="location-list" id="favoritesList"></div>
        </div>
        
        <div id="recent-tab" class="tab-content">
          <div class="location-list" id="recentList"></div>
        </div>
        
        <div id="history-tab" class="tab-content">
          <div class="location-list" id="historyList"></div>
        </div>
      </div>
      
      <button class="location-toggle-btn" id="locationToggleBtn">📍</button>
    `;

    // Insert after the navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.parentNode.insertBefore(locationContainer, navbar.nextSibling);
    }
  }

  setupEventListeners() {
    // Toggle button
    const toggleBtn = document.getElementById('locationToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleLocationPanel());
    }

    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      const container = document.getElementById('locationFeatures');
      if (container && !container.contains(e.target) && !e.target.closest('.navbar')) {
        this.closeLocationPanel();
      }
    });
  }

  toggleLocationPanel() {
    const container = document.getElementById('locationFeatures');
    container.classList.toggle('open');
    
    const toggleBtn = document.getElementById('locationToggleBtn');
    if (container.classList.contains('open')) {
      toggleBtn.textContent = '✖️';
      toggleBtn.title = 'Close location panel';
    } else {
      toggleBtn.textContent = '📍';
      toggleBtn.title = 'Open location panel';
    }
  }

  closeLocationPanel() {
    const container = document.getElementById('locationFeatures');
    container.classList.remove('open');
    
    const toggleBtn = document.getElementById('locationToggleBtn');
    toggleBtn.textContent = '📍';
    toggleBtn.title = 'Open location panel';
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
  }

  addToFavorites(city) {
    if (!this.favorites.includes(city)) {
      this.favorites.push(city);
      this.saveFavorites();
      this.updateFavoritesList();
      this.showToast(`Added ${city} to favorites! ⭐`);
    } else {
      this.showToast(`${city} is already in favorites!`);
    }
  }

  removeFromFavorites(city) {
    this.favorites = this.favorites.filter(c => c !== city);
    this.saveFavorites();
    this.updateFavoritesList();
    this.showToast(`Removed ${city} from favorites`);
  }

  saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
  }

  addToRecentSearches(city) {
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(c => c !== city);
    
    // Add to beginning
    this.recentSearches.unshift(city);
    
    // Keep only max recent searches
    if (this.recentSearches.length > this.maxRecentSearches) {
      this.recentSearches = this.recentSearches.slice(0, this.maxRecentSearches);
    }
    
    this.saveRecentSearches();
    this.updateRecentList();
  }

  saveRecentSearches() {
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
  }

  addToLocationHistory(city, weatherData) {
    const historyEntry = {
      city: city,
      timestamp: Date.now(),
      temperature: weatherData.main.temp,
      weather: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed
    };

    // Remove existing entry for same city
    this.locationHistory = this.locationHistory.filter(h => h.city !== city);
    
    // Add to beginning
    this.locationHistory.unshift(historyEntry);
    
    // Keep only last 50 entries
    if (this.locationHistory.length > 50) {
      this.locationHistory = this.locationHistory.slice(0, 50);
    }
    
    this.saveLocationHistory();
    this.updateHistoryList();
  }

  saveLocationHistory() {
    localStorage.setItem('locationHistory', JSON.stringify(this.locationHistory));
  }

  updateLocationUI() {
    this.updateFavoritesList();
    this.updateRecentList();
    this.updateHistoryList();
  }

  updateFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    if (!favoritesList) return;

    if (this.favorites.length === 0) {
      favoritesList.innerHTML = '<p class="empty-state">No favorite cities yet. ⭐ Add some!</p>';
      return;
    }

    favoritesList.innerHTML = this.favorites.map(city => `
      <div class="location-item favorite-item" data-city="${city}">
        <div class="location-info">
          <span class="city-name">${city}</span>
          <span class="location-type">Favorite</span>
        </div>
        <div class="location-actions">
          <button class="location-btn search-btn" onclick="locationFeatures.searchCity('${city}')">🔍</button>
          <button class="location-btn remove-btn" onclick="locationFeatures.removeFromFavorites('${city}')">✖️</button>
        </div>
      </div>
    `).join('');
  }

  updateRecentList() {
    const recentList = document.getElementById('recentList');
    if (!recentList) return;

    if (this.recentSearches.length === 0) {
      recentList.innerHTML = '<p class="empty-state">No recent searches yet.</p>';
      return;
    }

    recentList.innerHTML = this.recentSearches.map(city => `
      <div class="location-item recent-item" data-city="${city}">
        <div class="location-info">
          <span class="city-name">${city}</span>
          <span class="location-type">Recent</span>
        </div>
        <div class="location-actions">
          <button class="location-btn search-btn" onclick="locationFeatures.searchCity('${city}')">🔍</button>
          <button class="location-btn favorite-btn" onclick="locationFeatures.addToFavorites('${city}')">⭐</button>
        </div>
      </div>
    `).join('');
  }

  updateHistoryList() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    if (this.locationHistory.length === 0) {
      historyList.innerHTML = '<p class="empty-state">No location history yet.</p>';
      return;
    }

    historyList.innerHTML = this.locationHistory.slice(0, 20).map(entry => {
      const date = new Date(entry.timestamp);
      const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      
      return `
        <div class="location-item history-item" data-city="${entry.city}">
          <div class="location-info">
            <span class="city-name">${entry.city}</span>
            <span class="location-weather">${Math.round(entry.temperature)}°C - ${entry.description}</span>
            <span class="location-time">${formattedDate}</span>
          </div>
          <div class="location-actions">
            <button class="location-btn search-btn" onclick="locationFeatures.searchCity('${entry.city}')">🔍</button>
            <button class="location-btn favorite-btn" onclick="locationFeatures.addToFavorites('${entry.city}')">⭐</button>
          </div>
        </div>
      `;
    }).join('');
  }

  searchCity(city) {
    // Set search input value and trigger search
    const searchInput = document.getElementById('searchCity');
    const mobileSearchInput = document.getElementById('mobileSearchCity');
    
    if (searchInput) {
      searchInput.value = city;
      searchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    } else if (mobileSearchInput) {
      mobileSearchInput.value = city;
      mobileSearchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    }
    
    this.closeLocationPanel();
    this.showToast(`Searching weather for ${city}...`);
  }

  showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Public method to be called when weather data is loaded
  onWeatherDataLoaded(city, weatherData) {
    this.addToRecentSearches(city);
    this.addToLocationHistory(city, weatherData);
  }
}

// Initialize location features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.locationFeatures = new LocationFeatures();
  
  // Hook into weather data loading
  const originalUpdateWeatherDisplay = window.updateWeatherDisplay;
  if (originalUpdateWeatherDisplay) {
    window.updateWeatherDisplay = function(data) {
      originalUpdateWeatherDisplay.call(this, data);
      if (window.locationFeatures) {
        window.locationFeatures.onWeatherDataLoaded(data.name, data);
      }
    };
  }
});
