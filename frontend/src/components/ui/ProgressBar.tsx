import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  height?: string;
}

const getBarColor = (v: number) => {
  if (v >= 80) return 'from-accent-500 to-accent-400';
  if (v >= 60) return 'from-yellow-500 to-yellow-400';
  return 'from-red-500 to-red-400';
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value, label, showValue = true, className = '', height = 'h-2',
}) => (
  <div className={`w-full ${className}`}>
    {(label || showValue) && (
      <div className="flex justify-between items-center mb-1.5">
        {label && <span className="text-sm text-slate-300">{label}</span>}
        {showValue && <span className="text-sm font-semibold text-slate-200">{Math.round(value)}%</span>}
      </div>
    )}
    <div className={`w-full bg-white/10 rounded-full overflow-hidden ${height}`}>
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${getBarColor(value)}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </div>
  </div>
);

export default ProgressBar;
