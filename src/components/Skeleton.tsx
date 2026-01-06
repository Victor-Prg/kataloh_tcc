import '../assets/Skeleton.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  className?: string;
}

export const Skeleton = ({ 
  width, 
  height, 
  variant = 'text', 
  className 
}: SkeletonProps) => {
  
  const style = {
    width,
    height,
  };

  return (
    <div 
      className={`skeleton skeleton-${variant} ${className || ''}`} 
      style={style}
    />
  );
};