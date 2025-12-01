import Reading from '../models/readingModel.js';
import Alert from '../models/alertModel.js';
import Robot from '../models/robotModel.js';

// INGESTION: Receives data from the Robot/Emulator
export const ingestData = async (req, res) => {
  try {
    const data = req.body;
    
    // Basic validation
    if (!data.robotId || !data.temperature) {
        return res.status(400).json({ message: "Invalid data: robotId required" });
    }

    // Save the raw sensor reading
    const newReading = new Reading(data);
    await newReading.save();

    // Real-time Alert Logic
    // We check every incoming packet for dangerous values
    if (data.temperature > 60) {
       await Alert.create({
         robotId: data.robotId,
         type: 'error',
         message: `CRITICAL: ${data.robotId} temp at ${data.temperature}°C`,
         isRead: false
       });
    } else if (data.temperature > 50) {
        await Alert.create({
            robotId: data.robotId,
            type: 'warning',
            message: `Warning: ${data.robotId} high temp (${data.temperature}°C)`,
            isRead: false
          });
    }

    if (data.battery < 20) {
        await Alert.create({
            robotId: data.robotId,
            type: 'warning',
            message: `Low Battery: ${data.robotId} at ${data.battery}%`,
            isRead: false
        });
    }

    // Update the Robot's "Last Seen" status
    await Robot.findOneAndUpdate(
        { robotId: data.robotId }, 
        { 
          lastMaintenance: new Date(),
          location: data.location || 'Unknown'
        },
        { upsert: true } // Create if doesn't exist
    );

    res.status(200).json({ message: "Data received" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DATA RETRIEVAL APIs

// Get the single most recent reading for gauges
export const getLatestData = async (req, res) => {
  try {
    const { robotId } = req.params;
    const latest = await Reading.findOne({ robotId }).sort({ timestamp: -1 });
    res.json(latest || {});
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get data from the last 24 hours for the chart
export const getHistoricalData = async (req, res) => {
  try {
    const { robotId } = req.params;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const history = await Reading.find({ robotId, timestamp: { $gte: oneDayAgo } })
                                  .sort({ timestamp: 1 })
                                  .limit(50);
    res.json(history);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get unread alerts
export const getAlerts = async (req, res) => {
  try {
    const { robotId } = req.params;
    const alerts = await Alert.find({ robotId, isRead: false })
                              .sort({ timestamp: -1 })
                              .limit(10);
    res.json(alerts);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get static info (Firmware, Location)
export const getSystemInfo = async (req, res) => {
  try {
    const { robotId } = req.params;
    let info = await Robot.findOne({ robotId });
    
    // Create default info if it doesn't exist yet
    if (!info) {
      info = await Robot.create({
        robotId,
        firmware: 'v1.0.0',
        location: 'Waiting for signal...',
        lastMaintenance: new Date()
      });
    }
    res.json(info);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
