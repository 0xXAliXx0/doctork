"use client"
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { 
  validateSignUpForm, 
  authRateLimiter, 
  detectSuspiciousInput,
  generatePasswordSuggestions 
} from '@/lib/input';

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPasswordSuggestions, setShowPasswordSuggestions] = useState(false);
  const [passwordSuggestions, setPasswordSuggestions] = useState([]);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const handleInputChange = (field, value) => {
    // Clear field-specific error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) setError('');

    // Security check for suspicious input
    const suspiciousCheck = detectSuspiciousInput(value);
    if (suspiciousCheck.isSuspicious) {
      setError(`Security warning: ${suspiciousCheck.reasons[0]}`);
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePasswordHelp = () => {
    const suggestions = generatePasswordSuggestions(3);
    setPasswordSuggestions(suggestions);
    setShowPasswordSuggestions(true);
  };

  const usePasswordSuggestion = (password) => {
    setFormData(prev => ({ 
      ...prev, 
      password, 
      confirmPassword: password 
    }));
    setShowPasswordSuggestions(false);
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: '', confirmPassword: '' }));
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setFieldErrors({});

      // Rate limiting check
      const clientId = `${formData.email}-${Date.now()}`;
      if (!authRateLimiter.isAllowed(clientId)) {
        const remainingTime = Math.ceil(authRateLimiter.getRemainingTime(clientId) / 1000 / 60);
        setError(`Too many attempts. Please try again in ${remainingTime} minutes.`);
        return;
      }

      // Comprehensive form validation and sanitization
      const validation = validateSignUpForm(formData);
      
      if (!validation.isValid) {
        setFieldErrors(validation.fieldErrors);
        setError('Please fix the errors below');
        return;
      }

      // Use sanitized data for signup
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: validation.sanitizedData.email,
        password: validation.sanitizedData.password,
        options: {
          data: {
            full_name: validation.sanitizedData.name,
            phone: validation.sanitizedData.phone || null
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setError('Success! Check your email for the confirmation link.');
        // Optionally reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: ''
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome
            </h2>
            <p className="text-gray-600">
              Sign up to get started with your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 border rounded-lg ${
              error.includes('Success') 
                ? 'bg-green-50 border-green-200 text-green-700'
                : error.includes('Security warning')
                ? 'bg-orange-50 border-orange-200 text-orange-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  fieldErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  fieldErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  fieldErrors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    fieldErrors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={generatePasswordHelp}
                  className="absolute right-2 top-2 text-xs text-indigo-600 hover:text-indigo-500"
                  title="Generate secure password"
                >
                  🔐
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must contain: uppercase, lowercase, number, and special character (8+ chars)
              </p>
            </div>

            {/* Password Suggestions */}
            {showPasswordSuggestions && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Suggested secure passwords:</p>
                {passwordSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => usePasswordSuggestion(suggestion)}
                    className="block w-full text-left px-2 py-1 text-sm font-mono bg-white border rounded mb-1 hover:bg-indigo-50 hover:border-indigo-300"
                  >
                    {suggestion}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowPasswordSuggestions(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Hide suggestions
                </button>
              </div>
            )}

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
