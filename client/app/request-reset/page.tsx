'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { passwordResetRequest } from '@/service/registrationService';

export default function RequestReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    if(email==="" || !email){
      setError("Email is required");
      setIsLoading(false);
      return
    }
    const res = await passwordResetRequest(email);
    const data = await res.json();
    
    if (res.ok) {
      setMessage(data.message);
      setTimeout(() => router.push('/reset-password'), 3000);
    } else {
      setError(data.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 p-4">
      <div className="bg-slate-800 bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md border border-emerald-400/30">
        {/* Header with icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-emerald-400 to-cyan-400 p-4 rounded-2xl">
            {/* Lock/Key icon for password reset */}
            <div className="relative w-8 h-8">
              <div className="absolute top-2 left-2 w-4 h-3 border-2 border-slate-800 rounded-t-lg"></div>
              <div className="absolute bottom-0 left-1 w-6 h-4 bg-slate-800 rounded-sm"></div>
              <div className="absolute bottom-1 right-2 w-1 h-1 bg-emerald-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent mb-2">
          Reset Password
        </h2>
        <p className="text-slate-400 text-center mb-8">
          Enter your email and we'll send you a reset link
        </p>

        {message && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl mb-6 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-1 bg-slate-800 rounded-full"></div>
              </div>
              <span>{message}</span>
            </div>
            <p className="text-emerald-400/80 text-sm mt-2">
              Redirecting to reset page in 3 seconds...
            </p>
          </div>
        )}

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
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 text-slate-100 placeholder-slate-400 backdrop-blur-sm hover:bg-slate-700/70"
              // required
              // disabled={isLoading || message}
            />
            <p className="text-xs text-slate-500">
              We'll send password reset instructions to this email
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-emerald-500/25 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Sending Reset Link...</span>
              </div>
            ) : message ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-1 bg-white rounded-full"></div>
                </div>
                <span>Email Sent!</span>
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-800 px-4 text-xs text-slate-500">REMEMBER YOUR PASSWORD?</span>
            </div>
          </div>

          <p className="text-slate-400 text-sm">
            <a 
              href="/login" 
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 hover:underline"
            >
              Back to Sign In
            </a>
          </p>

          <p className="text-xs text-slate-500 mt-4">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Create one here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}