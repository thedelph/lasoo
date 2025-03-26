import { Clock } from 'lucide-react';
import type { Locksmith } from '../../types/locksmith';

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
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">
                  {locksmith.companyName}
                </h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>ETA: {locksmith.eta} min</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}