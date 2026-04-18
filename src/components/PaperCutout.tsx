import React from 'react';
import { cn } from '../lib/utils';

interface PaperCutoutProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  roughness?: 'low' | 'medium' | 'high';
  shadow?: boolean;
}

export const PaperCutout: React.FC<PaperCutoutProps> = ({ 
  children, 
  className, 
  color = 'bg-white',
  roughness = 'medium',
  shadow = true
}) => {
  // Generate a random-ish polygon for the rough edge effect
  const generatePolygon = () => {
    const points = 20;
    const path: string[] = [];
    const variance = roughness === 'high' ? 3 : roughness === 'medium' ? 1.5 : 0.5;

    // Top edge
    for (let i = 0; i <= points; i++) {
        const x = (i / points) * 100;
        const y = Math.random() * variance;
        path.push(`${x}% ${y}%`);
    }
    // Right edge
    for (let i = 1; i <= points; i++) {
        const x = 100 - (Math.random() * variance);
        const y = (i / points) * 100;
        path.push(`${x}% ${y}%`);
    }
    // Bottom edge
    for (let i = points - 1; i >= 0; i--) {
        const x = (i / points) * 100;
        const y = 100 - (Math.random() * variance);
        path.push(`${x}% ${y}%`);
    }
    // Left edge
    for (let i = points - 1; i >= 1; i--) {
        const x = Math.random() * variance;
        const y = (i / points) * 100;
        path.push(`${x}% ${y}%`);
    }

    return `polygon(${path.join(', ')})`;
  };

  const [clipPath] = React.useState(generatePolygon);

  return (
    <div 
      className={cn(
        "relative transition-transform duration-300", 
        shadow && "paper-shadow",
        className
      )}
    >
      <div 
        className={cn("w-full h-full p-6", color)}
        style={{ clipPath }}
      >
        {children}
      </div>
    </div>
  );
};
