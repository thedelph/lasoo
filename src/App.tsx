import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SignIn, SignUp } from '@clerk/clerk-react';
import LandingPage from './components/LandingPage';
import FindPage from './components/FindPage';
import ProtectedRoute from './components/ProtectedRoute';
import LocksmithDashboard from './components/locksmith/Dashboard';
import AttributeCleaner from './components/AttributeCleaner';

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/find" element={<FindPage />} />
        <Route 
          path="/sign-in/*" 
          element={
            <div className="min-h-screen flex items-center justify-center">
              <SignIn routing="path" path="/sign-in" />
            </div>
          } 
        />
        <Route 
          path="/sign-up/*" 
          element={
            <div className="min-h-screen flex items-center justify-center">
              <SignUp routing="path" path="/sign-up" />
            </div>
          } 
        />
        <Route
          path="/locksmith/dashboard/*"
          element={
            <ProtectedRoute>
              <LocksmithDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <AttributeCleaner />
    </Router>
  );
}

export default App;