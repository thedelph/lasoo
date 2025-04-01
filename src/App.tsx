import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { SignIn, SignUp } from '@clerk/clerk-react';
import LandingPage from './components/LandingPage';
import FindPage from './components/FindPage';
import ProtectedRoute from './components/ProtectedRoute';
import LocksmithDashboard from './components/locksmith/Dashboard';
import AttributeCleaner from './components/AttributeCleaner';
import AdminLogin from './components/admin/AdminLogin';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import DashboardOverview from './components/admin/DashboardOverview';
import GodModeMap from './components/admin/GodModeMap';
import SubscriptionManagement from './components/admin/SubscriptionManagement';
import UserManagement from './components/admin/UserManagement';
import TradespeopleManagement from './components/admin/TradespeopleManagement';

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

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }>
          <Route index element={<DashboardOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="tradespeople" element={<TradespeopleManagement />} />
          <Route path="map" element={<GodModeMap />} />
          <Route path="subscriptions" element={<SubscriptionManagement />} />
          {/* Add more admin routes as needed */}
        </Route>
      </Routes>
      <AttributeCleaner />
    </Router>
  );
}

export default App;