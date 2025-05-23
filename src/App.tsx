import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from './components/LandingPage';
import FindPage from './components/FindPage';
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
import ForgetMe from './components/ForgetMe'; // GDPR account deletion component
import DeleteAccountRedirect from './components/DeleteAccountRedirect'; // Google Play Store account deletion URL

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/find" element={<FindPage />} />
        <Route path="/forgetme" element={<ForgetMe />} />
        <Route path="/delete-account" element={<DeleteAccountRedirect />} />
        
        {/* Auth routes - now using Supabase components */}
        <Route path="/locksmith/login" element={<Login />} />
        <Route path="/locksmith/register" element={<SignUp />} />
        
        {/* Redirects for old Clerk auth routes */}
        <Route path="/sign-in/*" element={<Login />} />
        <Route path="/sign-up/*" element={<SignUp />} />
        
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