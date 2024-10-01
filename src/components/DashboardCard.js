import React from 'react';

function DashboardCard({
  title,
  icon,
  gradientFrom,
  onClick,
  padding = 'p-5',
  customClass = '',
  iconSize = 30,
  description = '', // New description prop
  status = '', // Optional status prop
}) {
  return (
    <div
      className={`cursor-pointer relative ${gradientFrom} text-white rounded-lg shadow-lg border border-gray-300 overflow-hidden ${customClass} transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
      onClick={onClick}
      role="button"
      tabIndex={0} // Allows keyboard navigation
      onKeyDown={(e) => e.key === 'Enter' && onClick()} // Activate on Enter key
    >
      <div className={`flex flex-col items-start ${padding}`}>
        {/* Icon and Title */}
        <div className="flex items-center mb-4">
          <div className="mr-4 flex-shrink-0" style={{ fontSize: `${iconSize}px` }}>
            {icon}
          </div>
          <h4 className="text-2xl font-bold">{title}</h4>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-100">
            {description}
          </p>
        )}

        {/* Optional Status Badge */}
        {status && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}

export default DashboardCard;
