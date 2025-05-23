import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Redirect component for the /delete-account URL
 * This satisfies Google Play Store's data safety requirements
 * by providing a dedicated URL for account deletion that redirects to our ForgetMe page
 */
export default function DeleteAccountRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the forgetme page after a short delay to allow users to see the message
    const redirectTimer = setTimeout(() => {
      navigate('/forgetme', { replace: true });
    }, 1500); // 1.5 second delay for better UX
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  // Show an informative message while the redirect happens
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          Account Deletion Request
        </h2>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-700 mb-4">
            In accordance with GDPR regulations, we provide a way for you to delete your account and all associated data.
          </p>
          
          <p className="text-gray-600 mb-4">
            Redirecting to our secure account deletion page...
          </p>
          
          <div className="animate-pulse flex justify-center mb-4">
            <div className="h-2 w-24 bg-indigo-500 rounded"></div>
          </div>
          
          <p className="text-sm text-gray-600">
            If you are not redirected automatically, please click{' '}
            <a href="/forgetme" className="font-medium text-indigo-600 hover:text-indigo-500">
              here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
