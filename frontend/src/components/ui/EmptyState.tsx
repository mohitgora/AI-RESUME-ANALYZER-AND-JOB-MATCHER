import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-8 text-center"
  >
    <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-brand-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
    {action}
  </motion.div>
);

export default EmptyState;
