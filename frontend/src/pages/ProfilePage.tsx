import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, CreditCard as Edit3, Save, Award, TrendingUp, FileText, Target, Zap } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/Toast';
import ProgressBar from '../components/ui/ProgressBar';
import { formatDate, getScoreLabel } from '../utils/helpers';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { analyses } = useResume();
  const { toasts, addToast, removeToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [bio, setBio] = useState('AI-focused software engineer passionate about building intelligent systems.');

  const withAts = analyses.filter(a => a.atsReport);
  const avgScore = withAts.length
    ? Math.round(withAts.reduce((s, a) => s + a.atsReport!.final_score, 0) / withAts.length)
    : 0;
  const bestScore = withAts.length ? Math.max(...withAts.map(a => a.atsReport!.final_score)) : 0;

  const allSkills = analyses
    .flatMap(a => a.atsReport?.resume_skills || [])
    .reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const topSkills = Object.entries(allSkills).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const handleSave = () => {
    setEditing(false);
    addToast('success', 'Profile updated');
  };

  const planColors: Record<string, string> = {
    free: 'from-slate-500 to-slate-600',
    pro: 'from-brand-500 to-brand-600',
    enterprise: 'from-yellow-500 to-orange-500',
  };

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-slate-500 text-sm">Manage your account information</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-glow-md">
              {user?.name.charAt(0).toUpperCase()}
            </div>

            {editing ? (
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="input-field text-center text-sm mb-2"
              />
            ) : (
              <h2 className="text-lg font-bold text-white mb-1">{user?.name}</h2>
            )}
            <p className="text-sm text-slate-500 mb-3">{user?.email}</p>

            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${planColors[user?.plan || 'free']} mb-4`}>
              {(user?.plan || 'free').toUpperCase()} PLAN
            </span>

            {editing ? (
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="input-field text-sm resize-none h-20 mb-4 text-center"
              />
            ) : (
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{bio}</p>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-5">
              <Calendar className="w-3.5 h-3.5" />
              Joined {user?.joinedAt ? formatDate(user.joinedAt) : 'N/A'}
            </div>

            {editing ? (
              <button onClick={handleSave} className="btn-primary w-full justify-center text-sm py-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-secondary w-full justify-center text-sm py-2">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </motion.div>

          <div className="lg:col-span-2 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {[
                { icon: FileText, label: 'Total Analyses', value: analyses.length, color: 'text-brand-400', bg: 'bg-brand-500/10' },
                { icon: Target, label: 'ATS Checks', value: withAts.length, color: 'text-accent-400', bg: 'bg-accent-500/10' },
                { icon: TrendingUp, label: 'Avg Score', value: avgScore ? `${avgScore}%` : '--', color: 'text-sky-400', bg: 'bg-sky-500/10' },
                { icon: Award, label: 'Best Score', value: bestScore ? `${bestScore}%` : '--', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              ].map(stat => (
                <div key={stat.label} className="glass-card p-4">
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                Performance Overview
              </h3>
              {withAts.length > 0 ? (
                <div className="space-y-3">
                  <ProgressBar label="Average ATS Score" value={avgScore} />
                  <ProgressBar label="Best ATS Score" value={bestScore} />
                  <ProgressBar label="Profile Completeness" value={75} />
                  <div className="pt-2 text-xs text-slate-500">
                    Score rating: <span className="text-white font-semibold">{getScoreLabel(avgScore)}</span>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-slate-500 text-sm">Run your first ATS analysis to see performance metrics.</p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card p-6"
            >
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-400" />
                Detected Skills
              </h3>
              {topSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {topSkills.map(([skill, count]) => (
                    <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs font-medium text-brand-300">
                      {skill}
                      {count > 1 && <span className="text-brand-500">x{count}</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No skills detected yet. Run an ATS analysis to see your skills.</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-400" />
                Account Details
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: user?.name, icon: User },
                  { label: 'Email Address', value: user?.email, icon: Mail },
                  { label: 'Account Plan', value: `${user?.plan?.toUpperCase()} Plan`, icon: Award },
                  { label: 'Member Since', value: user?.joinedAt ? formatDate(user.joinedAt) : 'N/A', icon: Calendar },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-sm text-slate-200 font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
