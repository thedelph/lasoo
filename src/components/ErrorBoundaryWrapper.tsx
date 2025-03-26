import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  console.error("Error caught by boundary:", error)
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error.message}</span>
        <pre className="mt-2 text-sm">{error.stack}</pre>
        <button
          onClick={resetErrorBoundary}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

export default function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("Error caught by boundary:", error, info)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}