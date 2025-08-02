import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
    router.push('/');
  };

  const getInitials = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const getDisplayName = (user) => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MyApp</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  Profile
                </Link>
              </>
            )}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Profile Picture */}
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {getInitials(user.email)}
                      </span>
                    )}
                  </div>
                  
                  {/* Username */}
                  <span className="hidden sm:block text-gray-700 font-medium">
                    {getDisplayName(user)}
                  </span>
                  
                  {/* Dropdown Arrow */}
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{getDisplayName(user)}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Your Profile
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Settings
                    </Link>
                    
                    <hr className="my-1" />
                    
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/signin"
                  className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3">
          <div className="flex space-x-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/profile" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
