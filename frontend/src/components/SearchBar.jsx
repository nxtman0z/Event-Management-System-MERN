import { useState, useEffect, useCallback } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';

const SearchBar = ({ onSearch, placeholder = 'Search events...', className = '' }) => {
  const [query, setQuery] = useState('');
  const { isDark } = useTheme();

  // Debounce search - 300ms delay
  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <HiOutlineMagnifyingGlass className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-12 pr-10 py-3.5 rounded-2xl text-sm font-medium outline-none transition-all duration-300 ${
          isDark
            ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 focus:bg-white/[0.07]'
            : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 shadow-sm'
        }`}
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <HiOutlineXMark className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
