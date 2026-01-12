import { useState } from 'react';
import '../assets/Avatar.css';

interface AvatarProps {
  src?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
}

export const Avatar = ({ src, initials = '?', size = 'md', alt }: AvatarProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`avatar-container avatar-${size}`}>
      {src && !imgError ? (
        <img 
          src={src} 
          alt={alt || initials} 
          className="avatar-img"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{initials.substring(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
};
