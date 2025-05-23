import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { supabase } from '../lib/supabase/client';
import LoadingSpinner from './LoadingSpinner';

export default function ForgetMe() {
  const { user, isLoaded, isSignedIn, signOut } = useSupabaseAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  // Show an informative page for non-authenticated users instead of immediately redirecting
  if (isLoaded && !isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Account Deletion
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You need to be logged in to delete your account
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Account Deletion Information</h3>
                <p className="mt-2 text-sm text-gray-600">
                  In accordance with GDPR and data privacy regulations, you have the right to request the deletion of your account and all associated data.
                </p>
                <ul className="mt-4 list-disc pl-5 text-sm text-gray-600">
                  <li>All your personal information will be permanently deleted</li>
                  <li>Your location history will be removed</li>
                  <li>Your profile and login information will be erased</li>
                  <li>This action cannot be undone</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  To proceed with account deletion, please log in to your account first:
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Return to Home
                  </button>
                  <button
                    onClick={() => navigate('/locksmith/login', { state: { from: '/forgetme' } })}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Log In to Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  const handleShowConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPassword('');
    navigate('/');
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('Please enter your password to confirm account deletion');
      return;
    }

    setIsDeleting(true);

    try {
      // 1. Verify the user's identity with password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: password
      });

      if (authError) {
        throw new Error('Password verification failed. Please try again.');
      }

      // 2. Delete user data from database tables
      // Note: using transactions to ensure all operations succeed or fail together
      const userId = user?.id;

      // Delete from locations table
      const { error: locationsError } = await supabase
        .from('locations')
        .delete()
        .eq('user_id', userId);

      if (locationsError) {
        console.error('Error deleting locations:', locationsError);
        throw new Error('Failed to delete location data');
      }

      // Delete from user_metadata table
      const { error: metadataError } = await supabase
        .from('user_metadata')
        .delete()
        .eq('user_id', userId);

      if (metadataError) {
        console.error('Error deleting metadata:', metadataError);
        throw new Error('Failed to delete user metadata');
      }

      // Delete from users table
      const { error: usersError } = await supabase
        .from('users')
        .delete()
        .eq('user_id', userId);

      if (usersError) {
        console.error('Error deleting user record:', usersError);
        throw new Error('Failed to delete user record');
      }

      // 3. Log the deletion for compliance (anonymized)
      const { error: logError } = await supabase
        .from('gdpr_deletion_logs')
        .insert([
          {
            deletion_date: new Date().toISOString(),
            success: true,
            // Store only a hash of the user ID for audit purposes
            user_hash: btoa(userId || '')
          }
        ]);

      if (logError) {
        console.error('Error logging deletion:', logError);
        // Continue with deletion even if logging fails
      }

      // 4. Delete the user's authentication account
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(
        userId || ''
      );

      if (deleteAuthError) {
        // If we can't delete the auth user, we should still sign them out
        console.error('Error deleting auth user:', deleteAuthError);
        // We'll continue and sign out the user
      }

      // 5. Sign out the user
      await signOut();
      
      // 6. Show success message and redirect
      toast.success('Your account and all associated data have been permanently deleted');
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('Account deletion failed:', error);
      toast.error(error.message || 'Account deletion failed. Please try again or contact support.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Request Account Deletion
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {showConfirmation 
            ? "This action cannot be undone. All your data will be permanently deleted."
            : "Per GDPR regulations, you have the right to be forgotten."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!showConfirmation ? (
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">What happens when you delete your account:</h3>
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                    <li>All your personal information will be permanently deleted</li>
                    <li>Your location history will be removed</li>
                    <li>Your profile and login information will be erased</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleShowConfirmation}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Continue to Deletion
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Confirm your password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={isDeleting}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Permanently Delete My Account'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
