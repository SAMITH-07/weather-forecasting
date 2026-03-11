// Real API Service for Travelobia - Connects to Node.js/Express Backend
// This connects to the actual backend API with MongoDB

class TravelAPIService {
  constructor() {
    this.baseURL = 'http://localhost:5000'; // Backend server URL
    this.endpoints = {
      destinations: '/api/destinations',
      assessments: '/api/assessments',
      weather: '/api/weather',
      costs: '/api/costs',
      advisories: '/api/advisories',
      auth: '/api/auth'
    };
  }

  // Get destinations from backend
  async getDestinations() {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.destinations}`);
      if (!response.ok) {
        throw new Error('Failed to fetch destinations from backend');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching destinations from backend:', error);
      throw error;
    }
  }

  // Get weather data from backend (which fetches from OpenWeatherMap)
  async getWeatherData(lat, lon) {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.weather}?lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data from backend');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather from backend:', error);
      throw error;
    }
  }

  // Get real-time costs from backend
  async getRealTimeCosts(destinationId) {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.costs}/${destinationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cost data from backend');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching costs from backend:', error);
      throw error;
    }
  }

  // Get political advisories from backend
  async getPoliticalAdvisories() {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.advisories}`);
      if (!response.ok) {
        throw new Error('Failed to fetch advisories from backend');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching advisories from backend:', error);
      throw error;
    }
  }

  // Calculate assessment via backend
  async calculateAssessment(destination, weatherData, costs, advisory) {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.assessments}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinationId: destination._id,
          weatherData,
          costs,
          politicalData: advisory
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate assessment on backend');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error calculating assessment on backend:', error);
      throw error;
    }
  }

  // Save assessment to backend database
  async saveAssessment(assessment) {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.assessments}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessment)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save assessment to backend');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving assessment to backend:', error);
      throw error;
    }
  }

  // Get user assessments from backend
  async getUserAssessments(userId = 'guest') {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.assessments}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user assessments from backend');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user assessments from backend:', error);
      throw error;
    }
  }

  // User registration
  async registerUser(email, password, name) {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.auth}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name })
      });
      
      if (!response.ok) {
        throw new Error('Failed to register user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // User login
  async loginUser(email, password) {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.auth}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Failed to login user');
      }
      
      const data = await response.json();
      if (data.success && data.token) {
        this.saveAuthToken(data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }

  // Check backend health
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      if (!response.ok) {
        throw new Error('Backend is not healthy');
      }
      return await response.json();
    } catch (error) {
      console.error('Backend health check failed:', error);
      throw error;
    }
  }

  // Authentication token management
  getAuthToken() {
    return localStorage.getItem('travelobiaAuthToken');
  }

  saveAuthToken(token) {
    localStorage.setItem('travelobiaAuthToken', token);
  }

  removeAuthToken() {
    localStorage.removeItem('travelobiaAuthToken');
  }

  // Utility functions
  generateId() {
    return 'assessment_' + Math.random().toString(36).substr(2, 9);
  }

  // Secure API call with authentication
  async secureAPICall(endpoint, data = null) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    };

    console.log(`Making secure API call to ${endpoint}`, { headers, data });
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: data ? 'POST' : 'GET',
        headers,
        body: data ? JSON.stringify(data) : null
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      
      return {
        success: true,
        data: await response.json(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Secure API call failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Export for use in travel assessment
window.TravelAPIService = TravelAPIService;
