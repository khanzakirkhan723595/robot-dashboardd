import React, { useState, useEffect, useMemo } from 'react';

// Import all the new components
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import PerformanceChart from './components/PerformanceChart';
import SystemInfo from './components/SystemInfo';
import AlertsPanel from './components/AlertsPanel';

// Import icons for the metric cards and status
import {
  Battery,
  Cpu,
  Thermometer,
  Wifi,
  Activity,
  HardDrive,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

// This data would also come from a backend in a real application.
// For now, it remains static on the frontend.
// const chartData = {
//     temperature: {
//       data: [ { time: '00:00', value: 38 }, { time: '04:00', value: 41 }, { time: '08:00', value: 45 }, { time: '12:00', value: 48 }, { time: '16:00', value: 52 }, { time: '20:00', value: 46 }, { time: '24:00', value: 42 } ],
//       color: '#ef4444',
//       unit: '°C'
//     },
//     battery: {
//       data: [ { time: '00:00', value: 100 }, { time: '04:00', value: 95 }, { time: '08:00', value: 87 }, { time: '12:00', value: 78 }, { time: '16:00', value: 85 }, { time: '20:00', value: 88 }, { time: '24:00', value: 85 } ],
//       color: '#22c55e',
//       unit: '%'
//     },
//     cpu: {
//       data: [ { time: '00:00', value: 25 }, { time: '04:00', value: 30 }, { time: '08:00', value: 45 }, { time: '12:00', value: 60 }, { time: '16:00', value: 40 }, { time: '20:00', value: 35 }, { time: '24:00', value: 34 } ],
//       color: '#3b82f6',
//       unit: '%'
//     }
//   };

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [systemInfo, setSystemInfo] = useState({});
  const [dynamicChartData, setDynamicChartData] = useState({});
  // Initial state is empty/zero until data is fetched
  const [robotData, setRobotData] = useState({
    systemStatus: 'offline',
    battery: 0,
    temperature: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    networkStatus: 'disconnected',
    uptime: '0h 0m',
    signalStrength: 0
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'info', message: 'Awaiting connection to robot...', time: 'now' },
  ]);

  // This useEffect fetches data from the local mockData.json file
  // useEffect(() => {
  //   // const dataUrl = '/mockData.json'; // Using the local file from the 'public' folder
  //   const dataUrl = 'http://localhost:8000/api/robot/health';

  //   const fetchData = async () => {
  //     try {
  //       if (loading === false) setLoading(true); // Show loading for subsequent fetches
  //       const response = await fetch(dataUrl);
  //       const data = await response.json();
        
  //       setRobotData(data); 
  //       setCurrentTime(new Date());
        
  //       // In a real app, you would fetch alerts from another endpoint.
  //       // Here, we just update the message after the first successful fetch.
  //       if (alerts[0].message.includes('Awaiting')) {
  //            setAlerts([
  //               { id: 1, type: 'info', message: 'System diagnostic completed successfully', time: '1 min ago' },
  //               { id: 2, type: 'warning', message: 'Memory usage above 65%', time: '2 min ago' }
  //            ]);
  //       }

  //     } catch (error) {
  //       console.error("Failed to fetch robot data:", error);
  //       setRobotData(prev => ({ ...prev, systemStatus: 'offline' }));
  //       setAlerts([{ id: 1, type: 'error', message: 'Failed to connect to robot.', time: 'now' }]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchData(); // Fetch immediately on load

  //   const pollInterval = setInterval(fetchData, 5000); // Re-fetch every 5 seconds
    
  //   return () => clearInterval(pollInterval); // Cleanup on component unmount
    
  // }, []); // Empty array ensures this effect runs only once on mount

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // You can keep the loading state
        
        // Fetch all data points in parallel
        const [latestRes, historyRes, alertsRes, infoRes] = await Promise.all([
          fetch('http://localhost:8000/api/robot/latest'),
          fetch('http://localhost:8000/api/robot/history'),
          fetch('http://localhost:8000/api/robot/alerts'),
          fetch('http://localhost:8000/api/robot/info'),
        ]);

        // Process data
        const latestData = await latestRes.json();
        const historyData = await historyRes.json();
        const alertsData = await alertsRes.json();
        const infoData = await infoRes.json();

        // Set all your states
        setRobotData(latestData); // For MetricCards
        setSystemInfo(infoData); // For SystemInfo component
        setAlerts(alertsData);   // For AlertsPanel component
        
        // This is the new part: Process history data for your chart
        // The static chartData in App.jsx can be removed.
        const formattedChartData = {
          temperature: {
            data: historyData.map(d => ({ time: new Date(d.timestamp).toLocaleTimeString(), value: d.temperature })),
            color: '#ef4444', unit: '°C'
          },
          battery: {
            data: historyData.map(d => ({ time: new Date(d.timestamp).toLocaleTimeString(), value: d.battery })),
            color: '#22c55e', unit: '%'
          },
          cpu: {
            data: historyData.map(d => ({ time: new Date(d.timestamp).toLocaleTimeString(), value: d.cpuUsage })),
            color: '#3b82f6', unit: '%'
          }
        };
        setDynamicChartData(formattedChartData); // You'd need a new state for this

      } catch (error) {
        console.error("Failed to fetch data from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Fetch on load
    const interval = setInterval(fetchData, 5000); // Poll the backend for new data
    return () => clearInterval(interval);

  }, []);
  
  // Calculates overall health status whenever robotData changes
  const healthStatus = useMemo(() => {
    const { temperature, cpuUsage, battery, systemStatus, memoryUsage } = robotData;
    if (systemStatus === 'offline' || temperature > 80 || cpuUsage > 95 || battery < 10) {
      return { status: 'Critical', color: 'text-red-400', Icon: XCircle };
    }
    if (temperature > 60 || cpuUsage > 80 || memoryUsage > 80 || battery < 30) {
      return { status: 'Warning', color: 'text-yellow-400', Icon: AlertTriangle };
    }
    return { status: 'Healthy', color: 'text-green-400', Icon: CheckCircle };
  }, [robotData]);

  // Function to export data
  const exportData = () => {
    const dataToExport = {
      timestamp: new Date().toISOString(),
      robotData,
      alerts
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robot-health-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Show a loading screen only on the very first load
  if (loading && robotData.uptime === '0h 0m') {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Connecting to Robot...</h1>
                <p className="text-gray-400">Please wait while we fetch the latest data.</p>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <Header 
            currentTime={currentTime} 
            exportData={exportData} 
            healthStatus={healthStatus} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="System Status"
            value={robotData.uptime}
            unit=""
            icon={Activity}
            status={robotData.systemStatus}
          />
          <MetricCard
            title="Battery Level"
            value={Math.round(robotData.battery)}
            unit="%"
            progress={robotData.battery}
            icon={Battery}
          />
          <MetricCard
            title="Core Temperature"
            value={Math.round(robotData.temperature)}
            unit="°C"
            progress={(robotData.temperature / 80) * 100}
            icon={Thermometer}
          />
          <MetricCard
            title="CPU Usage"
            value={Math.round(robotData.cpuUsage)}
            unit="%"
            progress={robotData.cpuUsage}
            icon={Cpu}
          />
          <MetricCard
            title="Memory Usage"
            value={Math.round(robotData.memoryUsage)}
            unit="%"
            progress={robotData.memoryUsage}
            icon={HardDrive}
          />
          <MetricCard
            title="Network Status"
            value={robotData.signalStrength}
            unit="dBm"
            icon={Wifi}
            status={robotData.networkStatus}
          />
        </div>

        <PerformanceChart chartData={dynamicChartData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemInfo systemInfo={systemInfo} />
          <AlertsPanel alerts={alerts} />
        </div>
      </div>
    </div>
  );
};

export default App;
