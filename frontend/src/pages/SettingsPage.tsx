import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Bell, Shield, Palette, Globe, Trash2, Save, Moon, Sun, Monitor,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/Toast';

const Section: React.FC<{ icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }> = ({
  icon, title, desc, children
}) => (
  <div className="glass-card p-6">
    <div className="flex items-start gap-3 mb-5 pb-5 border-b border-white/10">
      <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0 text-brand-400">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
    {children}
  </div>
);

const Toggle: React.FC<{ checked: boolean; onChange: () => void; label: string; desc?: string }> = ({
  checked, onChange, label, desc,
}) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm text-slate-300 font-medium">{label}</p>
      {desc && <p className="text-xs text-slate-500">{desc}</p>}
    </div>
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-brand-600' : 'bg-white/15'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

const SettingsPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { clearHistory } = useResume();
  const { toasts, addToast, removeToast } = useToast();

  const [notifications, setNotifications] = useState({
    email: true, analysis: true, tips: false, updates: true,
  });
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000');
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('dark');

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(n => ({ ...n, [key]: !n[key] }));
  };

  const handleSaveApi = () => {
    addToast('success', 'Settings saved', 'API configuration updated successfully.');
  };

  const handleClearData = () => {
    if (confirm('Clear all analysis history? This cannot be undone.')) {
      clearHistory();
      addToast('success', 'History cleared', 'All analysis data has been removed.');
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-slate-500 text-sm">Manage your preferences and configurations</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Section
              icon={<Palette className="w-4 h-4" />}
              title="Appearance"
              desc="Customize the visual theme"
            >
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Dark', icon: Moon, value: 'dark' },
                  { label: 'Light', icon: Sun, value: 'light' },
                  { label: 'System', icon: Monitor, value: 'system' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setThemeMode(opt.value as 'dark' | 'light' | 'system'); if (opt.value !== 'system') toggleTheme(); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      themeMode === opt.value
                        ? 'border-brand-500/50 bg-brand-500/10 text-brand-300'
                        : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                    }`}
                  >
                    <opt.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </Section>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Section
              icon={<Bell className="w-4 h-4" />}
              title="Notifications"
              desc="Control what alerts you receive"
            >
              <div className="divide-y divide-white/5">
                <Toggle checked={notifications.email} onChange={() => toggleNotif('email')} label="Email Notifications" desc="Receive analysis results via email" />
                <Toggle checked={notifications.analysis} onChange={() => toggleNotif('analysis')} label="Analysis Complete" desc="Notify when analysis finishes" />
                <Toggle checked={notifications.tips} onChange={() => toggleNotif('tips')} label="Career Tips" desc="Weekly AI tips to improve your resume" />
                <Toggle checked={notifications.updates} onChange={() => toggleNotif('updates')} label="Product Updates" desc="New features and improvements" />
              </div>
            </Section>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Section
              icon={<Globe className="w-4 h-4" />}
              title="API Configuration"
              desc="Configure backend connection"
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Backend API URL</label>
                  <input
                    type="url"
                    value={apiUrl}
                    onChange={e => setApiUrl(e.target.value)}
                    className="input-field text-sm font-mono"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleSaveApi} className="btn-primary text-sm py-2">
                    <Save className="w-4 h-4" /> Save Configuration
                  </button>
                  <button
                    onClick={() => addToast('info', 'Testing connection...', 'Checking API availability.')}
                    className="btn-secondary text-sm py-2"
                  >
                    Test Connection
                  </button>
                </div>
              </div>
            </Section>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Section
              icon={<Shield className="w-4 h-4" />}
              title="Privacy & Security"
              desc="Manage your data and privacy settings"
            >
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/3 border border-white/10">
                  <p className="text-sm font-medium text-slate-200 mb-1">Data Retention</p>
                  <p className="text-xs text-slate-500 mb-3">Your analysis history is stored locally in your browser. No data is sent to external servers beyond the analysis APIs.</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                    Account: {user?.email}
                  </div>
                </div>
                <button
                  onClick={handleClearData}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all w-full justify-center"
                >
                  <Trash2 className="w-4 h-4" /> Clear All Analysis History
                </button>
              </div>
            </Section>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
