import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaUpload, FaUserShield, FaSignOutAlt, FaUser, FaBook, FaBars, FaTimes } from 'react-icons/fa';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!user) {
    return (
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="backdrop-blur-lg bg-white/80 sticky top-0 z-50 shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FaBook className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                  EduNeeds
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="nav-link flex items-center space-x-2"
              >
                <FaUser size={12} />
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                className="btn-primary flex items-center space-x-2"
              >
                <span>Sign Up</span>
              </Link>
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-blue-600 p-2 rounded-lg transition-colors"
              >
                <FaBars size={20} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-3">
                <Link
                  to="/login"
                  className="nav-link flex items-center space-x-2 w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser size={12} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary flex items-center space-x-2 w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Sign Up</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="navbar-glass sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaBook className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StudyShare
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/browse"
              className={`nav-link flex items-center space-x-2 ${
                location.pathname === '/browse' ? 'active' : ''
              }`}
            >
              <FaHome size={12} />
              <span>Browse</span>
            </Link>
            <Link
              to="/upload"
              className={`nav-link flex items-center space-x-2 ${
                location.pathname === '/upload' ? 'active' : ''
              }`}
            >
              <FaUpload size={12} />
              <span>Upload</span>
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`nav-link flex items-center space-x-2 ${
                  location.pathname === '/admin' ? 'active' : ''
                }`}
              >
                <FaUserShield size={12} />
                <span>Admin</span>
              </Link>
            )}
            <div className="border-l border-gray-200 h-6 mx-2"></div>
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-sm font-bold text-white">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </span>
              </motion.div>
              <motion.button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 hover:bg-red-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt size={12} />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/browse"
                className={`nav-link flex items-center space-x-2 w-full ${
                  location.pathname === '/browse' ? 'active' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaHome size={12} />
                <span>Browse</span>
              </Link>
              <Link
                to="/upload"
                className={`nav-link flex items-center space-x-2 w-full ${
                  location.pathname === '/upload' ? 'active' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaUpload size={12} />
                <span>Upload</span>
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`nav-link flex items-center space-x-2 w-full ${
                    location.pathname === '/admin' ? 'active' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUserShield size={12} />
                  <span>Admin</span>
                </Link>
              )}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {user?.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-danger flex items-center space-x-2 w-full justify-center"
                >
                  <FaSignOutAlt size={12} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navigation;
