import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineFunnel, HiOutlineXMark } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import CategoryPills from '../components/CategoryPills';
import Footer from '../components/Footer';
import { SkeletonCard } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { eventsAPI } from '../utils/api';

const EventsListingPage = () => {
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('all'); // all, free, paid
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 12 };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (dateFilter) params.startDate = dateFilter;
      if (priceFilter === 'free') params.isFree = 'true';
      if (priceFilter === 'paid') params.isFree = 'false';
      if (statusFilter) params.status = statusFilter;

      const { data } = await eventsAPI.getAll(params);
      if (data.success) {
        setEvents(data.data.events);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, dateFilter, priceFilter, statusFilter, currentPage]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setDateFilter('');
    setPriceFilter('all');
    setStatusFilter('');
    setCurrentPage(1);
  };

  const activeFilterCount = [
    selectedCategory !== 'All',
    searchQuery,
    dateFilter,
    priceFilter !== 'all',
    statusFilter,
  ].filter(Boolean).length;

  return (
    <div className={`min-h-screen pt-20 ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Explore Events
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {pagination.total} events available
          </p>
        </motion.div>

        {/* Search + Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar onSearch={setSearchQuery} className="flex-1" />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium text-sm transition-all border ${
              showFilters || activeFilterCount
                ? 'bg-primary-500/10 border-primary-500/30 text-primary-400'
                : isDark
                ? 'border-white/10 text-gray-400 hover:border-white/20'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <HiOutlineFunnel className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 p-5 rounded-2xl border ${isDark ? 'bg-dark-700/50 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1">
                  <HiOutlineXMark className="w-4 h-4" /> Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Date */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>From Date</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className={`${isDark ? 'input-field' : 'input-field-light'} text-sm`}
                />
              </div>
              {/* Price */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Price</label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className={`${isDark ? 'input-field' : 'input-field-light'} text-sm`}
                >
                  <option value="all">All</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {/* Status */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`${isDark ? 'input-field' : 'input-field-light'} text-sm`}
                >
                  <option value="">All</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Pills */}
        <div className="mb-8">
          <CategoryPills selected={selectedCategory} onSelect={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }} />
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : isDark
                        ? 'text-gray-400 hover:bg-white/5 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyState title="No events found" message="Try adjusting your search or filters." />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EventsListingPage;
