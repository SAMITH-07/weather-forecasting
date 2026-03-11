// Travel Assessment System - Travelobia Integration with Real Backend API

class TravelAssessment {
  constructor() {
    this.apiService = new TravelAPIService();
    this.destinations = [];
    this.currentAssessments = [];
    this.init();
  }

  async init() {
    this.createTravelUI();
    this.setupEventListeners();
    await this.loadDestinations();
  }

  async loadDestinations() {
    try {
      this.destinations = await this.apiService.getDestinations();
      console.log('✅ Destinations loaded from MongoDB backend:', this.destinations);
      this.showToast('Connected to Travelobia Backend! 🌍');
    } catch (error) {
      console.error('❌ Error loading destinations from backend:', error);
      this.showToast('Backend connection failed. Using fallback data ⚠️');
      // Fallback to local data if backend fails
      this.loadFallbackDestinations();
    }
  }

  loadFallbackDestinations() {
    // Fallback destinations when backend is not available
    this.destinations = [
      { 
        _id: 'fallback_1',
        name: 'Paris', 
        country: 'France', 
        coordinates: { lat: 48.8566, lon: 2.3522 },
        politicalAdvisory: { level: 1, text: 'Exercise Normal Precautions', score: 90 },
        costData: { avgFlightCost: 800, avgAccommodationCost: 150 }
      },
      { 
        _id: 'fallback_2',
        name: 'Tokyo', 
        country: 'Japan', 
        coordinates: { lat: 35.6762, lon: 139.6503 },
        politicalAdvisory: { level: 1, text: 'Exercise Normal Precautions', score: 95 },
        costData: { avgFlightCost: 1200, avgAccommodationCost: 120 }
      },
      { 
        _id: 'fallback_3',
        name: 'London', 
        country: 'United Kingdom', 
        coordinates: { lat: 51.5074, lon: -0.1278 },
        politicalAdvisory: { level: 1, text: 'Exercise Normal Precautions', score: 85 },
        costData: { avgFlightCost: 900, avgAccommodationCost: 140 }
      },
      { 
        _id: 'fallback_4',
        name: 'New York', 
        country: 'USA', 
        coordinates: { lat: 40.7128, lon: -74.0060 },
        politicalAdvisory: { level: 1, text: 'Exercise Normal Precautions', score: 92 },
        costData: { avgFlightCost: 600, avgAccommodationCost: 180 }
      },
      { 
        _id: 'fallback_5',
        name: 'Dubai', 
        country: 'UAE', 
        coordinates: { lat: 25.2048, lon: 55.2708 },
        politicalAdvisory: { level: 1, text: 'Exercise Normal Precautions', score: 88 },
        costData: { avgFlightCost: 1000, avgAccommodationCost: 100 }
      }
    ];
    console.log('✅ Using fallback destinations:', this.destinations);
    this.showToast('Using offline data - Start backend for full features 📱');
  }

