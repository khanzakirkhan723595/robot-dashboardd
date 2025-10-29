import express from 'express';
import {
  getLatestData,
  getHistoricalData,
  getAlerts,
  getSystemInfo,
} from '../controllers/robotController.js';

const router = express.Router();

router.get('/robot/latest', getLatestData);
router.get('/robot/history', getHistoricalData);
router.get('/robot/alerts', getAlerts);
router.get('/robot/info', getSystemInfo);

export default router;
