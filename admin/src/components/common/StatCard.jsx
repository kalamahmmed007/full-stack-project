import React, { useEffect, useState } from 'react';
import { Calendar, DollarSign, ShoppingCart, Users, Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

// Stat Card Component
const StatCard = ({ title, value, change, icon: Icon, color, trend }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(change)}%</span>
                </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
};
export default StatCard;