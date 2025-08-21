'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    
    if (success) {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('User logged in:', user); // Debug log
      
      switch (user.role) {
        case 'admin':
          console.log('Routing to admin dashboard');
          router.push('/');
          break;
        case 'gm':
          console.log('Routing to GM dashboard');
          router.replace('/gm');
          break;
        case 'owner':
          console.log('Routing to owner dashboard');
          router.push('/owner-dashboard');
          break;
        case 'staff':
          console.log('Routing to staff dashboard');
          router.push('/staff-dashboard');
          break;
        default:
          console.log('Routing to default dashboard');
          router.push('/');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center my-10">
      <div className="bg-[#101828] p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-4 text-white">Available Test Accounts</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-blue-600">Admin Access</h3>
              <div className="text-sm text-gray-600">
                Username: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin</span><br/>
                Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin123</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-orange-600">General Manager Access</h3>
              <div className="text-sm text-gray-600">
                Username: <span className="font-mono bg-gray-100 px-2 py-1 rounded">gm</span><br/>
                Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">gm123</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-green-600">Property Owner Access</h3>
              <div className="text-sm text-gray-600">
                Username: <span className="font-mono bg-gray-100 px-2 py-1 rounded">owner</span><br/>
                Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">owner123</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-purple-600">Staff Access</h3>
              <div className="text-sm text-gray-600">
                Username: <span className="font-mono bg-gray-100 px-2 py-1 rounded">staff</span><br/>
                Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">staff123</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Note: These are test accounts for demonstration purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
