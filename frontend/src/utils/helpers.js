import { format, formatDistanceToNow, isPast, isFuture, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

/**
 * Format a date for display
 */
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

/**
 * Format date with time
 */
export const formatDateTime = (date, time) => {
  if (!date) return '';
  const formatted = format(new Date(date), 'EEEE, MMMM dd, yyyy');
  return time ? `${formatted} at ${time}` : formatted;
};

/**
 * Format date for input field
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd');
};

/**
 * Get relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Get countdown to event
 */
export const getCountdown = (date) => {
  if (!date) return null;
  const eventDate = new Date(date);
  const now = new Date();

  if (isPast(eventDate)) return { expired: true, text: 'Event has passed' };

  const days = differenceInDays(eventDate, now);
  const hours = differenceInHours(eventDate, now) % 24;
  const minutes = differenceInMinutes(eventDate, now) % 60;

  return {
    expired: false,
    days,
    hours,
    minutes,
    text: days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`,
  };
};

/**
 * Check if event is upcoming
 */
export const isUpcoming = (date) => {
  return date ? isFuture(new Date(date)) : false;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Format number with proper suffixes
 */
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num?.toString() || '0';
};

/**
 * Get category color
 */
export const getCategoryColor = (category) => {
  const colors = {
    Conference: 'from-blue-500 to-blue-600',
    Workshop: 'from-emerald-500 to-emerald-600',
    Seminar: 'from-purple-500 to-purple-600',
    Cultural: 'from-pink-500 to-pink-600',
    Sports: 'from-orange-500 to-orange-600',
    Tech: 'from-cyan-500 to-cyan-600',
    Other: 'from-gray-500 to-gray-600',
  };
  return colors[category] || colors.Other;
};

/**
 * Get category emoji
 */
export const getCategoryEmoji = (category) => {
  const emojis = {
    Conference: '🎤',
    Workshop: '🛠️',
    Seminar: '📚',
    Cultural: '🎭',
    Sports: '⚽',
    Tech: '💻',
    Other: '📌',
  };
  return emojis[category] || '📌';
};

/**
 * Category list
 */
export const CATEGORIES = ['All', 'Conference', 'Workshop', 'Seminar', 'Cultural', 'Sports', 'Tech', 'Other'];
