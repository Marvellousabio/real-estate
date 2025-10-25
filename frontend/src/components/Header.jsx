import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { mobileItemVariants, mobileMenuVariants } from '../utils/animate';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { user, logout } = useAuth();

  // Navigation sections configuration
  const sections = useMemo(() => [
    { name: 'home', path: '/', isHashLink: true },
    { name: 'properties', path: '/all-properties', isHashLink: false },
    { name: 'agents', path: '/agents', isHashLink: false },
    { name: 'blog', path: '/blog', isHashLink: false },
    { name: 'contact', path: '/contact', isHashLink: false },
  ], []);

  // Update active section based on current route
  useEffect(() => {
    const path = location.pathname;
    const sectionMap = {
      '/': 'home',
      '/all-properties': 'properties',
      '/agents': 'agents',
      '/blog': 'blog',
      '/contact': 'contact'
    };
    setActiveSection(sectionMap[path] || 'home');
  }, [location.pathname]);

  // Handle scroll for hash links (only on home page)
  const handleScroll = useCallback(() => {
    if (location.pathname !== '/') return;

    const scrollPosition = window.scrollY + 100;
    sections.forEach((section) => {
      if (!section.isHashLink) return;

      const element = document.getElementById(section.name);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section.name);
        }
      }
    });
  }, [location.pathname, sections]);

  useEffect(() => {
    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, location.pathname]);

  const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);
  const handleCloseMenu = useCallback(() => setIsOpen(false), []);

  const NavLinks = ({ mobile = false }) => (
    <ul
      className={`
        font-medium
        ${mobile
          ? 'flex flex-col space-y-6 py-6'
          : 'hidden md:flex md:space-x-10'}
      `}
    >
      {sections.map((section, index) => (
        <motion.li
          key={`${section.name}-${index}`}
          variants={mobile ? mobileItemVariants : undefined}
        >
          {section.isHashLink && location.pathname === '/' ? (
            <HashLink
              smooth
              to={`/#${section.name}`}
              className={`${
                mobile ? 'block py-2 text-[var(--light-gray)]' : 'text-[var(--text-dark)]'
              } transition-colors duration-300 ${
                activeSection === section.name
                  ? 'text-[var(--accent)] font-semibold border-b-2 border-[var(--accent)]'
                  : 'hover:text-[var(--accent)]'
              }`}
              onClick={handleCloseMenu}
            >
              {section.name === 'agents' ? 'Agents' :
               section.name === 'blog' ? 'Blog' :
               section.name.charAt(0).toUpperCase() + section.name.slice(1)}
            </HashLink>
          ) : (
            <Link
              to={section.path}
              className={`${
                mobile ? 'block py-2 text-[var(--light-gray)]' : 'text-[var(--text-dark)]'
              } transition-colors duration-300 ${
                activeSection === section.name
                  ? 'text-[var(--accent)] font-semibold border-b-2 border-[var(--accent)]'
                  : 'hover:text-[var(--accent)]'
              }`}
              onClick={handleCloseMenu}
            >
              {section.name === 'agents' ? 'Agents' :
               section.name === 'blog' ? 'Blog' :
               section.name.charAt(0).toUpperCase() + section.name.slice(1)}
            </Link>
          )}
        </motion.li>
      ))}
    </ul>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between bg-white h-16 rounded-2xl px-4 shadow-sm">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-[var(--primary)] font-bold text-2xl uppercase tracking-wide hover:text-[var(--accent)] transition-colors"
            >
              Real Estate
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex-grow flex justify-center">
            <NavLinks />
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors"
                  >
                    <FaUser size={16} />
                  </button>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 transition-colors p-2"
                  title="Sign out"
                >
                  <FaSignOutAlt size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signin')}
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="bg-[var(--primary)] text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-[var(--primary)]/90 transition-all duration-300"
                  aria-label="Sign up"
                >
                  Get Started
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white"
              >
                <FaUser size={14} />
              </button>
            ) : (
              <button
                onClick={() => navigate('/signin')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Sign in"
              >
                <FaUser size={16} />
              </button>
            )}
            <button
              onClick={handleToggle}
              className="text-[var(--primary)] p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-colors duration-300"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <HiOutlineMenuAlt3 className="size-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="md:hidden bg-[var(--primary)] absolute top-full left-0 right-0 shadow-lg"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
          >
            <div className="px-4 sm:px-6 py-4">
              <NavLinks mobile />
              <motion.div className="pt-4 border-t border-white/20 space-y-3" variants={mobileItemVariants}>
                {user ? (
                  <>
                    <div className="text-center text-white">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm opacity-80">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        handleCloseMenu();
                      }}
                      className="block w-full text-center bg-white text-[var(--primary)] font-bold px-6 py-2 rounded-full hover:bg-white/90 transition-all duration-300 mb-2"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        handleCloseMenu();
                      }}
                      className="block w-full text-center bg-red-500 text-white font-bold px-6 py-2 rounded-full hover:bg-red-600 transition-all duration-300"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigate('/signin');
                        handleCloseMenu();
                      }}
                      className="block w-full text-center bg-white text-[var(--primary)] font-bold px-6 py-2 rounded-full hover:bg-white/90 transition-all duration-300"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        navigate('/signup');
                        handleCloseMenu();
                      }}
                      className="block w-full text-center border-2 border-white text-white font-bold px-6 py-2 rounded-full hover:bg-white hover:text-[var(--primary)] transition-all duration-300"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;