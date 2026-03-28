import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMagnifyingGlass, HiOutlineSparkles, HiOutlineUserGroup, HiOutlineCalendarDays, HiOutlineGlobeAlt } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';
import EventCard from '../components/EventCard';
import CategoryPills from '../components/CategoryPills';
import Footer from '../components/Footer';
import { SkeletonCard } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { eventsAPI } from '../utils/api';

const LandingPage = () => {
  const { isDark } = useTheme();
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = { limit: 12 };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const { data } = await eventsAPI.getAll(params);
      if (data.success) {
        setEvents(data.data.events);
        if (!featuredEvents.length) {
          setFeaturedEvents(data.data.events.slice(0, 4));
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const stats = [
    { icon: HiOutlineCalendarDays, label: 'Events', value: '500+', color: 'text-primary-400' },
    { icon: HiOutlineUserGroup, label: 'Attendees', value: '10K+', color: 'text-accent-400' },
    { icon: HiOutlineGlobeAlt, label: 'Cities', value: '50+', color: 'text-emerald-400' },
    { icon: HiOutlineSparkles, label: 'Organizers', value: '200+', color: 'text-amber-400' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      {/* ─── Hero Section ────────────────────────────────────── */}
      <section className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${isDark ? 'hero-gradient' : 'hero-gradient-light'}`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent-400/5 blur-3xl"
          />
          {/* Floating dots */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
              className="absolute w-2 h-2 rounded-full bg-primary-400/30"
              style={{ left: `${15 + i * 15}%`, top: `${20 + i * 10}%` }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              isDark ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-primary-50 text-primary-600 border border-primary-200'
            }`}>
              <HiOutlineSparkles className="w-4 h-4" />
              The #1 Event Management Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Discover Events
            <br />
            <span className="gradient-text">Near You</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Find and join amazing conferences, workshops, seminars, and cultural events.
            Connect with like-minded people and create unforgettable memories.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className={`flex items-center rounded-2xl overflow-hidden transition-all duration-300 ${
              isDark
                ? 'bg-white/5 border border-white/10 focus-within:border-primary-500/50 focus-within:ring-2 focus-within:ring-primary-500/20'
                : 'bg-white border border-gray-200 shadow-lg focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20'
            }`}>
              <div className="pl-5">
                <HiOutlineMagnifyingGlass className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, topics, or locations..."
                className={`flex-1 px-4 py-4 text-sm font-medium outline-none bg-transparent ${
                  isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-4 font-semibold text-sm transition-colors"
              >
                Search
              </button>
            </div>
          </motion.form>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`flex flex-wrap items-center justify-center gap-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <span>Popular:</span>
            {['Tech', 'Workshop', 'Conference', 'Cultural'].map((tag) => (
              <button
                key={tag}
                onClick={() => { setSelectedCategory(tag); }}
                className={`px-3 py-1 rounded-full transition-colors ${
                  isDark ? 'hover:bg-white/5 hover:text-primary-400' : 'hover:bg-gray-100 hover:text-primary-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className={`p-4 rounded-2xl text-center ${
                  isDark ? 'bg-white/5 border border-white/5' : 'bg-white border border-gray-100 shadow-sm'
                }`}
              >
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Featured Events Section ─────────────────────────── */}
      {featuredEvents.length > 0 && (
        <section className={`py-20 ${isDark ? 'bg-dark-800/50' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  🔥 Featured Events
                </h2>
                <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Don't miss these trending events</p>
              </div>
              <Link
                to="/events"
                className={`text-sm font-semibold transition-colors ${isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-500'}`}
              >
                View All →
              </Link>
            </div>

            {/* Horizontal scroll */}
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
              {featuredEvents.map((event, i) => (
                <div key={event._id} className="flex-shrink-0 w-[320px]">
                  <EventCard event={event} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── All Events Section ──────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Explore All Events
            </h2>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Find the perfect event for you
            </p>
          </div>

          {/* Category Pills */}
          <div className="mb-8">
            <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No events found"
              message="Try different filters or check back later for new events."
              action={
                <Link to="/events" className="btn-primary">
                  Browse All Events
                </Link>
              }
            />
          )}

          {/* View More */}
          {events.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/events" className="btn-secondary">
                View All Events →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Section ─────────────────────────────────────── */}
      <section className={`py-20 ${isDark ? 'bg-dark-800/50' : 'bg-primary-50'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Ready to Create Your Own Event?
            </h2>
            <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Join thousands of organizers who trust EventFlow to manage their events.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Get Started Free
              </Link>
              <Link to="/events" className="btn-secondary text-lg px-8 py-4">
                Explore Events
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
