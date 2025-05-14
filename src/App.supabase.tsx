import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from './components/LandingPage';
import FindPage from './components/FindPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Updated import
import LocksmithDashboard from './components/locksmith/SupabaseDashboard'; // Updated import
import Login from './components/auth/Login'; // New Supabase auth component
import SignUp from './components/auth/SignUp'; // New Supabase auth component
import AttributeCleaner from './components/AttributeCleaner';
import AdminLogin from './components/admin/AdminLogin';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import DashboardOverview from './components/admin/DashboardOverview';
import GodModeMap from './components/admin/GodModeMap';
import SubscriptionManagement from './components/admin/SubscriptionManagement';
import TradespeopleManagement from './components/admin/TradespeopleManagement';

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/find" element={<FindPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        
        {/* Auth routes - now using Supabase components */}
        <Route path="/locksmith/login" element={<Login />} />
        <Route path="/locksmith/register" element={<SignUp />} />
        
        {/* Protected routes - now using Supabase protected route */}
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
        <Route path="/admin/dashboard/*" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }>
          <Route index element={<DashboardOverview />} />
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
