# Travelobia Backend API

## 🚀 Overview
Travelobia Backend is a Node.js/Express API server that provides comprehensive travel assessment services with MongoDB database integration.

## 🛠 Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing
- **API**: RESTful endpoints with CORS support

## 📋 Features
- ✅ Real-time weather data integration
- ✅ Political advisory management
- ✅ Cost estimation for flights and accommodations
- ✅ Weighted travel assessment algorithm
- ✅ User authentication and authorization
- ✅ Assessment history tracking
- ✅ Secure API endpoints

## 🗄 Database Schema

### Destinations Collection
```javascript
{
  name: String,
  country: String,
  coordinates: { lat: Number, lon: Number },
  politicalAdvisory: {
    level: Number,
    text: String,
    score: Number,
    lastUpdated: Date
  },
  costData: {
    avgFlightCost: Number,
    avgAccommodationCost: Number,
    currency: String,
    lastUpdated: Date
  }
}
```

### Assessments Collection
```javascript
{
  assessmentId: String,
  destinationId: ObjectId,
  userId: String,
  timestamp: Date,
  scores: {
    weather: Number,
    political: Number,
    cost: Number,
    total: Number
  },
  recommendation: String,
  recommendationColor: String,
  recommendationIcon: String,
  weatherData: Object,
  costData: Object,
  politicalData: Object
}
```

### Users Collection
```javascript
{
  email: String,
  password: String, // Hashed
  name: String,
  createdAt: Date,
  lastLogin: Date
}
```

## 🌐 API Endpoints

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get specific destination

### Weather
- `GET /api/weather?lat=:lat&lon=:lon` - Get weather data

### Costs
- `GET /api/costs/:destinationId` - Get cost data for destination

### Political Advisories
- `GET /api/advisories` - Get all political advisories

### Assessments
- `POST /api/assessments/calculate` - Calculate travel assessment
- `POST /api/assessments` - Save assessment to database
- `GET /api/assessments` - Get user assessments (authenticated)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Health
- `GET /api/health` - Health check endpoint

## 🔧 Setup Instructions

### Prerequisites
- Node.js 16.0.0 or higher
- MongoDB Atlas account
- OpenWeatherMap API key

### Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create `.env` file with:
```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret-key
PORT=5000
NODE_ENV=development
OPENWEATHER_API_KEY=your-openweather-api-key
FRONTEND_URL=http://localhost:8000
```

4. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔐 Security Features

### Authentication
- JWT tokens for secure authentication
- Password hashing with bcrypt
- Token expiration management

### API Security
- CORS configuration
- Input validation
- Error handling
- Rate limiting (can be added)

### Data Protection
- Environment variables for sensitive data
- Secure password storage
- API key protection

## 📊 Assessment Algorithm

### Weighted Scoring
- **Weather Conditions**: 30% weight
- **Political Safety**: 40% weight
- **Cost Analysis**: 30% weight

### Scoring Logic
- Weather: Temperature and condition analysis
- Political: Advisory level scoring
- Cost: Flight + accommodation cost analysis

### Recommendations
- **75-100 points**: ✅ Good to Travel
- **50-74 points**: ⚠️ Better Not To
- **0-49 points**: 🚫 Don't Go

## 🌍 Integration Points

### External APIs
- **OpenWeatherMap**: Real-time weather data
- **Flight APIs**: Cost estimation (mock for now)
- **Hotel APIs**: Accommodation pricing (mock for now)

### Frontend Integration
- **CORS enabled**: Cross-origin requests
- **JSON responses**: Standardized format
- **Error handling**: Consistent error responses

## 🚀 Deployment

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=production-mongodb-connection
JWT_SECRET=production-jwt-secret
PORT=5000
```

### Production Setup
1. Set production environment variables
2. Build and deploy to hosting platform
3. Configure MongoDB Atlas for production
4. Set up domain and SSL

## 📝 API Documentation

### Request Format
```javascript
// GET Request
fetch('/api/destinations')

// POST Request
fetch('/api/assessments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```

### Response Format
```javascript
// Success Response
{
  success: true,
  data: {...},
  timestamp: "2024-02-27T00:00:00.000Z"
}

// Error Response
{
  success: false,
  error: "Error message",
  timestamp: "2024-02-27T00:00:00.000Z"
}
```

## 🔍 Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### API Testing
```bash
# Get destinations
curl http://localhost:5000/api/destinations

# Calculate assessment
curl -X POST http://localhost:5000/api/assessments/calculate \
  -H "Content-Type: application/json" \
  -d '{"destinationId": "...", "weatherData": {...}}'
```

## 📈 Monitoring

### Logs
- Console logging for all operations
- Error logging with stack traces
- Database connection status

### Health Monitoring
- `/api/health` endpoint for monitoring
- Database connection status
- Server status information

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues and support:
- Check console logs for errors
- Verify MongoDB connection
- Ensure environment variables are set
- Check API key validity
