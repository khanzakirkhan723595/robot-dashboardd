import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import PerformanceChart from './components/PerformanceChart';
import SystemInfo from './components/SystemInfo';
import AlertsPanel from './components/AlertsPanel';
import { Battery, Cpu, Thermometer, Wifi, Activity, HardDrive, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  // Default to the first robot
  const [selectedRobot, setSelectedRobot] = useState('RBT-001');

  const [systemInfo, setSystemInfo] = useState({
     robotId: '--', firmware: '--', location: '--', lastMaintenance: '--'
  });
  const [dynamicChartData, setDynamicChartData] = useState(null);
  
  // Initial empty state before data arrives
  const defaultRobotData = {
    systemStatus: 'offline',
    battery: 0,
    temperature: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    networkStatus: 'disconnected',
    uptime: 'Offline',
    signalStrength: 0
  };

  const [robotData, setRobotData] = useState(defaultRobotData);
  const [alerts, setAlerts] = useState([]);

  // Clear old data when switching between robots
  useEffect(() => {
    setRobotData(defaultRobotData);
    setDynamicChartData(null);
    setAlerts([]);
    setLoading(true);
  }, [selectedRobot]);

  // Main loop to fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Run all API calls in parallel for better performance
        const [latestRes, historyRes, alertsRes, infoRes] = await Promise.all([
          fetch(`http://localhost:8000/api/robot/${selectedRobot}/latest`),
          fetch(`http://localhost:8000/api/robot/${selectedRobot}/history`),
          fetch(`http://localhost:8000/api/robot/${selectedRobot}/alerts`),
          fetch(`http://localhost:8000/api/robot/${selectedRobot}/info`),
        ]);

        if (!latestRes.ok) throw new Error("Backend Error");

        const latestData = await latestRes.json();
        const historyData = await historyRes.json();
        const rawAlertsData = await alertsRes.json();
        const infoData = await infoRes.json();

        // Convert database timestamp to readable time for the UI
        const formattedAlerts = rawAlertsData.map(alert => ({
            ...alert,
            time: new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }));

        // Handle case where database is empty (new robot)
        if (!latestData || !latestData.timestamp) {
            setRobotData({ ...defaultRobotData, uptime: 'No Data Received' });
            setSystemInfo(infoData);
            setLoading(false);
            return;
        }

        // Logic to detect if robot is offline
        // If data is older than 10 seconds, we assume the robot stopped sending
        const dataTime = new Date(latestData.timestamp);
        const now = new Date();
        const timeDiffSeconds = (now - dataTime) / 1000;
        const isConnected = timeDiffSeconds < 10; 

        if (isConnected) {
            setRobotData({
                ...latestData,
                systemStatus: 'online', 
                networkStatus: 'connected',
                uptime: 'Active'
            });
            setAlerts(formattedAlerts); 
        } else {
            // Robot is offline: Keep showing last known values but change status
            setRobotData(prev => ({
                ...latestData, 
                systemStatus: 'warning', 
                networkStatus: 'disconnected',
                uptime: `Last seen: ${Math.floor(timeDiffSeconds)}s ago`
            }));
            
            // Add a local alert to notify user about connection loss
            setAlerts(prev => [
                { _id: 'conn-err', type: 'error', message: 'Robot signal lost', time: 'now' },
                ...formattedAlerts
            ]);
        }

        setSystemInfo(infoData); 
        
        // Prepare data for Recharts (Graph)
        if (historyData && historyData.length > 0) {
            const formattedChartData = {
              temperature: {
                data: historyData.map(d => ({ time: new Date(d.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), value: d.temperature })),
                color: '#ef4444', unit: '°C'
              },
              battery: {
                data: historyData.map(d => ({ time: new Date(d.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), value: d.battery })),
                color: '#22c55e', unit: '%'
              },
              cpu: {
                data: historyData.map(d => ({ time: new Date(d.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), value: d.cpuUsage })),
                color: '#3b82f6', unit: '%'
              }
            };
            setDynamicChartData(formattedChartData);
        }

      } catch (error) {
        console.log("Backend offline or connection refused");
        setRobotData(prev => ({ ...prev, systemStatus: 'offline', networkStatus: 'error' }));
      } finally {
        setLoading(false);
      }
    };

    fetchData(); 
    
    // Poll the server every 2 seconds
    const interval = setInterval(() => {
        setCurrentTime(new Date());
        fetchData();
    }, 2000); 

    return () => clearInterval(interval);

  }, [selectedRobot]); 

  // Determine overall health color based on thresholds
  const healthStatus = useMemo(() => {
    const { temperature, cpuUsage, battery, systemStatus } = robotData;
    
    if (systemStatus === 'offline' || systemStatus === 'disconnected') {
        return { status: 'Offline', color: 'text-gray-400', Icon: XCircle };
    }
    // Critical conditions
    if (temperature > 80 || cpuUsage > 95 || battery < 10) {
        return { status: 'Critical', color: 'text-red-400', Icon: XCircle };
    }
    // Warning conditions
    if (temperature > 60 || cpuUsage > 80 || battery < 30) {
        return { status: 'Warning', color: 'text-yellow-400', Icon: AlertTriangle };
    }
    return { status: 'Healthy', color: 'text-green-400', Icon: CheckCircle };
  }, [robotData]);

  // Generate a JSON report for download
  const exportData = () => {
    const dataToExport = {
      timestamp: new Date().toISOString(),
      robotId: selectedRobot,
      robotData,
      alerts
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedRobot}-report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Section */}
        <Header 
            currentTime={currentTime} 
            exportData={exportData} 
            healthStatus={healthStatus}
            selectedRobot={selectedRobot}      
            setSelectedRobot={setSelectedRobot} 
        />

        {/* Sensor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard title="System Status" value={robotData.uptime} unit="" icon={Activity} status={robotData.systemStatus} />
          <MetricCard title="Battery Level" value={Math.round(robotData.battery || 0)} unit="%" progress={robotData.battery} icon={Battery} />
          <MetricCard title="Core Temperature" value={Math.round(robotData.temperature || 0)} unit="°C" progress={((robotData.temperature || 0) / 80) * 100} icon={Thermometer} />
          <MetricCard title="CPU Usage" value={Math.round(robotData.cpuUsage || 0)} unit="%" progress={robotData.cpuUsage} icon={Cpu} />
          <MetricCard title="Memory Usage" value={Math.round(robotData.memoryUsage || 0)} unit="%" progress={robotData.memoryUsage} icon={HardDrive} />
          <MetricCard title="Network Status" value={robotData.signalStrength || 0} unit="dBm" icon={Wifi} status={robotData.networkStatus} />
        </div>

        {/* Live Graph */}
        <PerformanceChart chartData={dynamicChartData} />

        {/* Bottom Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemInfo systemInfo={systemInfo} />
          <AlertsPanel alerts={alerts} />
        </div>
      </div>
    </div>
  );
};

export default App;
