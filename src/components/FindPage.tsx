import LocksmithFinder from './LocksmithFinder'
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper'

export default function FindPage() {
  return (
    <ErrorBoundaryWrapper>
      <main className="w-full h-screen">
        <LocksmithFinder />
      </main>
    </ErrorBoundaryWrapper>
  )
}