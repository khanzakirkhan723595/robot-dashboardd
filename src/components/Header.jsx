import React from 'react';
import { Download } from 'lucide-react';
import HealthStatusBadge from './HealthStatusBadge'; // The Header imports the badge

const Header = ({ currentTime, exportData, healthStatus }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 mb-8 border border-gray-700/50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            🤖 Robot Health Dashboard
          </h1>
          <p className="text-gray-400">
            Last Updated: {currentTime.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* And the Header renders it, using the data from App.js */}
          <HealthStatusBadge healthStatus={healthStatus} />
          
          <button
            onClick={exportData}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
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