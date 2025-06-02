'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { UserType } from '@/types/generalTypes';

export default function Login() {
  const [formData, setFormData] = useState<UserType>({
    email: "",
    password: ""
  })
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      ...formData
    });
    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 p-4">
      <div className="bg-slate-800 bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md border border-emerald-400/30">
        {/* Header with icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-emerald-400 to-cyan-400 p-4 rounded-2xl">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border-3 border-slate-800 rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-800 rounded-full"></div>
              <div className="absolute -top-1 right-1 w-2 h-1 bg-slate-800 rounded-sm"></div>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h2>
        <p className="text-slate-400 text-center mb-8">Sign in to your SnapVault account</p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6 text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-emerald-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 text-slate-100 placeholder-slate-400 backdrop-blur-sm hover:bg-slate-700/70"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-emerald-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 text-slate-100 placeholder-slate-400 backdrop-blur-sm hover:bg-slate-700/70"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-emerald-500/25 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm mb-4">
            Forgot your password?{' '}
            <a 
              href="/request-reset" 
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 hover:underline"
            >
              Reset Password
            </a>
          </p>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-800 px-4 text-xs text-slate-500">OR</span>
            </div>
          </div>

          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200 hover:underline"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}