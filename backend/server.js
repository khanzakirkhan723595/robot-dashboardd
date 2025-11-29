import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js'; 
import robotRoutes from './src/routes/robotRoutes.js';
import 'dotenv/config'; 

// Connect to the MongoDB database
connectDB(); 

const app = express();

// Allow frontend to communicate with backend
app.use(cors());
app.use(express.json());

// Register API routes
app.use('/api', robotRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Ready to receive robot data at /api/robot/ingest`);
});
