import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useActivityLog } from '../hooks/useActivityLog';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { logActivity } = useActivityLog();
  const effectRan = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await login({ email, password });

    if (result.success) {
      console.log(result.isAdmin)
      // This line handles the logging right after a successful login
      if (result.user.role == 'Admin') {
        logActivity('Admin signed in');
        localStorage.setItem('isAdmin', 'true');
      } else {
        logActivity('User signed in');
        localStorage.setItem('isAdmin', 'false');
      } 
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {error && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="flex block mb-2 text-sm font-medium text-gray-900">
                  Your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>
                <label htmlFor="password" className="flex block mb-2 text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
                  />
                   {/* Password visibility toggle button JSX can be placed here */}
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
              <p className="text-sm font-light text-gray-500">
                Don't have an account yet?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:underline">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;