import React, { useState } from 'react';
import { Eye, EyeOff, Shield, User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    // email: 'admin@katsinalg.kt.gov.ng',
    // password: 'admin123456'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-blue-800 flex items-center justify-center p-4">
      {/* Nigerian Flag Strip */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-600 via-white to-green-600 z-50"></div>
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              {/* Logo Image */}
              <img
                src="/images/katsina-logo.png" 
                alt="Katsina LG Logo"
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.classList.add('hidden'); // Hide image
                  e.currentTarget.nextSibling?.classList.remove('hidden'); // Show fallback
                }}
              />
              {/* Fallback Icon (Hidden by Default) */}
              <Shield
                className="w-10 h-10 text-green-600 hidden" // 👈 Starts hidden
              />
            </div>
            <div className="text-white text-left">
              <h1 className="text-2xl font-bold">Admin Portal</h1>
              <p className="text-green-200">Katsina Local Government</p>
            </div>
          </div>
        </div> 
       {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your admin dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          {/* <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2">Demo Credentials:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Email:</strong> admin@katsinalg.gov.ng</p>
              <p><strong>Password:</strong> admin123456</p>
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            © {new Date().getFullYear()}  Katsina Local Government. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
