// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex justify-center items-center p-4">
      <div className="bg-slate-800 bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-emerald-400/30">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-emerald-400 to-cyan-400 p-5 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
            {/* Enhanced camera icon */}
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-slate-800 rounded-full"></div>
              <div className="absolute -top-1 right-1 w-3 h-2 bg-slate-800 rounded-sm"></div>
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent mb-6 tracking-tight">
          SnapVault
        </h1>
        
        <p className="text-slate-300 text-center mb-10 text-lg leading-relaxed">
          Your digital gallery where memories come alive
        </p>
        
        <div className="space-y-4 mb-10">
          <Link href="/login" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-emerald-500/25 block">
            Sign In
          </Link>
          
          <Link href="/register" className="w-full bg-transparent border-2 border-cyan-400 hover:bg-cyan-400 hover:text-slate-900 text-cyan-400 font-semibold py-4 px-8 rounded-xl text-center transition-all duration-300 hover:scale-105 block">
            Create Account
          </Link>
        </div>
        
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-800 px-6 text-sm text-slate-400 font-medium">Gallery Preview</span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 h-20 rounded-xl border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-300 hover:scale-105"></div>
          <div className="bg-gradient-to-br from-teal-400/20 to-emerald-400/20 h-20 rounded-xl border border-teal-400/30 hover:border-teal-400/60 transition-all duration-300 hover:scale-105"></div>
          <div className="bg-gradient-to-br from-cyan-400/20 to-teal-400/20 h-20 rounded-xl border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105"></div>
          <div className="bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 h-20 rounded-xl border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-300 hover:scale-105"></div>
        </div>
        
        <div className="flex justify-center space-x-3 mb-8">
          <div className="h-2 w-8 rounded-full bg-emerald-400"></div>
          <div className="h-2 w-2 rounded-full bg-slate-600"></div>
          <div className="h-2 w-2 rounded-full bg-slate-600"></div>
        </div>
        
        
      </div>
    </div>
  );
}