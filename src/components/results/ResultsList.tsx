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
            className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onLocksmithSelect(locksmith)}
          >
            <div className="card-body p-4">
              <div className="flex items-center gap-4">
                <div className="badge badge-primary badge-lg">{index + 1}</div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">
                    {locksmith.companyName}
                  </h3>
                  <div className="flex items-center text-base-content/60 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>ETA: {locksmith.eta} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}