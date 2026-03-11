// Navbar Buttons Functionality

class NavbarButtons {
  constructor() {
    this.favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
    this.currentCity = '';
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.applyDarkMode();
    this.loadUserPreferences();
  }

  loadUserPreferences() {
    // Load theme preference
    const savedTheme = this.getUserPreference('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      this.applyDarkMode();
      
      const themeBtn = document.getElementById('themeBtn');
      if (themeBtn) {
        themeBtn.textContent = this.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
      }
    }
  }

  setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.refreshWeather();
      });
    }

    // Favorite button
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleFavorite();
      });
    }

    // Menu button
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleDropdown();
      });
    }

    // Dropdown menu items
    document.getElementById('settingsBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showSettings();
    });

    document.getElementById('aboutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showAbout();
    });

    document.getElementById('shareBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.shareWeather();
    });

    document.getElementById('themeBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleDarkMode();
    });

    document.getElementById('helpBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showHelp();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#menuBtn') && !e.target.closest('.dropdown-menu')) {
        this.closeDropdown();
      }
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal(e.target);
      }
    });
  }

  refreshWeather() {
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.classList.add('spinning');
    
    // Get current search value or use current location
    const searchInput = document.getElementById('searchCity');
    const mobileSearchInput = document.getElementById('mobileSearchCity');
    
    if (searchInput && searchInput.value.trim()) {
      // Trigger search for current city
      searchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    } else if (mobileSearchInput && mobileSearchInput.value.trim()) {
      mobileSearchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    } else {
      // Refresh current location
      if (window.getCurrentLocationWeather) {
        window.getCurrentLocationWeather();
      }
    }
    
    this.showToast('Weather refreshed! 🔄');
    
    setTimeout(() => {
      refreshBtn.classList.remove('spinning');
    }, 1000);
  }

  toggleFavorite() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const locationName = document.getElementById('locationName').textContent;
    
    if (!locationName || locationName === 'Search City...' || locationName === 'City Not Found') {
      this.showToast('Search for a city first! 🔍');
      return;
    }

    // Use location features system if available
    if (window.locationFeatures) {
      const isFavorited = window.locationFeatures.favorites.includes(locationName);
      
      if (isFavorited) {
        window.locationFeatures.removeFromFavorites(locationName);
        favoriteBtn.textContent = '☆';
        favoriteBtn.classList.remove('favorited');
      } else {
        window.locationFeatures.addToFavorites(locationName);
        favoriteBtn.textContent = '★';
        favoriteBtn.classList.add('favorited');
      }
    } else {
      // Fallback to original method
      const isFavorited = this.favorites.includes(locationName);
      
      if (isFavorited) {
        this.favorites = this.favorites.filter(city => city !== locationName);
        favoriteBtn.textContent = '☆';
        favoriteBtn.classList.remove('favorited');
        this.showToast(`Removed ${locationName} from favorites ⭐`);
      } else {
        this.favorites.push(locationName);
        favoriteBtn.textContent = '★';
        favoriteBtn.classList.add('favorited');
        this.showToast(`Added ${locationName} to favorites! ⭐`);
      }
      
      localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
    }
  }

  toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('show');
  }

  closeDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.remove('show');
  }

  showSettings() {
    this.closeDropdown();
    this.createModal('Settings', `
      <h3>⚙️ Settings</h3>
      <p><strong>Temperature Unit:</strong> Celsius (°C)</p>
      <p><strong>Wind Speed:</strong> km/h</p>
      <p><strong>Time Format:</strong> 12-hour</p>
      <p><strong>Language:</strong> English</p>
      <br>
      <p><strong>Favorites:</strong> ${this.favorites.length} cities saved</p>
      <p><strong>Dark Mode:</strong> ${this.isDarkMode ? 'Enabled' : 'Disabled'}</p>
      <br>
      <p><em>More settings coming soon!</em></p>
    `);
  }

  showAbout() {
    this.closeDropdown();
    this.createModal('About', `
      <h3>🌤️ Weather Forecast App</h3>
      <p><strong>Version:</strong> 2.0</p>
      <p><strong>Developer:</strong> SAMITH RAJ</p>
      <p><strong>API:</strong> OpenWeatherMap</p>
      <br>
      <p>A beautiful, real-time weather application with automatic location detection, smart suggestions, and interactive animations.</p>
      <br>
      <p><strong>Features:</strong></p>
      <ul style="text-align: left; color: #666;">
        <li>📍 Automatic location detection</li>
        <li>🌧️ Dynamic weather animations</li>
        <li>🎙️ Voice search</li>
        <li>💡 Smart suggestions</li>
        <li>🔔 Weather notifications</li>
        <li>⭐ Favorite cities</li>
      </ul>
      <br>
      <p><a href="https://github.com/SAMITH-07/weather-app" target="_blank" style="color: #007bff;">View on GitHub</a></p>
    `);
  }

  shareWeather() {
    this.closeDropdown();
    const locationName = document.getElementById('locationName').textContent;
    const temperature = document.getElementById('temperatureValue').textContent;
    const weatherType = document.getElementById('weatherType').textContent;
    
    if (!locationName || locationName === 'Search City...') {
      this.showToast('Search for a city first! 🔍');
      return;
    }

    const shareText = `The weather in ${locationName} is ${temperature} with ${weatherType}. Check it out! 🌤️`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Weather Forecast',
        text: shareText,
        url: window.location.href
      }).catch(() => {
        this.copyToClipboard(shareText);
      });
    } else {
      this.copyToClipboard(shareText);
    }
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Weather info copied to clipboard! 📋');
    }).catch(() => {
      this.showToast('Failed to copy to clipboard');
    });
  }

  toggleDarkMode() {
    this.closeDropdown();
    this.isDarkMode = !this.isDarkMode;
    this.applyDarkMode();
    localStorage.setItem('darkMode', this.isDarkMode);
    
    const themeBtn = document.getElementById('themeBtn');
    themeBtn.textContent = this.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    
    // Update theme preference in user settings
    this.updateUserPreference('theme', this.isDarkMode ? 'dark' : 'light');
    
    this.showToast(`${this.isDarkMode ? 'Dark' : 'Light'} mode enabled! ${this.isDarkMode ? '🌙' : '☀️'}`);
  }

  applyDarkMode() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  updateUserPreference(key, value) {
    let preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    preferences[key] = value;
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }

  getUserPreference(key, defaultValue = null) {
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    return preferences[key] || defaultValue;
  }

  showHelp() {
    this.closeDropdown();
    this.createModal('Help', `
      <h3>❓ How to Use</h3>
      <p><strong>📍 Location:</strong> Click the location button for auto-detection</p>
      <p><strong>🔍 Search:</strong> Type a city name and press Enter</p>
      <p><strong>🎙️ Voice Search:</strong> Click the microphone and speak</p>
      <p><strong>🔄 Refresh:</strong> Click refresh to update weather data</p>
      <p><strong>⭐ Favorites:</strong> Click star to save current city</p>
      <p><strong>🔔 Notifications:</strong> Enable for daily weather updates</p>
      <br>
      <p><strong>Voice Commands:</strong></p>
      <ul style="text-align: left; color: #666;">
        <li>"What's the weather in London?"</li>
        <li>"Weather for New York"</li>
        <li>"Show me Paris weather"</li>
      </ul>
      <br>
      <p><strong>Features:</strong></p>
      <ul style="text-align: left; color: #666;">
        <li>🌧️ Weather animations based on conditions</li>
        <li>💡 Smart suggestions for clothing and activities</li>
        <li>🌅 Day/night backgrounds</li>
        <li>📱 Fully responsive design</li>
      </ul>
    `);
  }

  createModal(title, content) {
    // Remove existing modal
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>${title}</h2>
        ${content}
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Close modal handlers
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => this.closeModal(modal));
  }

  closeModal(modal) {
    if (modal) {
      modal.remove();
    } else {
      const existingModal = document.querySelector('.modal');
      if (existingModal) {
        existingModal.remove();
      }
    }
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

  updateFavoriteButton(city) {
    const favoriteBtn = document.getElementById('favoriteBtn');
    
    // Use location features system if available
    if (window.locationFeatures) {
      const isFavorited = window.locationFeatures.favorites.includes(city);
      if (isFavorited) {
        favoriteBtn.textContent = '★';
        favoriteBtn.classList.add('favorited');
      } else {
        favoriteBtn.textContent = '☆';
        favoriteBtn.classList.remove('favorited');
      }
    } else {
      // Fallback to original method
      if (this.favorites.includes(city)) {
        favoriteBtn.textContent = '★';
        favoriteBtn.classList.add('favorited');
      } else {
        favoriteBtn.textContent = '☆';
        favoriteBtn.classList.remove('favorited');
      }
    }
  }
}

// Initialize navbar buttons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.navbarButtons = new NavbarButtons();
  
  // Update favorite button when weather data changes
  const originalUpdateWeatherDisplay = window.updateWeatherDisplay;
  if (originalUpdateWeatherDisplay) {
    window.updateWeatherDisplay = function(data) {
      originalUpdateWeatherDisplay.call(this, data);
      window.navbarButtons.updateFavoriteButton(data.name);
    };
  }
});