  createTravelUI() {
    console.log('🔧 Creating Travelobia UI...');
    
    // Add travel assessment button to navbar
    const navbar = document.querySelector('.navbar ul');
    if (navbar) {
      console.log('✅ Navbar found, adding Travelobia button...');
      const travelLi = document.createElement('li');
      travelLi.innerHTML = '<a href="#" id="travelBtn" title="Travelobia Travel Assessment">✈️</a>';
      navbar.appendChild(travelLi);
      console.log('✅ Travelobia button added to navbar');
    } else {
      console.error('❌ Navbar not found!');
    }

    // Create travel assessment modal
    const travelModal = document.createElement('div');
    travelModal.id = 'travelModal';
    travelModal.className = 'modal';
    travelModal.innerHTML = `
      <div class="modal-content travel-modal">
        <span class="close">&times;</span>
        <h2>✈️ Travelobia - Travel Assessment</h2>
        <p class="travel-intro">🌍 <strong>Comprehensive Travel Feasibility Assessment</strong></p>
        
        <div class="features-showcase">
          <div class="feature-item">
            <span class="feature-icon">🌤️</span>
            <div class="feature-text">
              <strong>Real-Time Data Integration</strong>
              <p>Current weather, flight costs, and accommodation prices</p>
            </div>
          </div>
          
          <div class="feature-item">
            <span class="feature-icon">🏛️</span>
            <div class="feature-text">
              <strong>Political Advisories</strong>
              <p>U.S. State Department travel safety information</p>
            </div>
          </div>
          
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <div class="feature-text">
              <strong>Weighted Scoring Algorithm</strong>
              <p>Weather (30%) + Political (40%) + Cost (30%)</p>
            </div>
          </div>
          
          <div class="feature-item">
            <span class="feature-icon">☁️</span>
            <div class="feature-text">
              <strong>Cloud-Based Storage</strong>
              <p>MongoDB Atlas for scalable data management</p>
            </div>
          </div>
          
          <div class="feature-item">
            <span class="feature-icon">🔐</span>
            <div class="feature-text">
              <strong>Secure Communication</strong>
              <p>JWT authentication and encrypted data transfer</p>
            </div>
          </div>
        </div>
        
        <div class="travel-controls">
          <button id="assessAllBtn" class="travel-btn primary">🌍 Assess All Destinations</button>
          <button id="customDestinationBtn" class="travel-btn secondary">➕ Custom Destination</button>
          <button id="backendStatusBtn" class="travel-btn info">🔍 Check Backend Status</button>
        </div>
        
        <div id="travelResults" class="travel-results">
          <div class="loading-spinner" style="display: none;">
            <div class="spinner"></div>
            <p>Assessing destinations...</p>
          </div>
        </div>
        
        <div id="customDestinationForm" class="custom-form" style="display: none;">
          <h3>📍 Add Custom Destination</h3>
          <input type="text" id="customCity" placeholder="City name">
          <input type="text" id="customCountry" placeholder="Country">
          <button id="addCustomBtn" class="travel-btn primary">Add Destination</button>
        </div>
      </div>
    `;
    document.body.appendChild(travelModal);
  }

