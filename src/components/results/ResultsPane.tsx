import type { Locksmith } from '../../types/locksmith';
import NoResults from './NoResults';
import ResultsList from './ResultsList';
import LocksmithDetails from '../locksmith/LocksmithDetails';
import '../../styles/scrollbar-hide.css'; // Import custom scrollbar styles

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
  console.log('ResultsPane render:', { hasSearched, availableLocksmiths: availableLocksmiths.length });
  
  if (!hasSearched) {
    console.log('ResultsPane not showing because hasSearched is false');
    return null;
  }

  return (
    <div className="fixed bottom-4 w-full px-4 max-w-lg mx-auto left-0 right-0 z-10">
      <div className="bg-white rounded-lg shadow-xl relative">
        {/* Scrollable content with hidden scrollbars */}
        <div className="p-4 max-h-[30vh] overflow-y-auto scrollbar-hide">
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
        {/* Fade gradient at bottom to indicate scrollable content */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}