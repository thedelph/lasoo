export default function NoResults({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-6">
      <div className="bg-base-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-base-content/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">No Locksmiths Found</h3>
      <p className="text-base-content/80 mb-4">
        Sorry, we couldn't find any locksmiths that currently service your area. 
        Try searching a different postcode or changing the service type.
      </p>
      <button 
        className="btn btn-primary" 
        onClick={onReset}
      >
        New Search
      </button>
    </div>
  )
}