// Weather Notifications System

class WeatherNotifications {
  constructor() {
    this.permission = false;
    this.initNotifications();
  }

  async initNotifications() {
    // Request notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        this.permission = permission === 'granted';
      } else {
        this.permission = Notification.permission === 'granted';
      }
    }
  }

  showWeatherNotification(data) {
    if (!this.permission) return;

    const temp = Math.round(data.main.temp);
    const weatherMain = data.weather[0].main;
    const description = data.weather[0].description;
    const location = data.name;
    
    // Create notification title and body
    const title = `Weather in ${location}`;
    const body = `${temp}°C, ${description}`;
    const icon = this.getWeatherIcon(weatherMain);
    
    // Create notification
    const notification = new Notification(title, {
      body: body,
      icon: icon,
      badge: 'icons/favicon.ico',
      tag: 'weather-update',
      requireInteraction: false,
      silent: false
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    // Add click handler
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  getWeatherIcon(weatherMain) {
    const iconMap = {
      'Clear': 'icons/sunny.png',
      'Clouds': 'icons/cloudy.png',
      'Rain': 'icons/rainy.png',
      'Drizzle': 'icons/rainy.png',
      'Thunderstorm': 'icons/thunderstorm.png',
      'Snow': 'icons/snowy.png',
      'Mist': 'icons/cloudy.png',
      'Fog': 'icons/cloudy.png',
      'Haze': 'icons/cloudy.png'
    };
    
    return iconMap[weatherMain] || 'icons/sunny.png';
  }

  showDailyWeatherSummary(data) {
    if (!this.permission) return;

    const temp = Math.round(data.main.temp);
    const weatherMain = data.weather[0].main;
    const location = data.name;
    const timeOfDay = this.getTimeOfDay();
    
    let title = `Good ${timeOfDay}! 🌤️`;
    let body = `${temp}°C in ${location}. `;
    
    // Add weather-specific advice
    if (weatherMain === 'Clear') {
      body += 'Beautiful day ahead!';
    } else if (weatherMain === 'Rain') {
      body += 'Don\'t forget your umbrella ☔';
    } else if (weatherMain === 'Snow') {
      body += 'Bundle up and stay warm! ❄️';
    } else if (weatherMain === 'Clouds') {
      body += 'Overcast but comfortable day';
    }

    const notification = new Notification(title, {
      body: body,
      icon: 'icons/favicon.ico',
      badge: 'icons/favicon.ico',
      tag: 'daily-summary',
      requireInteraction: false
    });

    setTimeout(() => {
      notification.close();
    }, 8000);
  }

  showWeatherAlert(alertData) {
    if (!this.permission) return;

    const notification = new Notification(`⚠️ Weather Alert: ${alertData.event}`, {
      body: alertData.description,
      icon: 'icons/favicon.ico',
      badge: 'icons/favicon.ico',
      tag: 'weather-alert',
      requireInteraction: true,
      urgent: true
    });

    // Don't auto-close alerts
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  getTimeOfDay() {
    const hour = new Date().getHours();
    
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    if (hour < 21) return 'Evening';
    return 'Night';
  }

  scheduleDailyNotification(data) {
    // Schedule notification for next day at 8 AM
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    
    const timeUntilNotification = tomorrow - now;
    
    setTimeout(() => {
      this.showDailyWeatherSummary(data);
      // Schedule again for next day
      this.scheduleDailyNotification(data);
    }, timeUntilNotification);
  }

  requestPermission() {
    return new Promise((resolve) => {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          this.permission = permission === 'granted';
          resolve(this.permission);
        });
      } else {
        resolve(false);
      }
    });
  }
}

// Initialize notifications system
document.addEventListener('DOMContentLoaded', function() {
  const notifications = new WeatherNotifications();
  
  // Make notifications globally accessible
  window.weatherNotifications = notifications;
  
  // Add notification button to navbar
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const notificationBtn = document.createElement('li');
    notificationBtn.innerHTML = '<a href="#" id="notificationBtn" title="Enable Weather Notifications">🔔</a>';
    
    // Insert before the search input
    const searchInput = navbar.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.parentNode.insertBefore(notificationBtn, searchInput);
    }
    
    // Add click event
    notificationBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      
      if (!notifications.permission) {
        const granted = await notifications.requestPermission();
        if (granted) {
          alert('Weather notifications enabled! You\'ll receive daily weather updates.');
          notificationBtn.querySelector('a').innerHTML = '🔕';
          notificationBtn.querySelector('a').title = 'Disable Weather Notifications';
        } else {
          alert('Notifications were denied. You can enable them in your browser settings.');
        }
      } else {
        // Toggle notifications (you could implement disable functionality here)
        alert('Weather notifications are already enabled!');
      }
    });
  }
  
  // Show notification when weather data is loaded (with delay to avoid spam)
  let notificationShown = false;
  const originalUpdateWeatherDisplay = window.updateWeatherDisplay;
  
  if (originalUpdateWeatherDisplay) {
    window.updateWeatherDisplay = function(data) {
      originalUpdateWeatherDisplay.call(this, data);
      
      // Show notification only once per session for location-based weather
      if (!notificationShown && notifications.permission) {
        setTimeout(() => {
          notifications.showWeatherNotification(data);
          notificationShown = true;
        }, 2000);
      }
    };
  }
});