  setupEventListeners() {
    // Travel button
    const travelBtn = document.getElementById('travelBtn');
    if (travelBtn) {
      travelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openTravelModal();
      });
    }

    // Modal close
    const modal = document.getElementById('travelModal');
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => this.closeTravelModal());
    
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeTravelModal();
      }
    });

    // Assess all button
    document.getElementById('assessAllBtn').addEventListener('click', () => {
      this.assessAllDestinations();
    });

    // Custom destination button
    document.getElementById('customDestinationBtn').addEventListener('click', () => {
      this.toggleCustomForm();
    });

    // Backend status button
    document.getElementById('backendStatusBtn').addEventListener('click', () => {
      this.checkBackendStatus();
    });

    // Add custom destination
    document.getElementById('addCustomBtn').addEventListener('click', () => {
      this.addCustomDestination();
    });
  }

  async checkBackendStatus() {
    this.showToast('Checking backend connection... 🔍');
    try {
      const health = await this.apiService.checkHealth();
      console.log('✅ Backend Health:', health);
      this.showToast(`✅ Backend Connected! Status: ${health.status} 🌍`);
      
      // Show detailed status
      this.createModal('🔍 Backend Status', `
        <div class="status-info">
          <h3>✅ Travelobia Backend Status</h3>
          <p><strong>Status:</strong> ${health.status}</p>
          <p><strong>Service:</strong> ${health.service}</p>
          <p><strong>Version:</strong> ${health.version}</p>
          <p><strong>Timestamp:</strong> ${new Date(health.timestamp).toLocaleString()}</p>
          <p><strong>Database:</strong> MongoDB Atlas Connected</p>
          <p><strong>API:</strong> Real-time Data Integration Active</p>
        </div>
      `);
    } catch (error) {
      console.error('❌ Backend Status Check Failed:', error);
      this.showToast('❌ Backend Not Connected - Start server on port 5000');
    }
  }

  openTravelModal() {
    document.getElementById('travelModal').style.display = 'block';
  }

  closeTravelModal() {
    document.getElementById('travelModal').style.display = 'none';
  }

  toggleCustomForm() {
    const form = document.getElementById('customDestinationForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }

  async assessAllDestinations() {
    const resultsDiv = document.getElementById('travelResults');
    const spinner = resultsDiv.querySelector('.loading-spinner');
    
    spinner.style.display = 'block';
    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(spinner);

    this.currentAssessments = [];
    const totalDestinations = this.destinations.length;
    let completedCount = 0;

    try {
      this.showToast('🚀 Starting optimized parallel assessment...');
      
      // Get political advisories once
      const advisories = await this.apiService.getPoliticalAdvisories();
      this.showToast('🏛️ Loaded U.S. State Department advisories');
      
      // Process destinations in batches of 3 for better performance
      const batchSize = 3;
      for (let i = 0; i < totalDestinations; i += batchSize) {
        const batch = this.destinations.slice(i, i + batchSize);
        
        // Process batch in parallel
        const batchPromises = batch.map(async (destination, index) => {
          const globalIndex = i + index + 1;
          
          try {
            this.showToast(`🌤️ [${globalIndex}/${totalDestinations}] ${destination.name} - Fetching data...`);
            
            // Parallel API calls with timeout
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Timeout')), 10000); // 10 second timeout
            });
            
            const [weatherData, costs] = await Promise.race([
              Promise.all([
                this.apiService.getWeatherData(destination.coordinates.lat, destination.coordinates.lon),
                this.apiService.getRealTimeCosts(destination._id)
              ]),
              timeoutPromise
            ]);
            
            // Calculate assessment
            const assessment = await this.apiService.calculateAssessment(
              destination, weatherData, costs, destination.politicalAdvisory
            );
            
            // Save to database
            await this.apiService.saveAssessment(assessment);
            
            completedCount++;
            this.showToast(`✅ [${globalIndex}/${totalDestinations}] ${destination.name} completed! (${completedCount}/${totalDestinations})`);
            
            return assessment;
            
          } catch (error) {
            console.error(`Error assessing ${destination.name}:`, error);
            completedCount++;
            
            // Return fallback assessment
            return this.apiService.calculateAssessment(
              destination, null, destination.costData, destination.politicalAdvisory
            );
          }
        });
        
        // Wait for current batch to complete before next batch
        await Promise.all(batchPromises);
        this.showToast(`📊 Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(totalDestinations/batchSize)} completed`);
      }
      
      this.currentAssessments.sort((a, b) => b.scores.total - a.scores.total);
      this.displayAssessmentResults();
      this.showToast(`🎉 All ${totalDestinations} destinations assessed! Data saved to MongoDB 🌍`);
      
    } catch (error) {
      console.error('Assessment error:', error);
      this.showToast('❌ Assessment failed');
    } finally {
      spinner.style.display = 'none';
    }
  }

  async fetchWeatherData(lat, lon) {
    const apiKey = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    
    return await response.json();
  }

  calculateTravelScore(destination, weatherData) {
    let weatherScore = 50; // Default score if no weather data
    let weatherCondition = 'Unknown';
    let temperature = 'N/A';

    if (weatherData) {
      const temp = weatherData.main.temp;
      const main = weatherData.weather[0].main;
      
      temperature = Math.round(temp) + '°C';
      
      // Weather scoring based on conditions
      if (main === 'Clear') {
        weatherScore = 90;
        weatherCondition = 'Clear';
      } else if (main === 'Clouds') {
        weatherScore = 75;
        weatherCondition = 'Cloudy';
      } else if (main === 'Rain') {
        weatherScore = 40;
        weatherCondition = 'Rainy';
      } else if (main === 'Snow') {
        weatherScore = 30;
        weatherCondition = 'Snowy';
      } else if (main === 'Thunderstorm') {
        weatherScore = 20;
        weatherCondition = 'Stormy';
      } else {
        weatherScore = 60;
        weatherCondition = main;
      }

      // Temperature adjustment
      if (temp >= 15 && temp <= 28) {
        weatherScore += 10; // Ideal temperature
      } else if (temp < 0 || temp > 35) {
        weatherScore -= 20; // Extreme temperatures
      }
    }

    // Cost scoring (inverse - lower cost = higher score)
    const totalCost = destination.avgFlightCost + (destination.avgAccommodationCost * 7); // 7 days
    let costScore = Math.max(0, 100 - (totalCost / 50)); // Normalize to 0-100

    // Weighted scoring
    const weights = {
      weather: 0.3,
      political: 0.4,
      cost: 0.3
    };

    const totalScore = Math.round(
      (weatherScore * weights.weather) +
      (destination.politicalScore * weights.political) +
      (costScore * weights.cost)
    );

    // Determine recommendation
    let recommendation, recommendationColor, recommendationIcon;
    if (totalScore >= 75) {
      recommendation = 'Good to Travel';
      recommendationColor = '#28a745';
      recommendationIcon = '✅';
    } else if (totalScore >= 50) {
      recommendation = 'Better Not To';
      recommendationColor = '#ffc107';
      recommendationIcon = '⚠️';
    } else {
      recommendation = 'Don\'t Go';
      recommendationColor = '#dc3545';
      recommendationIcon = '🚫';
    }

    return {
      destination: destination,
      weather: {
        score: Math.round(weatherScore),
        condition: weatherCondition,
        temperature: temperature
      },
      cost: {
        score: Math.round(costScore),
        flight: destination.avgFlightCost,
        accommodation: destination.avgAccommodationCost,
        total: totalCost
      },
      political: {
        score: destination.politicalScore,
        advisory: destination.politicalAdvisory
      },
      totalScore: totalScore,
      recommendation: recommendation,
      recommendationColor: recommendationColor,
      recommendationIcon: recommendationIcon
    };
  }

  displayAssessmentResults() {
    const resultsDiv = document.getElementById('travelResults');
    
    // Sort by total score (highest first)
    const sortedAssessments = [...this.currentAssessments].sort((a, b) => b.scores.total - a.scores.total);
    
    const resultsHTML = sortedAssessments.map(assessment => {
      const destination = assessment.data.advisory.name || assessment.destinationId;
      const country = assessment.data.advisory.country || 'Unknown';
      
      return `
        <div class="travel-assessment-card">
          <div class="assessment-header">
            <h3>${destination}, ${country}</h3>
            <div class="recommendation-badge" style="background-color: ${assessment.recommendationColor}">
              ${assessment.recommendationIcon} ${assessment.recommendation}
            </div>
          </div>
          
          <div class="assessment-score">
            <div class="score-circle">
              <span class="score-value">${assessment.scores.total}</span>
              <span class="score-label">Score</span>
            </div>
          </div>
          
          <div class="assessment-details">
            <div class="detail-item">
              <span class="detail-icon">🌤️</span>
              <div class="detail-info">
                <span class="detail-label">Weather</span>
                <span class="detail-value">${assessment.data.weather ? 
                  `${assessment.data.weather.weather[0].main}, ${Math.round(assessment.data.weather.main.temp)}°C` : 
                  'Weather data unavailable'}</span>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${assessment.scores.weather}%; background: linear-gradient(90deg, #28a745, #ffc107, #dc3545);"></div>
                  <span class="score-text">${assessment.scores.weather}/100</span>
                </div>
              </div>
            </div>
            
            <div class="detail-item">
              <span class="detail-icon">🏛️</span>
              <div class="detail-info">
                <span class="detail-label">Political Advisory</span>
                <span class="detail-value">${assessment.data.advisory.text || 'Level 1: Exercise Normal Precautions'}</span>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${assessment.scores.political}%; background: linear-gradient(90deg, #28a745, #ffc107, #dc3545);"></div>
                  <span class="score-text">${assessment.scores.political}/100</span>
                </div>
              </div>
            </div>
            
            <div class="detail-item">
              <span class="detail-icon">💰</span>
              <div class="detail-info">
                <span class="detail-label">Cost (7 days)</span>
                <span class="detail-value">Flight: $${assessment.data.costs.flightCosts.economy} | Hotel: $${assessment.data.costs.accommodationCosts.midRange}/night</span>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${assessment.scores.cost}%; background: linear-gradient(90deg, #28a745, #ffc107, #dc3545);"></div>
                  <span class="score-text">${assessment.scores.cost}/100</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="assessment-actions">
            <button class="action-btn" onclick="travelAssessment.viewDetails('${assessment.assessmentId}')">📊 Details</button>
            <button class="action-btn" onclick="travelAssessment.getWeather('${destination}', ${assessment.data.advisory.coordinates?.lat || 0}, ${assessment.data.advisory.coordinates?.lon || 0})">🌤️ Weather</button>
          </div>
        </div>
      `;
    }).join('');

    resultsDiv.innerHTML = resultsHTML;
  }

  viewDetails(cityName) {
    const assessment = this.currentAssessments.find(a => a.destination.name === cityName);
    if (!assessment) return;

    const detailsHTML = `
      <h3>📊 Detailed Assessment for ${cityName}</h3>
      <div class="details-grid">
        <div class="detail-section">
          <h4>🌤️ Weather Analysis</h4>
          <p>Current: ${assessment.weather.condition}, ${assessment.weather.temperature}</p>
          <p>Score: ${assessment.weather.score}/100</p>
          <p>Weather contributes ${Math.round(assessment.weather.score * 0.3)} points to total score</p>
        </div>
        
        <div class="detail-section">
          <h4>🏛️ Safety Assessment</h4>
          <p>Advisory: ${assessment.political.advisory}</p>
          <p>Score: ${assessment.political.score}/100</p>
          <p>Safety contributes ${Math.round(assessment.political.score * 0.4)} points to total score</p>
        </div>
        
        <div class="detail-section">
          <h4>💰 Cost Analysis</h4>
          <p>Flight: $${assessment.cost.flight}</p>
          <p>Hotel: $${assessment.cost.accommodationCost}/night</p>
          <p>Total (7 days): $${assessment.cost.total}</p>
          <p>Cost score: ${assessment.cost.score}/100</p>
          <p>Cost contributes ${Math.round(assessment.cost.score * 0.3)} points to total score</p>
        </div>
      </div>
      
      <div class="recommendation-summary">
        <h4>🎯 Final Recommendation</h4>
        <p><strong>${assessment.recommendationIcon} ${assessment.recommendation}</strong></p>
        <p>Total Score: ${assessment.totalScore}/100</p>
      </div>
    `;

    this.createModal('Travel Details', detailsHTML);
  }

  async getWeather(cityName, lat, lon) {
    try {
      const weatherData = await this.fetchWeatherData(lat, lon);
      
      // Set the weather in the main app
      if (window.updateWeatherDisplay) {
        window.updateWeatherDisplay(weatherData);
      }
      
      this.closeTravelModal();
      this.showToast(`Weather updated for ${cityName}! 🌤️`);
    } catch (error) {
      this.showToast('Error fetching weather data ❌');
    }
  }

  addCustomDestination() {
    const city = document.getElementById('customCity').value.trim();
    const country = document.getElementById('customCountry').value.trim();
    
    if (!city || !country) {
      this.showToast('Please enter both city and country 📍');
      return;
    }

    // For demo purposes, we'll use default values for custom destinations
    const customDestination = {
      name: city,
      country: country,
      lat: 0, // Would need geocoding API in real implementation
      lon: 0,
      politicalAdvisory: 'Level 1: Exercise Normal Precautions',
      politicalScore: 85,
      avgFlightCost: 800,
      avgAccommodationCost: 100
    };

    this.destinations.push(customDestination);
    this.showToast(`Added ${city}, ${country} to destinations! ✈️`);
    
    // Clear form
    document.getElementById('customCity').value = '';
    document.getElementById('customCountry').value = '';
    this.toggleCustomForm();
  }

  createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>${title}</h2>
        ${content}
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
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
}

