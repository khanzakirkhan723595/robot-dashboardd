import React from 'react';
import { Download, Bot, ChevronDown } from 'lucide-react'; 
import HealthStatusBadge from './HealthStatusBadge';

const Header = ({ currentTime, exportData, healthStatus, selectedRobot, setSelectedRobot }) => {
  
  // List of robots available in our fleet (matching the Emulator IDs)
  const robots = [
    { id: 'RBT-001', name: 'Optimiser Prime (RBT-001)' },
    { id: 'RBT-002', name: 'Hot Rod (RBT-002)' },
    { id: 'RBT-003', name: 'Old Sparky (RBT-003)' },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 mb-8 border border-gray-700/50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Dashboard Title & Time */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            🤖 Robot Health Dashboard
          </h1>
          <p className="text-gray-400">
            {currentTime.toLocaleTimeString()} | Monitoring: <span className="text-white font-bold">{selectedRobot}</span>
          </p>
        </div>
        
        {/* Right Controls: Selector -> Status -> Export */}
        <div className="flex items-center gap-4">
          
          {/* Dropdown to switch between robots */}
          <div className="relative group">
            <Bot className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-400 transition-colors" />
            
            <select 
                value={selectedRobot}
                onChange={(e) => setSelectedRobot(e.target.value)}
                className="pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:bg-gray-600 transition-all shadow-lg"
            >
                {robots.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                ))}
            </select>

            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Shows Healthy/Warning/Critical badge */}
          <HealthStatusBadge healthStatus={healthStatus} />
          
          <button
            onClick={exportData}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;