import React from 'react';

function DashboardCard({
  title,
  icon,
  gradientFrom,
  onClick,
  padding,
  customClass = '',
  iconSize = 30,
  status, // Optional status prop
}) {
  return (
    <div 
      className={`cursor-pointer ${gradientFrom} text-white rounded-lg shadow-lg p-6 flex items-center ${padding} ${customClass} transition duration-200 hover:scale-105 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
      onClick={onClick}
      role="button"
      tabIndex={0} // Allows keyboard navigation
      onKeyDown={(e) => e.key === 'Enter' && onClick()} // Activate on Enter key
    >
      <div className="mr-4" style={{ fontSize: `${iconSize}px` }}>
        {icon}
      </div>
      <h4 className="text-lg font-semibold">{title}</h4>
      {status && <span className={`ml-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full`}>{status}</span>} {/* Optional Status Badge */}
    </div>
  );
}

export default DashboardCard;
