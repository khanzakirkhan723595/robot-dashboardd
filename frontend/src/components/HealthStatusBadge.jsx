import React from 'react';

const HealthStatusBadge = ({ healthStatus }) => {
  if (!healthStatus) return null;

  const { status, color, Icon } = healthStatus;

  const bgColor = {
    'text-red-400': 'bg-red-500/10',
    'text-yellow-400': 'bg-yellow-500/10',
    'text-green-400': 'bg-green-500/10',
  }[color];

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${bgColor}`}>
      <Icon className={`w-6 h-6 ${color}`} />
      <div className="text-left">
        <span className="text-sm text-gray-400">Overall Status</span>
        <p className={`text-lg font-bold ${color}`}>{status}</p>
      </div>
    </div>
  );
};

export default HealthStatusBadge;