import React from 'react';
import { Server } from 'lucide-react';

const SystemInfo = ({systemInfo}) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            System Information
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/30 p-3 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Robot ID</div>
                <div className="font-semibold text-gray-200">{systemInfo.robotId}</div>
              </div>
              <div className="bg-gray-700/30 p-3 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Firmware</div>
                <div className="font-semibold text-gray-200">{systemInfo.firmware}</div>
              </div>
              <div className="bg-gray-700/30 p-3 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Location</div>
                <div className="font-semibold text-gray-200">{systemInfo.location}</div>
              </div>
              <div className="bg-gray-700/30 p-3 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Last Maintenance</div>
                <div className="font-semibold text-gray-200">
                    {systemInfo.lastMaintenance ? new Date(systemInfo.lastMaintenance).toLocaleDateString() : '--'}
                </div>
              </div>
          </div>
        </div>
    );
};

export default SystemInfo;
