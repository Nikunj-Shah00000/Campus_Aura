const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aura-campus', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: process.env.NODE_ENV !== 'production'
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Enable privacy-focused settings
    mongoose.set('strictQuery', true);
    mongoose.set('sanitizeFilter', true);
    
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;