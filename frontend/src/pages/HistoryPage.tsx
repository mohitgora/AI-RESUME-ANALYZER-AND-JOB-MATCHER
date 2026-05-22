import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, FileText, Target, GitMerge, Clock, Trash2, Search, SlidersHorizontal } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useResume } from '../context/ResumeContext';
import EmptyState from '../components/ui/EmptyState';
import { formatDate, formatTime, getScoreColor, truncate } from '../utils/helpers';
import { Link } from 'react-router-dom';

const HistoryPage: React.FC = () => {
  const { analyses, clearHistory } = useResume();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'ats' | 'semantic' | 'classify'>('all');

  const filtered = analyses.filter(a => {
    const matchSearch = !search ||
      a.category?.toLowerCase().includes(search.toLowerCase()) ||
      a.resumeText.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'ats' && !!a.atsReport) ||
      (filter === 'semantic' && a.similarityScore !== undefined) ||
      (filter === 'classify' && a.category && !a.atsReport && a.similarityScore === undefined);
    return matchSearch && matchFilter;
  });

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Analysis History</h1>
                <p className="text-slate-500 text-sm">{analyses.length} total analyses</p>
              </div>
            </div>
            {analyses.length > 0 && (
              <button
                onClick={() => { if (confirm('Clear all history?')) clearHistory(); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            )}
          </div>
        </motion.div>

        {analyses.length === 0 ? (
          <EmptyState
            icon={History}
            title="No analysis history"
            description="Run your first resume analysis to see results here."
            action={<Link to="/analyze" className="btn-primary text-sm">Start Analyzing</Link>}
          />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search analyses..."
                  className="input-field pl-9 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                {(['all', 'ats', 'semantic', 'classify'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filter === f ? 'bg-brand-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'ats' ? 'ATS' : f === 'semantic' ? 'Semantic' : 'Classify'}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card overflow-hidden"
            >
              <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/10 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="col-span-4">Resume</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-3">Category / Role</div>
                <div className="col-span-2">Score</div>
                <div className="col-span-1">Date</div>
              </div>

              <div className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-sm">No results match your search.</div>
                ) : (
                  filtered.map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 px-5 py-4 hover:bg-white/3 transition-colors items-center"
                    >
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-brand-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{a.fileName || 'Text Input'}</p>
                          <p className="text-xs text-slate-600 truncate">{truncate(a.resumeText, 60)}</p>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="flex flex-wrap gap-1">
                          {a.atsReport && (
                            <span className="inline-flex items-center gap-1 tag-green text-xs">
                              <Target className="w-2.5 h-2.5" /> ATS
                            </span>
                          )}
                          {a.similarityScore !== undefined && (
                            <span className="inline-flex items-center gap-1 tag-blue text-xs">
                              <GitMerge className="w-2.5 h-2.5" /> Semantic
                            </span>
                          )}
                          {a.category && !a.atsReport && a.similarityScore === undefined && (
                            <span className="tag-gray text-xs">Classify</span>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3">
                        <p className="text-sm text-slate-300 font-medium">{a.atsReport?.role || a.category || 'N/A'}</p>
                        {a.jobDescription && (
                          <p className="text-xs text-slate-600 truncate">{truncate(a.jobDescription, 40)}</p>
                        )}
                      </div>

                      <div className="col-span-2">
                        {a.atsReport && (
                          <span className={`text-lg font-bold ${getScoreColor(a.atsReport.final_score)}`}>
                            {a.atsReport.final_score}%
                          </span>
                        )}
                        {a.similarityScore !== undefined && !a.atsReport && (
                          <span className={`text-lg font-bold ${getScoreColor(a.similarityScore * 100)}`}>
                            {(a.similarityScore * 100).toFixed(1)}%
                          </span>
                        )}
                        {!a.atsReport && a.similarityScore === undefined && (
                          <span className="text-slate-600 text-sm">--</span>
                        )}
                      </div>

                      <div className="col-span-1">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(a.timestamp)}</span>
                        </div>
                        <p className="text-xs text-slate-700 pl-4">{formatTime(a.timestamp)}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
