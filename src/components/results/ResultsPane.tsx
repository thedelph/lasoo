import type { Locksmith } from '../../types/locksmith';
import NoResults from './NoResults';
import ResultsList from './ResultsList';
import LocksmithDetails from '../locksmith/LocksmithDetails';

interface ResultsPaneProps {
  hasSearched: boolean;
  selectedLocksmith: Locksmith | null;
  availableLocksmiths: Locksmith[];
  onLocksmithSelect: (locksmith: Locksmith) => void;
  onBack: () => void;
  onReset: () => void;
}

export default function ResultsPane({
  hasSearched,
  selectedLocksmith,
  availableLocksmiths,
  onLocksmithSelect,
  onBack,
  onReset,
}: ResultsPaneProps) {
  if (!hasSearched) return null;

  return (
    <div className="fixed bottom-4 w-full px-4 max-w-lg mx-auto left-0 right-0 z-10">
      <div className="bg-white rounded-lg shadow-xl">
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {selectedLocksmith ? (
            <LocksmithDetails locksmith={selectedLocksmith} onBack={onBack} />
          ) : availableLocksmiths.length > 0 ? (
            <ResultsList
              locksmiths={availableLocksmiths}
              onLocksmithSelect={onLocksmithSelect}
            />
          ) : (
            <NoResults onReset={onReset} />
          )}
        </div>
      </div>
    </div>
  );
}