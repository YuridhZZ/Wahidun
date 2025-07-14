import React from 'react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { WifiIcon, NoSymbolIcon } from '@heroicons/react/24/solid';

function OfflineIndicator() {
  const { isOnline } = useOfflineSync();

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center space-x-2 bg-yellow-400 text-yellow-900 font-semibold px-4 py-2 rounded-full shadow-lg">
        <NoSymbolIcon className="h-5 w-5" />
        <span>Offline Mode</span>
      </div>
    </div>
  );
}

export default OfflineIndicator;