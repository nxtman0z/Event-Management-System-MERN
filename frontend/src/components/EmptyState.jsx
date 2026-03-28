import { motion } from 'framer-motion';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';

const EmptyState = ({ title = 'No events found', message = 'Try adjusting your filters or search query.', icon, action }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div
        className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${
          isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'
        }`}
      >
        {icon || <HiOutlineCalendarDays className={`w-10 h-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />}
      </div>
      <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`max-w-md ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
