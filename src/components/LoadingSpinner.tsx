import React from 'react';

interface LoadingSpinnerProps {
  /** Additional classes for the container */
  className?: string;
  /** Size of the spinner: sm (24px), md (48px), lg (64px) */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the spinner should take up significant height (min-h-[50vh]) */
  fullScreen?: boolean;
  /** Label for screen readers */
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = '',
  size = 'md',
  fullScreen = true,
  label = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4'
  };

  const containerClasses = fullScreen
    ? "flex items-center justify-center min-h-[50vh] w-full"
    : "flex items-center justify-center";

  return (
    <div
      className={`${containerClasses} ${className}`}
      role="status"
      aria-label={label}
    >
      <div className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`} />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
