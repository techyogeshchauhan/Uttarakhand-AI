import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, History } from 'lucide-react';
import type { Language } from '../../types';

interface NavbarProps {
  showAuth?: boolean;
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  showAuth = true,
  currentLanguage = 'english',
  onLanguageChange
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setProfileMenuOpen(false);
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Explore', path: '/explore' },
    ...(user ? [
      { label: 'History', path: '/history' },
      { label: 'Profile', path: '/profile' }
    ] : []),
    { label: 'Official Tourism', path: 'https://uttarakhandtourism.gov.in/', external: true }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-stone-200">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-emerald-800">Uttarakhand</span>
              <span className="text-stone-600 ml-2">Tourism</span>
            </div>
          </div>

          {/* Navigation Links - Center */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  if (link.external) {
                    window.open(link.path, '_blank');
                  } else {
                    navigate(link.path);
                  }
                }}
                className="px-5 py-2 text-sm font-medium text-stone-700 hover:text-emerald-800 hover:bg-emerald-50/50 rounded-md transition-all duration-200"
                aria-label={link.label}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Actions - Right */}
          <div className="flex items-center gap-3">
            {showAuth && (
              <>
                {user ? (
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-stone-100 rounded-lg transition-all duration-200"
                    >
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-emerald-600"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {getInitials(user.name)}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-stone-700">{user.name}</span>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {profileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-stone-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-stone-200">
                          <p className="text-sm font-semibold text-stone-800">{user.name}</p>
                          <p className="text-xs text-stone-500 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/history');
                            setProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          <History className="w-4 h-4" />
                          <span>History</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <div className="border-t border-stone-200 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-emerald-800 hover:bg-stone-100 rounded-md transition-all duration-200"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-md hover:from-emerald-800 hover:to-teal-800 transition-all duration-200 shadow-sm"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between h-14">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="text-lg font-bold tracking-tight">
              <span className="text-emerald-800">Uttarakhand</span>
            </div>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center text-stone-700 hover:text-emerald-800 hover:bg-stone-100 rounded-md transition-all duration-200"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Drawer */}
          <div className="fixed top-14 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* User Profile Section */}
              {showAuth && user && (
                <div className="pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg px-4 py-3 border border-emerald-200">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-white">
                          {getInitials(user.name)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-800 truncate">{user.name}</p>
                      <p className="text-xs text-stone-600 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-2" role="navigation">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      if (link.external) {
                        window.open(link.path, '_blank');
                      } else {
                        navigate(link.path);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-base font-medium text-stone-700 hover:text-emerald-800 hover:bg-emerald-50/50 rounded-md transition-all duration-200"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              {/* Auth Buttons */}
              {showAuth && (
                <div className="pt-4 border-t border-stone-200 space-y-2">
                  {user ? (
                    <>
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-stone-700 hover:text-emerald-800 hover:bg-stone-100 rounded-md transition-all duration-200"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate('/login');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-base font-medium text-stone-700 hover:text-emerald-800 hover:bg-stone-100 rounded-md transition-all duration-200"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          navigate('/login');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-5 py-3 text-base font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-md hover:from-emerald-800 hover:to-teal-800 transition-all duration-200 shadow-sm"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
