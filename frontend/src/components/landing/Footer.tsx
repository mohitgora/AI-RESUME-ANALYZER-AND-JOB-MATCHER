import React from 'react';
import { Brain, Mail } from 'lucide-react';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
const Footer: React.FC = () => (
  <footer className="bg-dark-950 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Resum<span className="gradient-text">AI</span></span>
          </div>
          <p className="text-sm text-slate-500 max-w-xs mb-4">
            AI-powered resume analysis platform helping professionals land their dream jobs with intelligent insights.
          </p>
          <div className="flex items-center gap-3">
            {[FaTwitter, FaGithub, FaLinkedin, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-4">Product</h4>
          <ul className="space-y-2.5">
            {['Resume Analyzer', 'ATS Optimizer', 'Semantic Match', 'Career Insights'].map(item => (
              <li key={item}><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-4">Company</h4>
          <ul className="space-y-2.5">
            {['About', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'].map(item => (
              <li key={item}><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-600">&copy; 2026 ResumAI. All rights reserved.</p>
        <p className="text-xs text-slate-600">Built with AI -- for your career</p>
      </div>
    </div>
  </footer>
);

export default Footer;
