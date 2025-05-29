import { Clock } from 'lucide-react';
import type { Locksmith } from '../../types/locksmith';
import LiveIndicator from '../ui/LiveIndicator';
import VanIcon3D from '../map/SimplifiedVanIcon3D';
import ShopIcon3D from '../map/SimplifiedShopIcon3D';

interface ResultsListProps {
  locksmiths: Locksmith[];
  onLocksmithSelect: (locksmith: Locksmith) => void;
}

export default function ResultsList({ locksmiths, onLocksmithSelect }: ResultsListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Available Locksmiths</h2>
      
      <div className="space-y-2">
        {locksmiths.map((locksmith, index) => (
          <div 
            key={locksmith.id} 
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onLocksmithSelect(locksmith)}
          >
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium shadow-sm">
                {index + 1}
              </div>
              
              {/* Location icon - van for live locations, shop for HQ */}
              <div className="flex-shrink-0">
                {locksmith.isDisplayingLive ? (
                  <VanIcon3D className="w-6 h-6" animate={false} />
                ) : (
                  <ShopIcon3D className="w-6 h-6" />
                )}
              </div>
              
              <div className="flex-1 min-w-0"> {/* Text Block: Company Name + ETA */}
                <h3 className="font-medium truncate">
                  {locksmith.companyName}
                </h3>
                <div className="flex items-center text-gray-500 text-sm"> {/* ETA only */}
                  <Clock className="w-4 h-4 mr-1" />
                  <span>ETA: {locksmith.eta} min</span>
                </div>
              </div>
              <div className="ml-auto flex items-center"> {/* Wrapper for LiveIndicator, pushed right & vertically centered */}
                {/* Conditional LiveIndicator based on status */}
                {(() => {
                  if (locksmith.isDisplayingLive) {
                    return <LiveIndicator status="live" />;
                  } else if (locksmith.liveLocationUpdatedAt) {
                    const lastUpdateDate = new Date(locksmith.liveLocationUpdatedAt);
                    const today = new Date();
                    let formattedLastUpdate: string;
                    const lastUpdateDayStart = new Date(lastUpdateDate.getFullYear(), lastUpdateDate.getMonth(), lastUpdateDate.getDate()).getTime();
                    const todayDayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
                    const yesterdayDayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).getTime();

                    if (lastUpdateDayStart === todayDayStart) {
                      formattedLastUpdate = lastUpdateDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                    } else if (lastUpdateDayStart === yesterdayDayStart) {
                      formattedLastUpdate = 'Yesterday';
                    } else {
                      const diffDays = Math.floor((todayDayStart - lastUpdateDayStart) / (1000 * 60 * 60 * 24));
                      if (diffDays < 7) {
                        formattedLastUpdate = lastUpdateDate.toLocaleDateString([], { weekday: 'short' });
                      } else {
                        formattedLastUpdate = lastUpdateDate.toLocaleDateString([], { day: 'numeric', month: 'short' });
                      }
                    }
                    return <LiveIndicator status="last_live" lastLiveTimestamp={formattedLastUpdate.toUpperCase()} />;
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}