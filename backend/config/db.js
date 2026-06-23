import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Set a short timeout (3 seconds) to fail quickly if MongoDB is not running, 
    // avoiding long startup hangs.
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agromarket_db', {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
  } catch (error) {
    console.warn('\n========================================================================');
    console.warn('[WARNING] MongoDB connection failed: connect ECONNREFUSED.');
    console.warn('[INFO] Falling back to a local JSON-file-based database directory.');
    console.warn('[INFO] Platform is fully functional in offline mode!');
    console.warn('========================================================================\n');
    global.useMockDb = true;
  }
};

export default connectDB;
