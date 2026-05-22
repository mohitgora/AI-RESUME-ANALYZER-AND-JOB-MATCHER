import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle, Loader2, FileText, Cloud, AlertCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { uploadResume } from '../services/api';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/Toast';
import { generateId } from '../utils/helpers';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ category: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addAnalysis } = useResume();
  const { toasts, addToast, removeToast } = useToast();

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') {
      addToast('error', 'Invalid file type', 'Only PDF files are supported');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      addToast('error', 'File too large', 'Maximum file size is 10MB');
      return;
    }
    setFile(f);
    setStatus('idle');
    setResult(null);
    setProgress(0);
  }, [addToast]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 85) { clearInterval(interval); return p; }
        return p + Math.random() * 15;
      });
    }, 300);

    try {
      const data = await uploadResume(file);
      clearInterval(interval);
      setProgress(100);
      setResult(data);
      setStatus('success');
      addAnalysis({
        id: generateId(),
        timestamp: new Date().toISOString(),
        resumeText: '',
        fileName: file.name,
        category: data.category,
      });
      addToast('success', 'Upload successful!', `Detected: ${data.category}`);
    } catch {
      clearInterval(interval);
      setStatus('error');
      addToast('error', 'Upload failed', 'Backend API not reachable. Ensure FastAPI is running.');
    }
  };

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setResult(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Upload Resume</h1>
              <p className="text-slate-500 text-sm">Upload your PDF resume for instant AI classification</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              {!file ? (
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`glass-card p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
                    dragOver ? 'border-orange-500/60 bg-orange-500/5' : 'border-white/15 hover:border-white/30 hover:bg-white/3'
                  }`}
                >
                  <motion.div
                    animate={{ y: dragOver ? -8 : 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-5"
                  >
                    <Cloud className="w-8 h-8 text-orange-400" />
                  </motion.div>
                  <p className="text-lg font-semibold text-slate-200 mb-1">
                    {dragOver ? 'Drop it here!' : 'Drag & drop your resume'}
                  </p>
                  <p className="text-sm text-slate-500 mb-4">or click to browse files</p>
                  <span className="tag-gray">PDF only -- max 10MB</span>
                </div>
              ) : (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-7 h-7 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{formatSize(file.size)} -- PDF Document</p>
                    </div>
                    {status === 'idle' && (
                      <button onClick={reset} className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {status === 'uploading' && (
                    <div className="mb-5">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-slate-400">Uploading & analyzing...</span>
                        <span className="text-xs font-semibold text-slate-300">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
                          animate={{ width: `${progress}%` }}
                          transition={{ ease: 'easeOut' }}
                        />
                      </div>
                      <div className="mt-3 space-y-1">
                        {['Parsing PDF...', 'Extracting text...', 'Classifying role...'].map((step, i) => (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: progress > i * 30 ? 1 : 0.3 }}
                            className="flex items-center gap-2 text-xs text-slate-500"
                          >
                            {progress > (i + 1) * 30
                              ? <CheckCircle className="w-3 h-3 text-accent-400" />
                              : <Loader2 className="w-3 h-3 text-orange-400 animate-spin" />
                            }
                            {step}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {status === 'success' && result && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-5 p-4 rounded-xl bg-accent-500/10 border border-accent-500/30"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-accent-400" />
                          <div>
                            <p className="text-sm font-semibold text-accent-300">Analysis Complete!</p>
                            <p className="text-xs text-slate-400">Detected Role: <span className="font-bold text-white">{result.category}</span></p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {status === 'error' && (
                    <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <div>
                          <p className="text-sm font-semibold text-red-300">Upload Failed</p>
                          <p className="text-xs text-slate-400">Backend API not reachable. Check that FastAPI is running on port 8000.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {(status === 'idle' || status === 'error') && (
                      <button
                        onClick={handleUpload}
                        className="btn-primary"
                        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                      >
                        <Upload className="w-4 h-4" />
                        Upload & Analyze
                      </button>
                    )}
                    {status === 'success' && (
                      <>
                        <a href="/ats" className="btn-primary text-sm py-2">Run ATS Check</a>
                        <button onClick={reset} className="btn-secondary text-sm py-2">Upload Another</button>
                      </>
                    )}
                    {status === 'error' && (
                      <button onClick={reset} className="btn-secondary text-sm py-2">Try Again</button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">Supported Format</h3>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <File className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">PDF</p>
                  <p className="text-xs text-slate-500">Max 10MB</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">What happens?</h3>
              <div className="space-y-3">
                {[
                  { icon: '1', title: 'PDF Parsing', desc: 'Text extracted from PDF' },
                  { icon: '2', title: 'AI Analysis', desc: 'ML model classifies role' },
                  { icon: '3', title: 'Results', desc: 'Category returned instantly' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      {item.icon}
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
              <p className="text-xs font-semibold text-brand-300 mb-2">Privacy Note</p>
              <p className="text-xs text-slate-500">
                Your resume is processed securely and not stored on our servers. Analysis happens in real-time.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
