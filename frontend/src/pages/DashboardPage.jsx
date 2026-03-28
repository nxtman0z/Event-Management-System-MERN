import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCalendarDays, HiOutlineTicket, HiOutlinePlusCircle, HiOutlineClock, HiOutlineChartBar } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import EventCard from '../components/EventCard';
import { SkeletonCard } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Footer from '../components/Footer';
import { eventsAPI, registrationsAPI } from '../utils/api';
import { formatDate } from '../utils/helpers';

const DashboardPage = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [myEvents, setMyEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, regsRes] = await Promise.all([
        eventsAPI.getMyEvents().catch(() => ({ data: { data: { events: [] } } })),
        registrationsAPI.getMyRegistrations().catch(() => ({ data: { data: { registrations: [] } } })),
      ]);
      setMyEvents(eventsRes.data.data.events || []);
      setMyRegistrations(regsRes.data.data.registrations || []);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = myRegistrations
    .filter((r) => r.event && new Date(r.event.date) > new Date())
    .slice(0, 4);

  const isOrganizer = user?.role === 'organizer' || user?.role === 'admin';

  const stats = isOrganizer ? [
    { label: 'Events Created', value: myEvents.length, icon: HiOutlineCalendarDays, color: 'from-primary-500 to-primary-600' },
    { label: 'Total Attendees', value: myEvents.reduce((acc, e) => acc + (e.registeredUsers?.length || 0), 0), icon: HiOutlineChartBar, color: 'from-amber-500 to-amber-600' },
  ] : [
    { label: 'Registrations', value: myRegistrations.length, icon: HiOutlineTicket, color: 'from-accent-400 to-accent-500' },
    { label: 'Upcoming', value: upcomingEvents.length, icon: HiOutlineClock, color: 'from-emerald-500 to-emerald-600' },
  ];

  return (
    <div className={`min-h-screen pt-20 ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Here's what's happening with your events
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-2xl ${isDark ? 'bg-dark-700/50 border border-white/5' : 'bg-white border border-gray-100 shadow-sm'}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-10">
          {isOrganizer && (
            <>
              <Link to="/events/create" className="btn-primary flex items-center gap-2">
                <HiOutlinePlusCircle className="w-5 h-5" /> Create Event
              </Link>
              <Link to="/my-events" className="btn-secondary flex items-center gap-2">
                Manage Events
              </Link>
            </>
          )}
          {!isOrganizer && (
            <Link to="/my-registrations" className="btn-secondary flex items-center gap-2">
              My Registrations
            </Link>
          )}
          <Link to="/events" className="btn-secondary flex items-center gap-2">
            Browse All Events
          </Link>
        </div>

        {/* Dynamic Section Based on Role */}
        {!isOrganizer ? (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📅 Your Upcoming Events
              </h2>
              <Link to="/my-registrations" className={`text-sm font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                View All →
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {upcomingEvents.map((reg, i) => (
                  <EventCard key={reg._id} event={reg.event} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No upcoming events"
                message="Browse events and register for ones you're interested in."
                action={<Link to="/events" className="btn-primary">Browse Events</Link>}
              />
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🎯 My Created Events
              </h2>
              <Link to="/my-events" className={`text-sm font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                View All →
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : myEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEvents.slice(0, 6).map((event, i) => (
                  <EventCard key={event._id} event={event} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No events created yet"
                message="Start creating your first event!"
                action={<Link to="/events/create" className="btn-primary">Create Event</Link>}
              />
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
