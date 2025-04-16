import React from 'react';
import { AlertTriangle } from 'lucide-react';

const BannedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-red-500/30">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="w-20 h-20 text-red-500 mb-6 animate-pulse" />
          <h1 className="text-3xl font-bold text-red-500 mb-4">Erişim Engellendi</h1>
          <p className="text-gray-300 text-lg mb-6">
            Site sahibi tarafından IP adresiniz yasaklanmıştır.
          </p>
          <div className="w-full h-2 bg-red-500/20 rounded-full overflow-hidden">
            <div className="w-full h-full bg-red-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannedPage;