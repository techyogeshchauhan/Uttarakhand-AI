import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  showAuth?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showAuth = true }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="text-3xl">🏔️</span>
            <div>
              <h1 className="text-xl font-bold text-blue-600">Uttarakhand AI</h1>
              <p className="text-xs text-gray-500">Tourism Guide</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink onClick={() => navigate('/')}>Home</NavLink>
            <NavLink onClick={() => navigate('/explore')}>Explore</NavLink>
            <NavLink onClick={() => window.open('https://uttarakhandtourism.gov.in/', '_blank')}>
              Official Tourism
            </NavLink>
          </div>

          {/* Auth Buttons */}
          {showAuth && (
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="hidden md:block text-sm">
                    <span className="text-gray-600">Welcome, </span>
                    <span className="font-semibold text-blue-600">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
  >
    {children}
  </button>
);

export default Navbar;
