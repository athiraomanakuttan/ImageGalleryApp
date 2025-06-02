import app from './app';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();