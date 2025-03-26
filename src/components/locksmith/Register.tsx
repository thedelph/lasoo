import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import { Lock } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Sign up the user with metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
            is_service_provider: true // Add this flag
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Registration failed");

      toast.success("Registration successful! Please check your email to verify your account.");
      navigate('/locksmith/login');
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error instanceof Error ? error.message : "Registration failed");
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
            <h2 className="card-title text-2xl">Register as a Locksmith</h2>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Company Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

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
                minLength={6}
              />
              <label className="label">
                <span className="label-text-alt">Must be at least 6 characters</span>
              </label>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <button 
                onClick={() => navigate('/locksmith/login')}
                className="link link-primary"
                type="button"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}