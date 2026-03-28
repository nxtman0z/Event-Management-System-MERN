import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMapPin, HiOutlineCalendar, HiOutlineUsers, HiOutlineUser } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';
import { formatDate, truncateText, getCategoryEmoji } from '../utils/helpers';

const EventCard = ({ event, index = 0 }) => {
  const { isDark } = useTheme();
  const attendeeCount = event.registeredUsers?.length || 0;
  const capacityPercent = event.capacity ? Math.min((attendeeCount / event.capacity) * 100, 100) : 0;

  // Generate a gradient placeholder if no banner
  const gradients = [
    'from-primary-500/30 to-accent-400/30',
    'from-purple-500/30 to-pink-500/30',
    'from-cyan-500/30 to-blue-500/30',
    'from-emerald-500/30 to-teal-500/30',
    'from-orange-500/30 to-red-500/30',
    'from-indigo-500/30 to-purple-500/30',
  ];
  const gradientClass = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/events/${event._id}`} className="block">
        <div
          className={`rounded-2xl overflow-hidden transition-all duration-500 ${
            isDark
              ? 'bg-dark-700/50 border border-white/5 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/10'
              : 'bg-white border border-gray-100 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/10'
          }`}
        >
          {/* Banner */}
          <div className="relative h-48 overflow-hidden">
            {event.bannerImage ? (
              <img
                src={`http://localhost:5000${event.bannerImage}`}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
                <span className="text-5xl">{getCategoryEmoji(event.category)}</span>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className={`badge ${isDark ? 'bg-white/10 backdrop-blur-sm text-white border-white/20' : 'bg-white/90 text-gray-800 border-gray-200'}`}>
                {getCategoryEmoji(event.category)} {event.category}
              </span>
            </div>

            {/* Price badge */}
            <div className="absolute top-3 right-3">
              <span className={`badge ${event.isFree ? 'badge-free' : 'badge-paid'}`}>
                {event.isFree ? 'Free' : `₹${event.ticketPrice}`}
              </span>
            </div>

            {/* Status badge */}
            {event.status && event.status !== 'upcoming' && (
              <div className="absolute bottom-3 right-3">
                <span className={`badge badge-${event.status}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <h3
              className={`text-lg font-bold mb-2 transition-colors line-clamp-1 ${
                isDark ? 'text-white group-hover:text-primary-400' : 'text-gray-900 group-hover:text-primary-600'
              }`}
            >
              {event.title}
            </h3>

            {/* Description */}
            <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {truncateText(event.description, 100) || 'No description available'}
            </p>

            {/* Date & Location */}
            <div className="space-y-2 mb-4">
              <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <HiOutlineCalendar className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span>{formatDate(event.date)}{event.time ? ` • ${event.time}` : ''}</span>
              </div>
              {event.location && (
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <HiOutlineMapPin className="w-4 h-4 text-accent-400 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}
            </div>

            {/* Capacity Progress */}
            {event.capacity && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <HiOutlineUsers className="w-3.5 h-3.5" />
                    <span>{attendeeCount} / {event.capacity}</span>
                  </div>
                  <span className={`text-xs font-medium ${capacityPercent >= 90 ? 'text-red-400' : capacityPercent >= 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {Math.round(capacityPercent)}%
                  </span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${capacityPercent}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={`h-full rounded-full ${
                      capacityPercent >= 90
                        ? 'bg-gradient-to-r from-red-500 to-red-400'
                        : capacityPercent >= 60
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-primary-500 to-accent-400'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold">
                  {event.organizer?.name?.charAt(0)?.toUpperCase() || <HiOutlineUser className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {event.organizer?.name || 'Organizer'}
                </span>
              </div>
              <span className={`text-xs ${isDark ? 'text-primary-400' : 'text-primary-600'} font-semibold group-hover:translate-x-1 transition-transform`}>
                View →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
