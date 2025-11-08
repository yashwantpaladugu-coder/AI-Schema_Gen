import React from 'react';
import { AILogo } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <AILogo className="w-8 h-8 text-blue-400"/>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              AI Schema Generator
            </h1>
          </div>
          <p className="hidden md:block text-sm text-gray-400">
            From Data to API in Seconds
          </p>
        </div>
      </div>
    </header>
  );
};