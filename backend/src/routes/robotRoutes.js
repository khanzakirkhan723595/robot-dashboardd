import express from 'express';
import {
  getLatestData,
  getHistoricalData,
  getAlerts,
  getSystemInfo,
  ingestData
} from '../controllers/robotController.js';

const router = express.Router();

// Frontend APIs (Fetch data for dashboard)
router.get('/robot/:robotId/latest', getLatestData);
router.get('/robot/:robotId/history', getHistoricalData);
router.get('/robot/:robotId/alerts', getAlerts);
router.get('/robot/:robotId/info', getSystemInfo);

// Robot API (Receive data from emulator/hardware)
router.post('/robot/ingest', ingestData);

export default router;
