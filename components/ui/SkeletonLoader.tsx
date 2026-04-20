'use client';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

export default function SkeletonLoader({
  width = '100%',
  height = '20px',
  rounded = '8px',
  className = '',
}: SkeletonLoaderProps) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius: rounded,
        background: `linear-gradient(
          90deg,
          var(--surface-1) 25%,
          var(--surface-2) 50%,
          var(--surface-1) 75%
        )`,
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
      }}
      aria-hidden="true"
    />
  );
}
