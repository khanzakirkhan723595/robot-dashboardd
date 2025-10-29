import Reading from '../models/readingModel.js';
import Alert from '../models/alertModel.js';

const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateData = async () => {
  try {
    const data = {
      battery: getRandom(80, 85),
      temperature: getRandom(40, 43),
      cpuUsage: getRandom(30, 38),
      memoryUsage: getRandom(65, 70),
      signalStrength: getRandom(-50, -40),
    };

    // 1. Save the new reading to the database
    const newReading = new Reading(data);
    await newReading.save();

    // 2. Check for alert conditions
    if (data.temperature > 60) { // As per your logic in App.jsx
      await Alert.create({
        type: 'warning',
        message: `Core temperature high: ${data.temperature}°C`,
      });
    }
    if (data.memoryUsage > 65) {
      // Check if an alert for this already exists and is unread
      const existingAlert = await Alert.findOne({ message: /Memory usage above 65%/, isRead: false });
      if (!existingAlert) {
          await Alert.create({
              type: 'warning',
              message: 'Memory usage above 65%',
          });
      }
    }

    console.log('New data point simulated and saved.');

  } catch (error) {
    console.error('Error in data simulation:', error);
  }
};

// This will run the simulation every 5 seconds, just like your frontend polling
export const startSimulation = () => {
  console.log('Starting data simulation...');
  setInterval(generateData, 5000); // 5000ms = 5 seconds
};
