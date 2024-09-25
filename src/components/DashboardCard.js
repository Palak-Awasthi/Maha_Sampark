import React from 'react';

function DashboardCard({ title, icon, gradientFrom, onClick, padding }) {
  return (
    <div 
      className={`cursor-pointer ${gradientFrom} text-white rounded-lg shadow-lg p-6 flex items-center ${padding} transition duration-200 hover:scale-105`}
      onClick={onClick}
    >
      <div className="mr-4">{icon}</div>
      <h4 className="text-lg font-semibold">{title}</h4>
    </div>
  );
}

export default DashboardCard;
