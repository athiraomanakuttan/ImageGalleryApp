'use client';
import { useState } from 'react';
import ImageUpload from '../../components/ImageUpload';
import DragDropContainer from '../../components/DragDropContainer';
import { signOut } from 'next-auth/react';

export default function Dashboard() {
  // Add a state to trigger refreshes
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Function to trigger a refresh
  const refreshImages = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl">Dashboard</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-500 text-white p-2 rounded"
        >
          Logout
        </button>
      </div>
      <ImageUpload onImageUpload={refreshImages} />
      <DragDropContainer refreshTrigger={refreshTrigger} />
    </div>
  );
}