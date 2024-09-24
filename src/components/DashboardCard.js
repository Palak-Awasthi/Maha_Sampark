// DashboardCard.js
import React from 'react';

function DashboardCard({ title, icon, gradientFrom, gradientTo, onClick, padding = 'p-8' }) {
  return (
    <div
      className={`relative bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white ${padding} rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-500 overflow-hidden`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-30"></div>
      <div className="relative z-10 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {icon}
      </div>
    </div>
  );
}

export default DashboardCard;