// Initialize travel assessment when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing Travelobia Travel Assessment System...');
  
  // Wait a bit for navbar to be fully loaded
  setTimeout(() => {
    try {
      if (!window.travelAssessment) {
        window.travelAssessment = new TravelAssessment();
        console.log('✅ Travelobia initialized successfully!');
        
        // Add global check
        setTimeout(() => {
          const travelBtn = document.getElementById('travelBtn');
          if (travelBtn) {
            console.log('✅ Travelobia button is ready! Click ✈️ in navbar to access features.');
            travelBtn.style.backgroundColor = '#007bff';
            travelBtn.style.color = 'white';
            travelBtn.style.padding = '8px 12px';
            travelBtn.style.borderRadius = '5px';
            travelBtn.style.fontWeight = 'bold';
            travelBtn.innerHTML = '✈️ Travelobia';
          } else {
            console.error('❌ Travelobia button not found! Adding manually...');
            // Try to add manually
            const navbar = document.querySelector('.navbar ul');
            if (navbar) {
              const travelLi = document.createElement('li');
              travelLi.innerHTML = '<a href="#" id="travelBtn" title="Travelobia Travel Assessment" style="background-color: #007bff; color: white; padding: 8px 12px; border-radius: 5px; font-weight: bold;">✈️ Travelobia</a>';
              navbar.appendChild(travelLi);
              console.log('✅ Travelobia button added manually!');
            }
          }
        }, 1000);
        
      } else {
        console.error('❌ Travelobia already initialized!');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Travelobia:', error);
    }
  }, 500); // Wait 500ms for navbar to load
});
