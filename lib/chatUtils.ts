// Utility functions for chat components

/**
 * Generate a random color for avatar based on string input
 * @param str - String to generate color from
 * @returns Tailwind CSS color class
 */
export const getRandomColor = (str: string): string => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
  ];
  const index = str.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Get the first letter of a string in uppercase
 * @param visitor - String to get first letter from
 * @returns First letter in uppercase
 */
export const getFirstLetter = (visitor: string): string => {
  return visitor.charAt(0).toUpperCase();
};

/**
 * Format a date string to relative time or actual date
 * @param dateString - ISO date string
 * @returns Formatted time string
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  // For dates older than 1 day, show actual date and time
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleDateString('en-US', options);
};
