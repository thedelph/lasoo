"use client"

import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { AlertTriangle } from 'lucide-react'

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-2 text-error mb-4">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="card-title">Something went wrong!</h2>
          </div>
          
          <p className="text-base-content/80 mb-4">{error.message}</p>
          
          <div className="card-actions">
            <button
              onClick={resetErrorBoundary}
              className="btn btn-primary"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AppErrorBoundary({ children }: { children: React.ReactNode }) {
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