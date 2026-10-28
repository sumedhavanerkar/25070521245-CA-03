import 'dotenv/config';
import mongoose from 'mongoose';

let cachedConnection = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  let uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not defined in environment variables. Please configure MONGODB_URI in your Vercel Dashboard (Project Settings > Environment Variables) or server/.env file.'
    );
  }

  // Auto-clean angle brackets if user wrote <password> instead of password
  if (uri.includes('<') && uri.includes('>')) {
    uri = uri.replace(/<([^>]+)>/, '$1');
  }

  const options = {
    dbName: process.env.MONGODB_DB_NAME || 'campus_lost_found',
    serverSelectionTimeoutMS: 7000,
  };

  try {
    cachedConnection = await mongoose.connect(uri, options);
    console.log(`✅ MongoDB Connected: ${cachedConnection.connection.host}`);
    console.log(`📦 Database: ${cachedConnection.connection.name}`);
    return cachedConnection;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('📴 MongoDB connection closed on app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

export default connectDB;
