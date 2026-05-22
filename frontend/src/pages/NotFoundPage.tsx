import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Brain } from 'lucide-react';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-radial from-brand-600/15 to-transparent blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-radial from-accent-600/10 to-transparent blur-3xl" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md relative"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow-md">
          <Brain className="w-8 h-8 text-white" />
        </div>
      </div>

      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-8xl font-bold gradient-text mb-4"
      >
        404
      </motion.h1>

      <h2 className="text-2xl font-bold text-white mb-3">Page not found</h2>
      <p className="text-slate-500 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/" className="btn-primary">
          <Home className="w-4 h-4" /> Go Home
        </Link>
        <button onClick={() => window.history.back()} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    </motion.div>
  </div>
);

export default NotFoundPage;
