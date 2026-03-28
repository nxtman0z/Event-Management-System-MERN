import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCalendar, HiOutlineMapPin, HiOutlineClock, HiOutlineUsers, HiOutlineUser, HiOutlineShare, HiOutlineTag, HiOutlineArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { eventsAPI, registrationsAPI } from '../utils/api';
import { formatDateTime, getCategoryEmoji, getCountdown } from '../utils/helpers';

const EventDetailPage = () => {
  const { id } = useParams();
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event?.date) {
      const timer = setInterval(() => {
        setCountdown(getCountdown(event.date));
      }, 60000); // update every minute
      setCountdown(getCountdown(event.date));
      return () => clearInterval(timer);
    }
  }, [event]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const { data } = await eventsAPI.getById(id);
      if (data.success) {
        setEvent(data.data.event);
        // Check if user is registered
        if (user) {
          const registered = data.data.event.registeredUsers?.some(
            (u) => (typeof u === 'object' ? u._id : u) === user._id
          );
          setIsRegistered(registered);
        }
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events');
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    try {
      setRegistering(true);
      const { data } = await registrationsAPI.register(id);
      if (data.success) {
        setIsRegistered(true);
        toast.success(data.message);
        // Trigger confetti
        try {
          const confetti = (await import('canvas-confetti')).default;
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (e) { /* confetti optional */ }
        fetchEvent(); // Refresh to update count
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      setRegistering(true);
      const { data } = await registrationsAPI.cancel(id);
      if (data.success) {
        setIsRegistered(false);
        toast.success('Registration cancelled');
        fetchEvent();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return <div className="pt-20"><LoadingSpinner text="Loading event..." /></div>;
  if (!event) return null;

  const attendeeCount = event.registeredUsers?.length || 0;
  const capacityPercent = event.capacity ? Math.min((attendeeCount / event.capacity) * 100, 100) : 0;
  const isOrganizer = user && event.organizer?._id === user._id;

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      {/* Banner */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        {event.bannerImage ? (
          <img src={`http://localhost:5000${event.bannerImage}`} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full gradient-bg flex items-center justify-center">
            <span className="text-8xl">{getCategoryEmoji(event.category)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 backdrop-blur-sm text-white text-sm hover:bg-black/50 transition-colors">
            <HiOutlineArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-6 sm:p-8 ${isDark ? 'bg-dark-700 border border-white/10' : 'bg-white border border-gray-200 shadow-lg'}`}>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge badge-${event.status || 'upcoming'}`}>
                  {(event.status || 'upcoming').charAt(0).toUpperCase() + (event.status || 'upcoming').slice(1)}
                </span>
                <span className={`badge ${event.isFree ? 'badge-free' : 'badge-paid'}`}>
                  {event.isFree ? 'Free Event' : `₹${event.ticketPrice}`}
                </span>
                <span className={`badge ${isDark ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600'}`}>
                  {getCategoryEmoji(event.category)} {event.category}
                </span>
              </div>

              <h1 className={`text-2xl sm:text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {event.title}
              </h1>

              {/* Event Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <HiOutlineCalendar className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Date</p>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatDateTime(event.date)}
                    </p>
                  </div>
                </div>

                {event.time && (
                  <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className="w-10 h-10 rounded-xl bg-accent-400/10 flex items-center justify-center">
                      <HiOutlineClock className="w-5 h-5 text-accent-400" />
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Time</p>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.time}</p>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <HiOutlineMapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Location</p>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.location}</p>
                    </div>
                  </div>
                )}

                {event.venue && (
                  <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <HiOutlineMapPin className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Venue</p>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.venue}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>About This Event</h2>
                <div className={`prose max-w-none text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {event.description || 'No description provided.'}
                </div>
              </div>

              {/* Tags */}
              {event.tags?.length > 0 && (
                <div className="mb-6">
                  <h3 className={`text-sm font-semibold mb-2 flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <HiOutlineTag className="w-4 h-4" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600'}`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className={`rounded-2xl p-6 ${isDark ? 'bg-dark-700 border border-white/10' : 'bg-white border border-gray-200 shadow-lg'}`}>
              <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Organized by</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-lg">
                  {event.organizer?.name?.charAt(0)?.toUpperCase() || <HiOutlineUser />}
                </div>
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.organizer?.name}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{event.organizer?.email}</p>
                </div>
              </div>
            </motion.div>

            {/* Registration Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className={`rounded-2xl p-6 ${isDark ? 'bg-dark-700 border border-white/10' : 'bg-white border border-gray-200 shadow-lg'}`}>

              {/* Countdown */}
              {countdown && !countdown.expired && (
                <div className="mb-4 text-center">
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-2`}>Event starts in</p>
                  <div className="flex justify-center gap-3">
                    {[
                      { val: countdown.days, label: 'Days' },
                      { val: countdown.hours, label: 'Hrs' },
                      { val: countdown.minutes, label: 'Min' },
                    ].map((item) => (
                      <div key={item.label} className={`px-3 py-2 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.val}</div>
                        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attendees */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium flex items-center gap-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <HiOutlineUsers className="w-4 h-4" /> Attendees
                  </span>
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {attendeeCount} / {event.capacity}
                  </span>
                </div>
                <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${capacityPercent}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${
                      capacityPercent >= 90 ? 'bg-red-500' : capacityPercent >= 60 ? 'bg-amber-500' : 'bg-gradient-to-r from-primary-500 to-accent-400'
                    }`}
                  />
                </div>
                {capacityPercent >= 90 && (
                  <p className="text-xs text-red-400 mt-1">Almost full!</p>
                )}
              </div>

              {/* Price */}
              <div className={`p-3 rounded-xl mb-4 text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {event.isFree ? 'Free' : `₹${event.ticketPrice}`}
                </span>
              </div>

              {/* Action Buttons */}
              {!isOrganizer && (
                <>
                  {isRegistered ? (
                    <div className="space-y-2">
                      <div className="text-center py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
                        ✓ Registered
                      </div>
                      <button
                        onClick={handleCancelRegistration}
                        disabled={registering}
                        className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
                      >
                        {registering ? 'Cancelling...' : 'Cancel Registration'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={registering || event.status === 'cancelled' || event.status === 'completed'}
                      className="btn-primary w-full !py-3.5"
                    >
                      {registering ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Registering...
                        </span>
                      ) : event.status === 'cancelled' ? 'Event Cancelled' : event.status === 'completed' ? 'Event Ended' : 'Register Now'}
                    </button>
                  )}
                </>
              )}

              {isOrganizer && (
                <Link to={`/events/edit/${event._id}`} className="btn-primary w-full text-center block !py-3.5">
                  Edit Event
                </Link>
              )}

              {/* Share */}
              <button onClick={handleShare} className={`w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border ${
                isDark ? 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
                <HiOutlineShare className="w-4 h-4" /> Share Event
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default EventDetailPage;
