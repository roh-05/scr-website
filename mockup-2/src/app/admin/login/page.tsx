"use client";

import { useState } from "react";
import { login } from "@/actions/auth";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Loader2
} from "lucide-react";

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear any previous errors

    // Grab the data directly from the HTML form
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    // The login action automatically redirects on success.
    // We only hit this code if there was an error (like a bad password).
    if (result && !result.success) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surrey-beige flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 bg-surrey-blue rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg border border-surrey-grey/30">
          <ShieldCheck className="text-surrey-gold" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-surrey-blue tracking-tight">
          Admin Portal
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Secure access for SCR executive members
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-surrey-blue/5 sm:rounded-2xl sm:px-10 border border-surrey-grey/40">
          
          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-surrey-blue">
                Email address
              </label>
              <div className="mt-2 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                  className="block w-full rounded-xl border border-surrey-grey/60 py-3 pl-10 pr-3 text-surrey-blue focus:border-surrey-gold focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all sm:text-sm bg-surrey-light disabled:opacity-60"
                  placeholder="admin@surreycapital.org"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-surrey-blue">
                Password
              </label>
              <div className="mt-2 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                  className="block w-full rounded-xl border border-surrey-grey/60 py-3 pl-10 pr-3 text-surrey-blue focus:border-surrey-gold focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 transition-all sm:text-sm bg-surrey-light disabled:opacity-60"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-surrey-blue px-4 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-surrey-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}