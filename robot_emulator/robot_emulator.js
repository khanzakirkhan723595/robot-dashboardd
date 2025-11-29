import fetch from 'node-fetch';

const API_URL = 'http://localhost:8000/api/robot/ingest';

// Define our fleet of 3 robots with specific "Personalities" for the demo
const robots = [
  { id: 'RBT-001', name: 'Optimiser Prime', behavior: 'HEALTHY' },
  { id: 'RBT-002', name: 'Hot Rod', behavior: 'OVERHEATING' },   // Will trigger Temp Alerts
  { id: 'RBT-003', name: 'Old Sparky', behavior: 'LOW_BATTERY' } // Will trigger Battery Alerts
];

const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate fake sensor data based on the robot's "personality"
const generateDataForRobot = (robot, tick) => {
  let temp, battery, cpu;

  if (robot.behavior === 'HEALTHY') {
    // Normal operation: Safe values
    temp = getRandom(35, 45);
    battery = Math.max(20, 100 - (tick % 80)); // Slowly drains and resets
    cpu = getRandom(20, 50);
  } 
  else if (robot.behavior === 'OVERHEATING') {
    // Simulates an overheat cycle (Normal -> Hot -> Critical -> Cool)
    if (tick % 20 > 10) {
        temp = getRandom(65, 80); // CRITICAL HEAT (>60 triggers alert)
        cpu = getRandom(80, 99);
    } else {
        temp = getRandom(45, 55); // Cooling down
        cpu = getRandom(40, 60);
    }
    battery = Math.max(10, 90 - (tick % 90));
  } 
  else if (robot.behavior === 'LOW_BATTERY') {
    // Battery stays critically low to test low-battery warnings
    temp = getRandom(30, 40);
    battery = getRandom(5, 15); // CRITICAL BATTERY (<20 triggers alert)
    cpu = getRandom(10, 30);
  }

  return {
    robotId: robot.id,
    location: `Zone ${robot.id.split('-')[1]}`,
    battery: battery,
    temperature: temp,
    cpuUsage: cpu,
    memoryUsage: getRandom(40, 70),
    signalStrength: getRandom(-60, -30),
    timestamp: new Date()
  };
};

let globalTick = 0;

const runFleet = async () => {
  globalTick++;
  // console.clear();
  console.log(`FLEET EMULATION (Tick: ${globalTick})`);

  // Loop through all robots and send their data to the Backend API
  for (const robot of robots) {
    const data = generateDataForRobot(robot, globalTick);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      // Log status to console so we can see it working
      const status = response.ok ? "Sent" : "Failed";
      let logColor = "";
      if (robot.behavior === 'OVERHEATING' && data.temperature > 60) logColor = "HEAT ALERT";
      if (robot.behavior === 'LOW_BATTERY') logColor = "Pm BATT ALERT";

      console.log(`${status} | ${robot.id} (${robot.name}): T=${data.temperature}°C B=${data.battery}% ${logColor}`);
      
    } catch (error) {
      console.log(`Connection Error for ${robot.id} - Is Backend running?`);
    }
  }
};

// Send data every 2 seconds
setInterval(runFleet, 2000);
