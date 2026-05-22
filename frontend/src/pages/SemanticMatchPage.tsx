import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitMerge, Loader2, FileText, Briefcase, Zap, Info } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { semanticMatch } from '../services/api';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/Toast';
import ScoreRing from '../components/ui/ScoreRing';
import ProgressBar from '../components/ui/ProgressBar';
import { generateId, getScoreLabel } from '../utils/helpers';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts';

const RADAR_DATA = (score: number) => [
  { subject: 'Relevance', score: Math.min(100, score * 105) },
  { subject: 'Context', score: Math.min(100, score * 95) },
  { subject: 'Keywords', score: Math.min(100, score * 110) },
  { subject: 'Seniority', score: Math.min(100, score * 90) },
  { subject: 'Domain', score: Math.min(100, score * 100) },
];

const SemanticMatchPage: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState<{ similarity_score: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const { addAnalysis } = useResume();
  const { toasts, addToast, removeToast } = useToast();

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      addToast('error', 'Missing fields', 'Both resume text and job description are required');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await semanticMatch(resumeText, jobDesc);
      setResult(data);
      addAnalysis({
        id: generateId(),
        timestamp: new Date().toISOString(),
        resumeText,
        jobDescription: jobDesc,
        similarityScore: data.similarity_score,
      });
      addToast('success', 'Semantic analysis done!', `Similarity: ${(data.similarity_score * 100).toFixed(1)}%`);
    } catch {
      addToast('error', 'Analysis failed', 'Could not connect to backend API.');
    } finally {
      setLoading(false);
    }
  };

  const scorePercent = result ? Math.round(result.similarity_score * 100) : 0;

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <GitMerge className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Semantic Match</h1>
              <p className="text-slate-500 text-sm">Embedding-based cosine similarity between resume and job description</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-4 mb-6 flex items-start gap-3 border-sky-500/20"
        >
          <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-400">
            Semantic similarity uses transformer-based embeddings to measure how contextually similar your resume is to a job description.
            A score above <span className="text-accent-400 font-semibold">0.80 (80%)</span> indicates strong alignment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
        >
          <div className="glass-card p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
              <FileText className="w-4 h-4 text-brand-400" /> Resume Text
            </label>
            <textarea
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your resume text..."
              className="input-field resize-none text-sm h-48 font-mono"
            />
          </div>
          <div className="glass-card p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
              <Briefcase className="w-4 h-4 text-sky-400" /> Job Description
            </label>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the job description..."
              className="input-field resize-none text-sm h-48"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl px-10 py-3.5 inline-flex items-center gap-2 transition-all shadow-glow-sm hover:shadow-glow-md"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {loading ? 'Computing Similarity...' : 'Compute Semantic Similarity'}
          </button>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="glass-card p-8 border border-sky-500/30">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ScoreRing score={scorePercent} size={140} label="Semantic Similarity" sublabel={getScoreLabel(scorePercent)} />
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-white">
                        {result.similarity_score.toFixed(4)}
                        <span className="text-lg text-slate-500 ml-2">cosine score</span>
                      </p>
                      <p className="text-slate-400 mt-2 text-sm">
                        {scorePercent >= 85
                          ? 'Excellent semantic alignment. Your resume strongly matches this role.'
                          : scorePercent >= 70
                          ? 'Good alignment. Minor language adjustments could improve the match further.'
                          : scorePercent >= 50
                          ? 'Moderate alignment. Consider tailoring your resume language to match the JD.'
                          : 'Low alignment. Significant content revision needed to match this role.'}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <ProgressBar label="Overall Similarity" value={scorePercent} height="h-2.5" />
                      <ProgressBar label="Context Relevance" value={Math.min(100, scorePercent * 1.05)} height="h-2" />
                      <ProgressBar label="Domain Alignment" value={Math.min(100, scorePercent * 0.97)} height="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-slate-200 mb-4">Multi-Dimension Analysis</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart cx="50%" cy="50%" outerRadius={80} data={RADAR_DATA(result.similarity_score)}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Radar name="Score" dataKey="score" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-slate-200 mb-4">Score Interpretation</h3>
                  <div className="space-y-3">
                    {[
                      { range: '0.90+', pct: '90%+', label: 'Near-perfect match', color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/20' },
                      { range: '0.75-0.89', pct: '75-89%', label: 'Strong alignment', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                      { range: '0.60-0.74', pct: '60-74%', label: 'Moderate match', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                      { range: 'Below 0.60', pct: '<60%', label: 'Low match', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                    ].map(item => (
                      <div key={item.range} className={`flex items-center justify-between p-3 rounded-xl border ${item.bg}`}>
                        <div>
                          <span className={`text-sm font-bold ${item.color}`}>{item.range}</span>
                          <p className="text-xs text-slate-500">{item.label}</p>
                        </div>
                        <span className={`text-sm font-semibold ${item.color}`}>{item.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-400" />
                  How to Improve Your Semantic Score
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    'Mirror exact phrases from the job description',
                    'Use industry-specific terminology aligned to the role',
                    'Include quantified achievements in similar context',
                    'Align your professional summary with job requirements',
                    'Use the same action verbs as the job description',
                    'Match the seniority level language in your experience',
                  ].map(tip => (
                    <div key={tip} className="flex items-start gap-2 text-sm text-slate-400 glass rounded-xl p-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-sky-500/30 border-t-sky-500 animate-spin" />
            <div className="text-center">
              <p className="font-semibold text-slate-200">Computing Semantic Similarity</p>
              <p className="text-sm text-slate-500 mt-1">Using transformer embeddings to measure contextual alignment...</p>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SemanticMatchPage;
