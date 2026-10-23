import React from 'react';
import { StatMetric } from '../types';

interface StatCardProps {
  metric: StatMetric;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ metric, onClick }) => {
  return (
    <div 
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:border-blue-300 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{metric.label}</p>
          <h3 className={`text-3xl font-bold ${metric.colorClass.includes('red') ? 'text-red-600' : 'text-gray-900'}`}>
            {metric.value}
            <span className="text-lg font-normal text-gray-500 ml-1">{metric.unit}</span>
          </h3>
          {metric.trend && (
            <p className={`text-xs flex items-center mt-1 ${metric.trendUp ? 'text-green-600' : 'text-gray-500'}`}>
              {metric.trend}
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${metric.colorClass}`}>
          {metric.icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;