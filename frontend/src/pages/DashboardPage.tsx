import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Target, GitMerge, Upload, TrendingUp, Clock,
  ArrowRight, Brain, Sparkles, Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import AnalyticsLineChart from '../charts/AnalyticsLineChart';
import ATSScoreChart from '../charts/ATSScoreChart';
import { formatDate, formatTime, getScoreLabel } from '../utils/helpers';

const SAMPLE_ANALYTICS = [
  { date: 'Jan', score: 55 }, { date: 'Feb', score: 62 },
  { date: 'Mar', score: 70 }, { date: 'Apr', score: 67 },
  { date: 'May', score: 78 }, { date: 'Jun', score: 85 },
  { date: 'Jul', score: 89 },
];

const quickActions = [
  { label: 'Analyze Resume', icon: FileText, to: '/api/analyze', color: 'from-brand-500 to-brand-600', desc: 'Classify & analyze' },
  { label: 'ATS Report', icon: Target, to: '/api/ats', color: 'from-accent-500 to-accent-600', desc: 'Score vs job description' },
  { label: 'Semantic Match', icon: GitMerge, to: '/api/semantic', color: 'from-sky-500 to-sky-600', desc: 'Embedding similarity' },
  { label: 'Upload PDF', icon: Upload, to: '/api/upload', color: 'from-orange-500 to-orange-600', desc: 'Drag & drop upload' },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { analyses } = useResume();

  const stats = useMemo(() => {
    const withAts = analyses.filter(a => a.atsReport);
    const avgScore = withAts.length
      ? Math.round(withAts.reduce((s, a) => s + (a.atsReport?.final_score ?? 0), 0) / withAts.length)
      : 0;
    return {
      total: analyses.length,
      avgScore,
      withJD: analyses.filter(a => a.jobDescription).length,
      categories: [...new Set(analyses.map(a => a.category).filter(Boolean))].length,
    };
  }, [analyses]);

  const recentAts = useMemo(() => {
    const withAts = analyses.filter(a => a.atsReport).slice(0, 4);
    return withAts.map(a => ({
      name: a.atsReport!.role || a.category || 'Unknown',
      score: a.atsReport!.final_score,
    }));
  }, [analyses]);

  const recentAnalyses = analyses.slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {greeting}, <span className="gradient-text">{user?.name.split(' ')[0]}</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Here's your resume intelligence overview</p>
            </div>
            <Link to="/upload" className="btn-primary text-sm">
              <Upload className="w-4 h-4" /> Upload New Resume
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Analyses" value={stats.total} subtitle="all time" icon={Activity} delay={0} trend={stats.total > 0 ? { value: 12, label: 'this week' } : undefined} />
          <StatCard title="Avg ATS Score" value={stats.avgScore ? `${stats.avgScore}%` : '--'} subtitle={stats.avgScore ? getScoreLabel(stats.avgScore) : 'No analyses yet'} icon={Target} iconColor="text-accent-400" delay={0.1} />
          <StatCard title="JD Analyses" value={stats.withJD} subtitle="with job description" icon={GitMerge} iconColor="text-sky-400" delay={0.2} />
          <StatCard title="Role Categories" value={stats.categories} subtitle="distinct roles detected" icon={Brain} iconColor="text-orange-400" delay={0.3} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <Link
                to={action.to}
                className="glass-card p-5 flex flex-col gap-3 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 block"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{action.label}</p>
                  <p className="text-xs text-slate-500">{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all mt-auto" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">ATS Score Trend</h3>
                <p className="text-xs text-slate-500">Last 7 months</p>
              </div>
              <span className="tag-green text-xs">+34 pts</span>
            </div>
            <AnalyticsLineChart data={SAMPLE_ANALYTICS} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">AI Tip of the Day</h3>
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-sm text-slate-400 leading-relaxed">
                Quantify your achievements with specific numbers. Instead of "improved performance," say "increased API response time by 40%."
              </p>
              <div className="glass rounded-xl p-3 mt-3">
                <p className="text-xs font-semibold text-brand-300 mb-1">Quick Checklist</p>
                {['Add measurable results', 'Use ATS-friendly keywords', 'Match job description language', 'Keep under 2 pages'].map(tip => (
                  <div key={tip} className="flex items-center gap-2 text-xs text-slate-500 py-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Recent ATS Scores by Role</h3>
              <Link to="/ats" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {recentAts.length > 0 ? (
              <ATSScoreChart data={recentAts} />
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-600 text-sm">
                No ATS analyses yet. <Link to="/ats" className="text-brand-400 ml-1">Run one now</Link>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Recent Analyses</h3>
              <Link to="/history" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                View history <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {recentAnalyses.length > 0 ? (
              <div className="space-y-3">
                {recentAnalyses.map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/6 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{a.category || 'Resume'}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(a.timestamp)} at {formatTime(a.timestamp)}
                      </div>
                    </div>
                    {a.atsReport && (
                      <span className={`text-xs font-bold ${a.atsReport.final_score >= 80 ? 'text-accent-400' : a.atsReport.final_score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {a.atsReport.final_score}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <TrendingUp className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-slate-500 text-sm">No analyses yet</p>
                <Link to="/analyze" className="text-brand-400 text-xs mt-1 hover:text-brand-300">Start your first analysis</Link>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 mt-6"
        >
          <h3 className="text-sm font-semibold text-slate-200 mb-4">ATS Score Guide</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { range: '85-100', label: 'Excellent', color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/30', desc: 'Very high match. Apply confidently.' },
              { range: '70-84', label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', desc: 'Strong match with minor gaps.' },
              { range: '50-69', label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', desc: 'Moderate match. Needs improvement.' },
              { range: '0-49', label: 'Needs Work', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', desc: 'Low match. Significant revision needed.' },
            ].map(item => (
              <div key={item.label} className={`rounded-xl p-3 border ${item.bg}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${item.color}`}>{item.range}</span>
                  <span className={`text-xs font-medium ${item.color}`}>{item.label}</span>
                </div>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
