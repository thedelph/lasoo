import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase, debugAuth, testConnection } from '../../utils/supabase';

export function AuthDebugger() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    async function runDebug() {
      try {
        // Test basic connection
        const connected = await testConnection();
        console.log('Supabase connection:', connected);

        // Get Clerk token
        let token = null;
        if (user) {
          token = await getToken({ template: 'supabase' });
          console.log('Clerk token received:', token ? 'Yes' : 'No');
          
          if (token) {
            // Set Supabase session
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: ''
            });
            
            if (sessionError) {
              console.error('Session error:', sessionError);
            }
            
            // Get debug info
            const authDebug = await debugAuth();
            console.log('Auth debug:', authDebug);

            setDebugInfo({
              connected,
              hasToken: !!token,
              clerkUser: user.id,
              authDebug,
              timestamp: new Date().toISOString()
            });
          }
        } else {
          setDebugInfo({
            connected,
            hasToken: false,
            message: 'No user logged in',
            timestamp: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Debug failed:', err);
        setDebugInfo({
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    }

    runDebug();
  }, [user]);

  if (!debugInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg max-w-lg overflow-auto">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <pre className="text-xs whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}