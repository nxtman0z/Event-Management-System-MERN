import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash, HiOutlineUsers, HiOutlinePlusCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { eventsAPI } from '../utils/api';
import { formatDate, getCategoryEmoji } from '../utils/helpers';

const MyEventsPage = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, eventId: null, title: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await eventsAPI.getMyEvents();
      if (data.success) setEvents(data.data.events);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await eventsAPI.delete(deleteModal.eventId);
      toast.success('Event deleted successfully');
      setDeleteModal({ open: false, eventId: null, title: '' });
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;

  return (
    <div className={`min-h-screen pt-20 ${isDark ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>My Events</h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>{events.length} events created</p>
          </div>
          <Link to="/events/create" className="btn-primary flex items-center gap-2">
            <HiOutlinePlusCircle className="w-5 h-5" /> Create Event
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl transition-all ${
                  isDark ? 'bg-dark-700/50 border border-white/5 hover:border-white/10' : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  {event.bannerImage ? (
                    <img src={`http://localhost:5000${event.bannerImage}`} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full gradient-bg flex items-center justify-center">
                      <span className="text-2xl">{getCategoryEmoji(event.category)}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                    <span className={`badge badge-${event.status || 'upcoming'} text-[10px]`}>
                      {event.status || 'upcoming'}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    📅 {formatDate(event.date)} {event.time && `• ${event.time}`}
                    {event.location && ` • 📍 ${event.location}`}
                  </p>
                  <div className={`flex items-center gap-3 mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span className="flex items-center gap-1">
                      <HiOutlineUsers className="w-3.5 h-3.5" />
                      {event.registeredUsers?.length || 0} / {event.capacity}
                    </span>
                    <span>{event.isFree ? 'Free' : `₹${event.ticketPrice}`}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/events/${event._id}`} className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500'}`}>
                    <HiOutlineEye className="w-5 h-5" />
                  </Link>
                  <Link to={`/events/edit/${event._id}`} className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-gray-400 hover:text-primary-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                    <HiOutlinePencil className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => setDeleteModal({ open: true, eventId: event._id, title: event.title })}
                    className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-red-500/10 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-500'}`}
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No events yet"
            message="Create your first event and start managing registrations."
            action={<Link to="/events/create" className="btn-primary">Create Event</Link>}
          />
        )}

        {/* Delete Modal */}
        <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, eventId: null, title: '' })} title="Delete Event">
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Are you sure you want to delete <strong>"{deleteModal.title}"</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setDeleteModal({ open: false, eventId: null, title: '' })} className="btn-ghost">Cancel</button>
            <button onClick={handleDelete} className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors">
              Delete
            </button>
          </div>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default MyEventsPage;
