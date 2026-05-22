import React from 'react';

type BadgeVariant = 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  blue: 'tag-blue',
  green: 'tag-green',
  red: 'tag-red',
  yellow: 'tag-yellow',
  gray: 'tag-gray',
  purple: 'tag bg-violet-500/20 text-violet-300 border border-violet-500/30',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'gray', children, className = '' }) => (
  <span className={`${variantClasses[variant]} ${className}`}>{children}</span>
);

export default Badge;
