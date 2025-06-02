// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex justify-center items-center p-4">
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md border-t-4 border-yellow-400">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full flex items-center justify-center">
            {/* Simple camera icon using HTML/CSS */}
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border-4 border-white rounded-md"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Image App
        </h1>
        
        <p className="text-gray-600 text-center mb-8">
          Capture, organize, and share moments that matter
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/login" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg text-center transition duration-300 hover:scale-105 shadow-md">
            Login
          </Link>
          
          <Link href="/register" className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition duration-300 hover:scale-105 shadow-md">
            Register
          </Link>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">Featured Images</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-gray-200 h-24 rounded-lg shadow-sm hover:opacity-80 transition duration-300"></div>
          <div className="bg-gray-200 h-24 rounded-lg shadow-sm hover:opacity-80 transition duration-300"></div>
          <div className="bg-gray-200 h-24 rounded-lg shadow-sm hover:opacity-80 transition duration-300"></div>
        </div>
        
        <div className="flex justify-center space-x-4 mb-6">
          <div className="h-2 w-2 rounded-full bg-pink-400"></div>
          <div className="h-2 w-2 rounded-full bg-purple-400"></div>
          <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
        </div>
        
        <p className="text-center text-sm text-gray-500">
          Join thousands of creators and photographers today
        </p>
      </div>
    </div>
  );
}