import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES, getCategoryEmoji } from '../utils/helpers';

const CategoryPills = ({ selected, onSelect }) => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
      {CATEGORIES.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(category)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
            selected === category
              ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/25'
              : isDark
              ? 'border-white/10 text-gray-400 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10'
              : 'border-gray-200 text-gray-600 hover:text-gray-900 hover:border-primary-400 hover:bg-primary-50'
          }`}
        >
          {category !== 'All' && <span className="mr-1.5">{getCategoryEmoji(category)}</span>}
          {category}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryPills;
