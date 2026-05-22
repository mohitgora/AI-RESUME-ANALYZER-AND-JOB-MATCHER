import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  Copy,
  Download,
  Wand2,
} from "lucide-react";

import axios from "axios";

const ResumeAnalysisPage: React.FC = () => {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<any>(null);

  const [error, setError] = useState("");

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError("Please paste resume text first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        {
          resume_text: resumeText,
        }
      );

      setResult(response.data);

    } catch (err) {
      setError("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white p-8">
      {/* Header */}
      <div className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold"
        >
          Resume Analysis
        </motion.h1>

        <p className="text-slate-400 mt-3 text-lg">
          AI-powered resume classification and intelligent
          career analysis
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-400" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Paste Resume
              </h2>

              <p className="text-slate-400 text-sm">
                Add your resume content below
              </p>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            rows={18}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your complete resume here..."
            className="w-full bg-dark-800 border border-white/10 rounded-2xl p-5 text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={analyzeResume}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Resume
                </>
              )}
            </button>

            <button
              className="btn-secondary"
              onClick={() => navigator.clipboard.writeText(resumeText)}
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>

            <button className="btn-secondary">
              <Upload className="w-4 h-4" />
              Upload PDF
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* AI Status */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-green-400" />
                </div>

                <div>
                  <h3 className="text-xl font-bold">
                    AI Engine
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Hybrid ML + Embeddings
                  </p>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                Active
              </div>
            </div>
          </div>

          {/* Result */}
          {result && (
            <>
              {/* Prediction Card */}
              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-purple-500/10" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">
                        Predicted Category
                      </p>

                      <h2 className="text-4xl font-bold mt-2 gradient-text">
                        {result.category}
                      </h2>
                    </div>

                    <div className="w-20 h-20 rounded-3xl bg-brand-500/20 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-brand-400" />
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">
                        AI Confidence
                      </span>

                      <span className="text-brand-400">
                        94%
                      </span>
                    </div>

                    <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
                      <div className="w-[94%] h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Wand2 className="w-6 h-6 text-purple-400" />

                  <h3 className="text-2xl font-bold">
                    AI Insights
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-dark-800 border border-white/5">
                    <p className="text-sm text-slate-400 mb-2">
                      Strength
                    </p>

                    <p className="text-white">
                      Strong technical skills and modern AI stack detected.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-dark-800 border border-white/5">
                    <p className="text-sm text-slate-400 mb-2">
                      Improvement Area
                    </p>

                    <p className="text-white">
                      Add more quantified achievements and deployment experience.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-dark-800 border border-white/5">
                    <p className="text-sm text-slate-400 mb-2">
                      Recommended Role
                    </p>

                    <p className="text-brand-400 font-semibold">
                      Senior AI Engineer
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="glass-card p-6">
                <div className="flex flex-wrap gap-4">
                  <button className="btn-primary">
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>

                  <button className="btn-secondary">
                    Re-analyze Resume
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!result && !loading && (
            <div className="glass-card p-10 text-center">
              <div className="w-24 h-24 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-6">
                <Brain className="w-12 h-12 text-brand-400" />
              </div>

              <h2 className="text-2xl font-bold mb-3">
                AI Resume Intelligence
              </h2>

              <p className="text-slate-400 max-w-md mx-auto">
                Paste your resume and let our hybrid AI engine
                analyze your profile, classify your role,
                and generate intelligent insights.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeAnalysisPage;