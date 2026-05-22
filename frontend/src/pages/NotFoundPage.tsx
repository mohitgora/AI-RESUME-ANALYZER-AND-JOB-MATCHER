import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 text-white relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center max-w-xl"
      >
        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-red-400" />
        </div>

        <h1 className="text-7xl font-bold gradient-text mb-4">
          404
        </h1>

        <h2 className="text-3xl font-bold mb-4">
          Page Not Found
        </h2>

        <p className="text-slate-400 mb-8">
          The page you are looking for does not exist
          or has been moved.
        </p>

        <Link to="/" className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;