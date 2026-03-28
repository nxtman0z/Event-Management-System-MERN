import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineXMark, HiOutlineClock } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Footer from '../components/Footer';
import { registrationsAPI } from '../utils/api';
import { formatDate, getCountdown, getCategoryEmoji } from '../utils/helpers';

const MyRegistrationsPage = () => {
  const { isDark } = useTheme();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const { data } = await registrationsAPI.getMyRegistrations();
      if (data.success) setRegistrations(data.data.registrations);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId) => {
    try {
      const { data } = await registrationsAPI.cancel(eventId);
      if (data.success) {
        toast.success('Registration cancelled');
        fetchRegistrations();
      }
    } catch (error) {
      toast.error('Failed to cancel registration');
    }
  };

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;

  return (
    <div className={`min-h-screen pt-20 ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>My Registrations</h1>
          <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{registrations.length} events registered</p>
        </motion.div>

        {registrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrations.map((reg, i) => {
              const event = reg.event;
              if (!event) return null;
              const countdown = getCountdown(event.date);

              return (
                <motion.div
                  key={reg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl overflow-hidden ${
                    isDark ? 'bg-dark-700/50 border border-white/5 hover:border-white/10' : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
                  } transition-all`}
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="w-28 flex-shrink-0">
                      {event.bannerImage ? (
                        <img src={`http://localhost:5000${event.bannerImage}`} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full gradient-bg flex items-center justify-center min-h-[120px]">
                          <span className="text-3xl">{getCategoryEmoji(event.category)}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <Link to={`/events/${event._id}`} className={`font-bold text-sm hover:text-primary-400 transition-colors line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {event.title}
                          </Link>
                          <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            📅 {formatDate(event.date)} {event.time && `• ${event.time}`}
                          </p>
                          {event.location && (
                            <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>📍 {event.location}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleCancel(event._id)}
                          className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${isDark ? 'hover:bg-red-500/10 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}
                          title="Cancel Registration"
                        >
                          <HiOutlineXMark className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Countdown */}
                      {countdown && !countdown.expired && (
                        <div className={`mt-2 flex items-center gap-1.5 text-xs ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                          <HiOutlineClock className="w-3.5 h-3.5" />
                          <span className="font-medium">Starts in {countdown.text}</span>
                        </div>
                      )}
                      {countdown?.expired && (
                        <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Event has passed</p>
                      )}

                      <div className="mt-2">
                        <span className={`badge badge-${reg.status} text-[10px]`}>{reg.status}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No registrations"
            message="You haven't registered for any events yet."
            action={<Link to="/events" className="btn-primary">Browse Events</Link>}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyRegistrationsPage;
