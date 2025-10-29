import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js'; // You'll create this file
import robotRoutes from './src/routes/robotRoutes.js';
import { startSimulation } from './src/services/dataSimulator.js';

// Load env variables (create a .env file for your MONGO_URI)
import 'dotenv/config'; 

connectDB(); // Connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json());

// Use your API routes
app.use('/api', robotRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  // Start the data simulation engine
  // startSimulation();
});
