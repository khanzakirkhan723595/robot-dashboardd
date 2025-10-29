import Reading from '../models/readingModel.js';
import Alert from '../models/alertModel.js';
import Robot from '../models/robotModel.js';
import { generateData } from '../services/dataSimulator.js';

// GET /api/robot/latest (for the Metric Cards)
export const getLatestData = async (req, res) => {
  try {
    // Generate and save a new reading
    await generateData();
    // Find the newest record by sorting timestamp descending
    const latest = await Reading.findOne().sort({ timestamp: -1 });
    res.json(latest);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/robot/history (for the Performance Chart)
export const getHistoricalData = async (req, res) => {
  try {
    // Get all readings from the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const history = await Reading.find({ timestamp: { $gte: oneDayAgo } })
                                  .sort({ timestamp: 1 });
    res.json(history);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/robot/alerts (for the Alerts Panel)
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ isRead: false }).sort({ timestamp: -1 }).limit(10);
    res.json(alerts);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/robot/info (for the System Info panel)
export const getSystemInfo = async (req, res) => {
  try {
    // You would add this info to your DB once
    // For now, let's find one or create it
    let info = await Robot.findOne({ robotId: 'RBT-001' });
    if (!info) {
      info = await Robot.create({
        robotId: 'RBT-001',
        firmware: 'v2.1.4',
        location: 'Lab Station A',
        lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      });
    }
    res.json(info);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
