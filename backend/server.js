// Travelobia Backend Server - Node.js + Express + MongoDB
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://cse22042_db_user:Tnooj111@cluster0.0mwympu.mongodb.net/travelobia?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'travelobia-secret-key-2024';

// Models
const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  politicalAdvisory: {
    level: { type: Number, required: true },
    text: { type: String, required: true },
    score: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now }
  },
  costData: {
    avgFlightCost: { type: Number, required: true },
    avgAccommodationCost: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    lastUpdated: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AssessmentSchema = new mongoose.Schema({
  assessmentId: { type: String, required: true, unique: true },
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  userId: { type: String, default: 'guest' },
  timestamp: { type: Date, default: Date.now },
  scores: {
    weather: { type: Number, required: true },
    political: { type: Number, required: true },
    cost: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  recommendation: { type: String, required: true },
  recommendationColor: { type: String, required: true },
  recommendationIcon: { type: String, required: true },
  weatherData: {
    condition: String,
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    timestamp: Date
  },
  costData: {
    flightCosts: {
      economy: Number,
      business: Number,
      first: Number
    },
    accommodationCosts: {
      budget: Number,
      midRange: Number,
      luxury: Number
    }
  },
  politicalData: {
    level: Number,
    text: String,
    score: Number
  },
  calculatedOn: { type: String, default: 'Travelobia Backend Server' }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

const Destination = mongoose.model('Destination', DestinationSchema);
const Assessment = mongoose.model('Assessment', AssessmentSchema);
const User = mongoose.model('User', UserSchema);

// Initialize default destinations
async function initializeDestinations() {
  const count = await Destination.countDocuments();
  if (count === 0) {
    const defaultDestinations = [
      { 
        name: 'Paris', 
        country: 'France', 
        coordinates: { lat: 48.8566, lon: 2.3522 },
        politicalAdvisory: { level: 1, text: 'Exercise Normal Precautions', score: 90 },
        costData: { avgFlightCost: 800, avgAccommodationCost: 150 }
      },
      { 
        name: 'Tokyo', 
        country: 'Japan', 
        coordinates: { lat: 35.6762, lon: 139.6503 },
        politicalAdvisory: { level: 1, text: 'Exercise Normal Precautions', score: 95 },
        costData: { avgFlightCost: 1200, avgAccommodationCost: 120 }
      },
      { 
        name: 'London', 
        country: 'United Kingdom', 
        coordinates: { lat: 51.5074, lon: -0.1278 },
        politicalAdvisory: { level: 1, text: 'Exercise Normal Precautions', score: 85 },
        costData: { avgFlightCost: 900, avgAccommodationCost: 140 }
      },
      { 
        name: 'Dubai', 
        country: 'UAE', 
        coordinates: { lat: 25.2048, lon: 55.2708 },
        politicalAdvisory: { level: 1, text: 'Exercise Normal Precautions', score: 88 },
        costData: { avgFlightCost: 1000, avgAccommodationCost: 100 }
      },
      { 
        name: 'New York', 
        country: 'USA', 
        coordinates: { lat: 40.7128, lon: -74.0060 },
        politicalAdvisory: { level: 1, text: 'Exercise Normal Precautions', score: 92 },
        costData: { avgFlightCost: 600, avgAccommodationCost: 180 }
      },
      { 
        name: 'Bangkok', 
        country: 'Thailand', 
        coordinates: { lat: 13.7563, lon: 100.5018 },
        politicalAdvisory: { level: 2, text: 'Exercise Increased Caution', score: 75 },
        costData: { avgFlightCost: 700, avgAccommodationCost: 60 }
      },
      { 
        name: 'Cairo', 
        country: 'Egypt', 
        coordinates: { lat: 30.0444, lon: 31.2357 },
        politicalAdvisory: { level: 2, text: 'Exercise Increased Caution', score: 70 },
        costData: { avgFlightCost: 800, avgAccommodationCost: 50 }
      },
      { 
        name: 'Mexico City', 
        country: 'Mexico', 
        coordinates: { lat: 19.4326, lon: -99.1332 },
        politicalAdvisory: { level: 2, text: 'Exercise Increased Caution', score: 72 },
        costData: { avgFlightCost: 500, avgAccommodationCost: 80 }
      },
      { 
        name: 'Mumbai', 
        country: 'India', 
        coordinates: { lat: 19.0760, lon: 72.8777 },
        politicalAdvisory: { level: 2, text: 'Exercise Increased Caution', score: 68 },
        costData: { avgFlightCost: 900, avgAccommodationCost: 70 }
      },
      { 
        name: 'Moscow', 
        country: 'Russia', 
        coordinates: { lat: 55.7558, lon: 37.6173 },
        politicalAdvisory: { level: 4, text: 'Do Not Travel', score: 20 },
        costData: { avgFlightCost: 1100, avgAccommodationCost: 100 }
      }
    ];

    await Destination.insertMany(defaultDestinations);
    console.log('✅ Default destinations initialized');
  }
}

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// API Routes

// Get all destinations
app.get('/api/destinations', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// Get weather data
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    
    const weatherData = await response.json();
    
    res.json({
      ...weatherData,
      processed: true,
      timestamp: new Date().toISOString(),
      source: 'OpenWeatherMap API via Travelobia Backend'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Get real-time costs (mock for now)
app.get('/api/costs/:destinationId', async (req, res) => {
  try {
    const { destinationId } = req.params;
    const destination = await Destination.findById(destinationId);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    // Mock real-time cost data (in production, integrate with flight/hotel APIs)
    const costs = {
      destinationId,
      flightCosts: {
        economy: Math.floor(Math.random() * 500) + destination.costData.avgFlightCost - 250,
        business: Math.floor(Math.random() * 1000) + destination.costData.avgFlightCost + 500,
        first: Math.floor(Math.random() * 2000) + destination.costData.avgFlightCost + 1500,
        currency: 'USD',
        lastUpdated: new Date().toISOString()
      },
      accommodationCosts: {
        budget: Math.floor(destination.costData.avgAccommodationCost * 0.6),
        midRange: destination.costData.avgAccommodationCost,
        luxury: Math.floor(destination.costData.avgAccommodationCost * 2.5),
        currency: 'USD',
        perNight: true,
        lastUpdated: new Date().toISOString()
      },
      source: 'Multiple APIs via Travelobia Backend'
    };

    res.json(costs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cost data' });
  }
});

// Get political advisories
app.get('/api/advisories', async (req, res) => {
  try {
    const advisories = [
      { level: 1, text: 'Exercise Normal Precautions', description: 'Standard safety precautions apply' },
      { level: 2, text: 'Exercise Increased Caution', description: 'Be aware of heightened risks' },
      { level: 3, text: 'Reconsider Travel', description: 'Serious risks to safety and security' },
      { level: 4, text: 'Do Not Travel', description: 'Life-threatening risks' }
    ];

    res.json({
      advisories,
      lastUpdated: new Date().toISOString(),
      source: 'U.S. Department of State via Travelobia Backend'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch advisories' });
  }
});

// Calculate assessment
app.post('/api/assessments/calculate', async (req, res) => {
  try {
    const { destinationId, weatherData, costs, politicalData } = req.body;
    
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    // Calculate weighted scores
    const weights = { weather: 0.3, political: 0.4, cost: 0.3 };
    
    let weatherScore = 50;
    if (weatherData && weatherData.main) {
      const temp = weatherData.main.temp;
      const main = weatherData.weather[0].main;
      
      if (main === 'Clear') weatherScore = 90;
      else if (main === 'Clouds') weatherScore = 75;
      else if (main === 'Rain') weatherScore = 40;
      else if (main === 'Snow') weatherScore = 30;
      else if (main === 'Thunderstorm') weatherScore = 20;
      else weatherScore = 60;

      if (temp >= 15 && temp <= 28) weatherScore += 10;
      else if (temp < 0 || temp > 35) weatherScore -= 20;
    }

    const totalCost = costs.flightCosts.economy + (costs.accommodationCosts.midRange * 7);
    const costScore = Math.max(0, 100 - (totalCost / 50));

    const totalScore = Math.round(
      (weatherScore * weights.weather) +
      (politicalData.score * weights.political) +
      (costScore * weights.cost)
    );

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

    const assessment = {
      assessmentId: 'assessment_' + Math.random().toString(36).substr(2, 9),
      destinationId,
      timestamp: new Date().toISOString(),
      scores: {
        weather: Math.round(weatherScore),
        political: politicalData.score,
        cost: Math.round(costScore),
        total: totalScore
      },
      recommendation,
      recommendationColor,
      recommendationIcon,
      weatherData: weatherData ? {
        condition: weatherData.weather[0].main,
        temperature: Math.round(weatherData.main.temp),
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        timestamp: new Date().toISOString()
      } : null,
      costData: costs,
      politicalData,
      calculatedOn: 'Travelobia Backend Server'
    };

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate assessment' });
  }
});

// Save assessment to database
app.post('/api/assessments', async (req, res) => {
  try {
    const assessment = new Assessment(req.body);
    await assessment.save();
    
    res.json({
      success: true,
      assessmentId: assessment.assessmentId,
      savedTo: 'MongoDB via Travelobia API',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save assessment' });
  }
});

// Get user assessments
app.get('/api/assessments', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId || 'guest';
    const assessments = await Assessment.find({ userId }).populate('destinationId');
    
    res.json({
      userId,
      assessments,
      total: assessments.length,
      source: 'MongoDB via Travelobia API'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Travelobia Backend API',
    version: '1.0.0'
  });
});

// Initialize database and start server
initializeDestinations().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Travelobia Backend Server running on port ${PORT}`);
    console.log(`📊 API Documentation: http://localhost:${PORT}/api/health`);
  });
});
