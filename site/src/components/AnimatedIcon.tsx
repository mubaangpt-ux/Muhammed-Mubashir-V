import React, { useRef, useState } from 'react';

interface Props {
  icon: React.ElementType;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  autoPlay?: boolean;
}

export default function AnimatedIcon({
  icon: Icon,
  size = 16,
  color = 'currentColor',
  strokeWidth = 1.8,
  className = '',
  autoPlay = false,
}: Props) {
  const ref = useRef<any>(null);
  const [playing, setPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (ref.current) {
      ref.current.startAnimation?.();
      setPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setPlaying(false);
  };

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-flex' }}
    >
      <Icon
        ref={ref}
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth
      />
    </span>
  );
}
