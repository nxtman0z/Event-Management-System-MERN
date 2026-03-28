import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div
        className={`${sizeClasses[size]} rounded-full border-primary-500/30 border-t-primary-500 animate-spin`}
      />
      {text && (
        <p className={`mt-4 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

// Skeleton Card for loading states
export const SkeletonCard = () => {
  const { isDark } = useTheme();

  return (
    <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-dark-700/50 border border-white/5' : 'bg-white border border-gray-100'}`}>
      <div className={`h-48 ${isDark ? 'skeleton bg-white/5' : 'animate-pulse bg-gray-100'}`} />
      <div className="p-5 space-y-3">
        <div className={`h-5 rounded-xl w-3/4 ${isDark ? 'skeleton bg-white/5' : 'animate-pulse bg-gray-100'}`} />
        <div className={`h-4 rounded-xl w-full ${isDark ? 'skeleton bg-white/5' : 'animate-pulse bg-gray-100'}`} />
        <div className={`h-4 rounded-xl w-2/3 ${isDark ? 'skeleton bg-white/5' : 'animate-pulse bg-gray-100'}`} />
        <div className="flex gap-2 pt-2">
          <div className={`h-3 rounded-xl w-24 ${isDark ? 'skeleton bg-white/5' : 'animate-pulse bg-gray-100'}`} />
          <div className={`h-3 rounded-xl w-20 ${isDark ? 'skeleton bg-white/5' : 'animate-pulse bg-gray-100'}`} />
        </div>
      </div>
    </div>
  );
};
