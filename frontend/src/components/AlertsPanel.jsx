import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AlertsPanel = ({ alerts }) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {alerts.length === 0 ? (
                <p className="text-gray-500 italic">No recent alerts</p>
            ) : (
                alerts.map((alert, index) => (
                <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'error'
                        ? 'bg-red-500/10 border-red-500' // Critical
                        : 'bg-yellow-500/10 border-yellow-500' // Warning
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-gray-200 text-sm font-medium">{alert.message}</span>
                        <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{alert.time}</span>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>
    );
};

export default AlertsPanel;
