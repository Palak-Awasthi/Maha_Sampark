import React from 'react';

function Header() {
  return (
    <header className="bg-white py-6 px-8 shadow-lg flex items-center justify-between">
      <h1 className="text-4xl font-bold flex items-center space-x-4">
        <span className="text-orange-500">महा</span>
        <span className="text-green-500">SAMPARK</span>
      </h1>
      <div className="text-sm text-gray-600">
        <p className="italic">Connecting Communities</p>
      </div>
    </header>
  );
}

export default Header;
