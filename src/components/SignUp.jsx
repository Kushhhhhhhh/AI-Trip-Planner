import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('User signed up successfully!');
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing up:', error.message);
      handleAuthError(error.code);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        toast.error('This email is already in use. Please sign in.');
        break;
      case 'auth/invalid-email':
        toast.error('Invalid email address format. Please check your email.');
        break;
      case 'auth/weak-password':
        toast.error('Password should be at least 6 characters.');
        break;
      case 'auth/network-request-failed':
        toast.error('Network error. Please check your connection and try again.');
        break;
      default:
        toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <main className="flex items-center justify-center h-[80vh] bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          {loading ? (
            <Loader2 className="w-5 h-5 mx-auto animate-spin" />
          ) : (
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={!email || !password}
            >
              Sign Up
            </button>
          )}
        </form>
      </div>
    </main>
  );
};

export default SignUp;