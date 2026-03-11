// Test MongoDB Connection
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    const uri = 'mongodb+srv://cse22042_db_user:Tnooj111@cluster0.0mwympu.mongodb.net/travelobia?appName=Cluster0';
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log('📊 Database: travelobia');
    console.log('🌐 Ready to start Travelobia backend...');
    
    // Test a simple query
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📁 Found ${collections.length} collections:`, collections.map(c => c.collectionName));
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.error('🔧 Details:', error);
  }
}

testConnection();
