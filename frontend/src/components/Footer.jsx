import { Link } from 'react-router-dom';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className={`border-t ${isDark ? 'bg-dark-800 border-white/5' : 'bg-white border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <HiOutlineCalendarDays className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">EventFlow</span>
            </Link>
            <p className={`text-sm max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Discover, create and manage amazing events. Your one-stop platform for memorable experiences.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}>
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}>
                <FaGithub className="w-4 h-4" />
              </a>
              <a href="#" className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}>
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Platform</h3>
            <ul className="space-y-2">
              {[
                { to: '/events', label: 'Browse Events' },
                { to: '/register', label: 'Create Account' },
                { to: '/dashboard', label: 'Dashboard' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Categories</h3>
            <ul className="space-y-2">
              {['Conference', 'Workshop', 'Seminar', 'Tech', 'Cultural'].map((cat) => (
                <li key={cat}>
                  <Link to={`/events?category=${cat}`} className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'}`}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={`mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            © {new Date().getFullYear()} EventFlow. All rights reserved.
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Built with ❤️ for university project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
