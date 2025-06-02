'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { passwordResetRequest } from '@/service/registrationService';

export default function RequestReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await passwordResetRequest(email)
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setTimeout(() => router.push('/reset-password'), 2000);
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Request Password Reset</h2>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Send Reset Email
        </button>
      </form>
    </div>
  );
}