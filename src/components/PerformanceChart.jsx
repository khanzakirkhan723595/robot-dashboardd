import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceChart = ({ chartData }) => {
  const [activeChart, setActiveChart] = useState('temperature');

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 mb-8 border border-gray-700/50">
      <h3 className="text-2xl font-bold text-gray-200 mb-6">Performance Metrics</h3>
      
      <div className="flex gap-2 mb-6">
        {Object.keys(chartData).map((chart) => (
          <button
            key={chart}
            onClick={() => setActiveChart(chart)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeChart === chart
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-105'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {chart.charAt(0).toUpperCase() + chart.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData[activeChart].data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value) => [value + chartData[activeChart].unit, activeChart.charAt(0).toUpperCase() + activeChart.slice(1)]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartData[activeChart].color}
              strokeWidth={3}
              dot={{ fill: chartData[activeChart].color, strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: chartData[activeChart].color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;