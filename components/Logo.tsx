'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <Image
          src="/logo.png"
          alt="New Life Care Logo"
          width={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
          height={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-primary font-bold text-lg leading-tight">NEW</span>
        <span className="text-[#FF6B35] font-bold text-lg leading-tight">LIFECARE</span>
      </div>
    </div>
  );
};

export default Logo;
