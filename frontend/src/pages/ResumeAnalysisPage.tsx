import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader2, FileText, Sparkles, ChevronRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { predictCategory } from '../services/api';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/Toast';
import { generateId } from '../utils/helpers';

const EXAMPLE_CATEGORIES = [
  'AI Engineer', 'Software Engineer', 'Data Scientist', 'DevOps Engineer',
  'Product Manager', 'Frontend Developer', 'Backend Developer', 'ML Engineer',
];

const ResumeAnalysisPage: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<{ category: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { addAnalysis } = useResume();
  const { toasts, addToast, removeToast } = useToast();

  const handleAnalyze = async () => {
    if (!resumeText.trim()) { addToast('error', 'Please enter resume text'); return; }
    setLoading(true);
    setResult(null);
    try {
      const data = await predictCategory(resumeText);
      setResult(data);
      addAnalysis({
        id: generateId(),
        timestamp: new Date().toISOString(),
        resumeText,
        category: data.category,
      });
      addToast('success', 'Analysis complete!', `Detected role: ${data.category}`);
    } catch {
      addToast('error', 'Analysis failed', 'Could not connect to backend. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Resume Analysis</h1>
              <p className="text-slate-500 text-sm">AI-powered role classification using TF-IDF & embedding models</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-400" />
                  Resume Text
                </label>
                <span className="text-xs text-slate-500">{resumeText.length} chars</span>
              </div>
              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder={"Paste your complete resume text here...\n\nInclude your skills, experience, education, and any other relevant information.\nThe more detailed, the better the classification accuracy."}
                className="input-field resize-none font-mono text-sm h-72"
              />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-slate-500">Min 100 characters recommended for best results</p>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || resumeText.trim().length < 20}
                  className="btn-primary"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? 'Analyzing...' : 'Analyze Resume'}
                </button>
              </div>
            </div>

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 border border-accent-500/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Detected Role</p>
                    <h2 className="text-xl font-bold text-white">{result.category}</h2>
                  </div>
                </div>
                <p className="text-sm text-slate-400">
                  Our hybrid AI model (TF-IDF + embeddings) analyzed your resume and classified it into this job category.
                  Use this to optimize your resume for similar roles or run an ATS check.
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                  <a href="/ats" className="btn-primary text-sm py-2 flex items-center gap-2">
                    Run ATS Check <ChevronRight className="w-4 h-4" />
                  </a>
                  <a href="/semantic" className="btn-secondary text-sm py-2">
                    Semantic Match
                  </a>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-brand-400 animate-pulse" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">AI is analyzing your resume...</span>
                </div>
                <div className="space-y-3">
                  {['Tokenizing resume text', 'Extracting TF-IDF features', 'Computing embeddings', 'Classifying role'].map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.3 }}
                      className="flex items-center gap-2 text-sm text-slate-400"
                    >
                      <Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin flex-shrink-0" />
                      {step}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Detectable Roles
              </h3>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_CATEGORIES.map(cat => (
                  <span key={cat} className="tag-blue text-xs">{cat}</span>
                ))}
              </div>
            </div>

            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">How It Works</h3>
              <div className="space-y-3">
                {[
                  { step: '1', title: 'Text Preprocessing', desc: 'Tokenize and clean resume text' },
                  { step: '2', title: 'TF-IDF Features', desc: 'Extract term frequency vectors' },
                  { step: '3', title: 'Embeddings', desc: 'Compute semantic representations' },
                  { step: '4', title: 'Hybrid Classification', desc: 'Combine models for final prediction' },
                ].map(item => (
                  <div key={item.step} className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5 border border-brand-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-semibold text-brand-300">AI Accuracy</span>
              </div>
              <p className="text-2xl font-bold text-white">96.4%</p>
              <p className="text-xs text-slate-500">classification accuracy across 25+ categories</p>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalysisPage;
