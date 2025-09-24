import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

// Helper functions specific to the MetricCard
const getStatusColor = (status) => {
  switch (status) {
    case 'online':
    case 'connected':
      return 'text-green-400';
    case 'warning':
      return 'text-yellow-400';
    case 'offline':
    case 'disconnected':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'online':
    case 'connected':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    case 'offline':
    case 'disconnected':
      return <XCircle className="w-4 h-4 text-red-400" />;
    default:
      return <AlertTriangle className="w-4 h-4 text-gray-400" />;
  }
};

const getProgressColor = (value, thresholds = [70, 90]) => {
  if (value >= thresholds[1]) return 'bg-red-500';
  if (value >= thresholds[0]) return 'bg-yellow-500';
  return 'bg-green-500';
};

const getBatteryProgressColor = (value) => {
  if (value <= 20) return 'bg-red-500';
  if (value <= 40) return 'bg-yellow-500';
  return 'bg-green-500';
};

// The MetricCard component itself
const MetricCard = ({ title, value, unit, progress, icon: Icon, status }) => (
  <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      <Icon className="w-6 h-6 text-blue-400" />
    </div>
    
    {status && (
      <div className="flex items-center gap-2 mb-3">
        {getStatusIcon(status)}
        <span className={`text-sm font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    )}
    
    <div className="text-3xl font-bold text-white mb-2">
      {value}
      <span className="text-lg text-gray-400 ml-1">{unit}</span>
    </div>
    
    {progress !== undefined && (
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            title === 'Battery Level' 
              ? getBatteryProgressColor(progress)
              : getProgressColor(progress)
          }`}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    )}
    
    {title === 'Battery Level' && (
      <div className="text-sm text-gray-400 mt-2">
        Estimated: 3h 22m remaining
      </div>
    )}
    
    {title === 'Core Temperature' && (
      <div className="text-sm text-gray-400 mt-2">
        Normal range: 20-60°C
      </div>
    )}
    
    {title === 'Memory Usage' && (
      <div className="text-sm text-gray-400 mt-2">
        5.4GB / 8GB used
      </div>
    )}
  </div>
);

export default MetricCard;