import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Loader2, FileText, Briefcase, CheckCircle, XCircle, Sparkles, MessageSquare } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { analyzeATS } from '../services/api';
import type { ATSResponse } from '../services/api';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/Toast';
import ScoreRing from '../components/ui/ScoreRing';
import ProgressBar from '../components/ui/ProgressBar';
import ATSScoreChart from '../charts/ATSScoreChart';
import SkillPieChart from '../charts/SkillPieChart';
import { generateId } from '../utils/helpers';

const ATSReportPage: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState<ATSResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { addAnalysis } = useResume();
  const { toasts, addToast, removeToast } = useToast();

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      addToast('error', 'Missing fields', 'Please provide both resume text and job description');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeATS(resumeText, jobDesc);
      setResult(data);
      addAnalysis({
        id: generateId(),
        timestamp: new Date().toISOString(),
        resumeText,
        jobDescription: jobDesc,
        category: data.role,
        atsReport: data,
      });
      addToast('success', 'ATS Report Ready!', `Your score: ${data.final_score}/100`);
    } catch {
      addToast('error', 'Analysis failed', 'Could not connect to backend API.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'Final', score: result.final_score },
    { name: 'Embedding', score: result.embedding_score },
    { name: 'Skills', score: result.skill_score },
    { name: 'Experience', score: result.experience_score },
  ] : [];

  const matchedSkills = result ? result.resume_skills.filter(s => result.jd_skills.includes(s)) : [];
  const missingSkills = result ? result.jd_skills.filter(s => !result.resume_skills.includes(s)) : [];

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ATS Report</h1>
              <p className="text-slate-500 text-sm">Comprehensive ATS analysis with skill matching and scoring</p>
            </div>
          </div>
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
              placeholder="Paste your resume text here..."
              className="input-field resize-none text-sm h-48 font-mono"
            />
          </div>
          <div className="glass-card p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
              <Briefcase className="w-4 h-4 text-accent-400" /> Job Description
            </label>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the target job description here..."
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
            className="btn-primary px-10 py-3.5 text-base shadow-glow-md"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
            {loading ? 'Running ATS Analysis...' : 'Run ATS Analysis'}
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
              <div className="glass-card p-6 border border-brand-500/30">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <ScoreRing score={result.final_score} size={130} label="Overall ATS Score" />
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Detected Role</p>
                      <h2 className="text-2xl font-bold text-white">{result.role}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Embedding', val: result.embedding_score },
                        { label: 'Skills', val: result.skill_score },
                        { label: 'Experience', val: result.experience_score },
                      ].map(item => (
                        <div key={item.label} className="glass rounded-xl p-3 text-center">
                          <p className="text-xl font-bold text-white">{item.val}</p>
                          <p className="text-xs text-slate-500">{item.label}</p>
                        </div>
                      ))}
                    </div>
                    {result.role_boost > 0 && (
                      <div className="flex items-center gap-2 text-sm text-accent-400">
                        <Sparkles className="w-4 h-4" />
                        <span>+{result.role_boost} role boost applied</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-slate-200 mb-4">Score Breakdown</h3>
                  <ATSScoreChart data={chartData} />
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-slate-200 mb-4">Skill Match Distribution</h3>
                  <SkillPieChart matched={matchedSkills.length} missing={missingSkills.length} />
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-200 mb-5">Detailed Score Breakdown</h3>
                <div className="space-y-4">
                  <ProgressBar label="Embedding (Semantic) Score" value={result.embedding_score} height="h-2.5" />
                  <ProgressBar label="Skill Match Score" value={result.skill_score} height="h-2.5" />
                  <ProgressBar label="Experience Score" value={result.experience_score} height="h-2.5" />
                  <ProgressBar label="Overall ATS Score" value={result.final_score} height="h-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-400" />
                    Matched Skills ({matchedSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.resume_skills.map(skill => (
                      <span
                        key={skill}
                        className={result.jd_skills.includes(skill) ? 'tag-green' : 'tag-blue'}
                      >
                        {skill}
                      </span>
                    ))}
                    {result.resume_skills.length === 0 && <p className="text-sm text-slate-500">No skills detected</p>}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    Missing Skills ({missingSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map(skill => (
                      <span key={skill} className="tag-red">{skill}</span>
                    ))}
                    {missingSkills.length === 0 && (
                      <p className="text-sm text-accent-400 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> All required skills matched!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 border border-brand-500/20">
                <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-400" />
                  AI Feedback & Explanation
                </h3>
                <div className="space-y-4">
                  <div className="glass rounded-xl p-4">
                    <p className="text-xs font-semibold text-brand-300 uppercase tracking-wider mb-2">Feedback</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{result.feedback}</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-xs font-semibold text-accent-300 uppercase tracking-wider mb-2">Explanation</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{result.explanation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/30 flex items-center justify-center">
                <Target className="w-8 h-8 text-accent-400 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-200 mb-1">Running ATS Analysis</p>
                <p className="text-sm text-slate-500">Analyzing skills, experience, and semantic similarity...</p>
              </div>
              <div className="w-full max-w-xs space-y-2">
                {['Extracting skills from resume', 'Parsing job description', 'Computing semantic similarity', 'Generating ATS score'].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.4 }}
                    className="flex items-center gap-2 text-sm text-slate-400"
                  >
                    <Loader2 className="w-3.5 h-3.5 text-accent-400 animate-spin flex-shrink-0" />
                    {step}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ATSReportPage;
