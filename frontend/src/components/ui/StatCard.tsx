import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  iconColor?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, subtitle, icon: Icon, trend, iconColor = 'text-brand-400', delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="glass-card p-6 hover:border-white/20 transition-all duration-300 group cursor-default"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2.5 rounded-xl bg-white/10 group-hover:bg-white/15 transition-colors ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.value >= 0 ? 'bg-accent-500/20 text-accent-400' : 'bg-red-500/20 text-red-400'}`}>
          {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-sm text-slate-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  </motion.div>
);

export default StatCard;
