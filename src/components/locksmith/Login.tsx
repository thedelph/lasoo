import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase/client";
import { Lock } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!data.user) throw new Error("Login failed");

      // Verify user exists in users table
      const { error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (userError && userError.code === 'PGRST116') {
        // User record doesn't exist, create it
        const { error: createError } = await supabase
          .from('users')
          .insert([
            {
              user_id: data.user.id,
              fullname: data.user.user_metadata.full_name || '',
              company_name: data.user.user_metadata.company_name || 'Unknown Company',
              phone: '',
              email: email,
              is_authorized: 1,
              is_activated: 1,
              created_at: new Date().toISOString(),
              company_postcode: null,
              service_type: 'Locksmith'
            }
          ]);

        if (createError) throw createError;
      } else if (userError) {
        throw userError;
      }
      
      toast.success("Login successful!");
      navigate('/locksmith/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="bg-primary p-3 rounded-full">
              <Lock className="h-6 w-6 text-primary-content" />
            </div>
            <h2 className="card-title text-2xl">Locksmith Login</h2>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => navigate('/locksmith/register')}
                className="link link-primary"
                type="button"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}