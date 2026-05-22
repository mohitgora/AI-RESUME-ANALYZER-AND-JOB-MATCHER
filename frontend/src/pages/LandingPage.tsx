import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  ArrowRight, Brain, Target, GitMerge, CheckCircle, Star,
  Zap, Shield, TrendingUp, ChevronRight, Play, Sparkles,
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { useTypewriter } from '../hooks/useTypewriter';
import ProgressBar from '../components/ui/ProgressBar';

  const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const features = [
  {
    icon: Brain, title: 'AI Resume Classification',
    desc: 'ML-powered categorization using TF-IDF and embedding models to classify your resume into the right role.',
    color: 'from-brand-500 to-brand-600',
  },
  {
    icon: Target, title: 'ATS Score Optimizer',
    desc: 'Hybrid scoring engine analyzing skill match, experience, and semantic similarity with job descriptions.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: GitMerge, title: 'Semantic Matching',
    desc: 'Advanced embedding-based semantic analysis to quantify how well your resume aligns with any job post.',
    color: 'from-sky-500 to-sky-600',
  },
  {
    icon: Zap, title: 'Instant AI Feedback',
    desc: 'Get actionable suggestions and intelligent feedback to improve your resume score in minutes.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: TrendingUp, title: 'Career Analytics',
    desc: 'Track your resume performance over time with detailed analytics and skill gap insights.',
    color: 'from-rose-500 to-rose-600',
  },
  {
    icon: Shield, title: 'Privacy First',
    desc: 'Your resume data is processed securely and never shared with third parties.',
    color: 'from-emerald-500 to-emerald-600',
  },
];

const testimonials = [
  {
    name: 'Arjun Sharma', role: 'Software Engineer at Google',
    text: 'ResumAI helped me increase my ATS score from 62 to 91. Got 3 interview calls within a week!',
    rating: 5, avatar: 'AS',
  },
  {
    name: 'Priya Patel', role: 'Data Scientist at Meta',
    text: 'The semantic matching feature revealed skill gaps I never knew existed. Absolutely game-changing.',
    rating: 5, avatar: 'PP',
  },
  {
    name: 'Rahul Verma', role: 'ML Engineer at OpenAI',
    text: 'The most sophisticated resume tool I have used. The AI feedback is incredibly precise and actionable.',
    rating: 5, avatar: 'RV',
  },
];

const pricingPlans = [
  {
    name: 'Free', price: '$0', period: '/month',
    features: ['5 resume analyses/month', 'Basic ATS scoring', 'Resume classification', 'Email support'],
    cta: 'Get Started Free', highlight: false,
  },
  {
    name: 'Pro', price: '$19', period: '/month',
    features: ['Unlimited analyses', 'Advanced ATS scoring', 'Semantic matching', 'AI feedback', 'Priority support', 'Analytics dashboard'],
    cta: 'Start Pro Trial', highlight: true,
  },
  {
    name: 'Enterprise', price: '$49', period: '/month',
    features: ['Everything in Pro', 'Team collaboration', 'API access', 'Custom integrations', 'Dedicated support', 'White-label option'],
    cta: 'Contact Sales', highlight: false,
  },
];

const LandingPage: React.FC = () => {
  const typedRole = useTypewriter(
    ['AI Engineer', 'Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer'],
    80, 2200
  );

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-radial from-brand-600/20 to-transparent blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-radial from-accent-600/15 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-radial from-sky-600/10 to-transparent blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-sm font-medium mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Career Intelligence Platform
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-balance"
            >
              AI-Powered{' '}
              <span className="gradient-text">Resume Intelligence</span>
              <br />Platform
            </motion.h1>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="text-lg sm:text-xl text-slate-400 mb-4 max-w-2xl mx-auto"
            >
              Optimize your resume with AI, ATS scoring, semantic matching, and intelligent career insights.
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="text-xl text-slate-300 mb-10 h-8 flex items-center justify-center gap-2"
            >
              <span className="text-slate-500">Perfect for</span>
              <span className="gradient-text font-semibold">{typedRole}</span>
              <span className="w-0.5 h-6 bg-brand-400 cursor-blink" />
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/signup" className="btn-primary text-base px-8 py-3.5 shadow-glow-md">
                Analyze My Resume <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary text-base px-8 py-3.5 gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-brand-400 ml-0.5" />
                </div>
                Watch Demo
              </button>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
              className="flex items-center justify-center gap-6 mt-12 text-sm text-slate-500"
            >
              {['No credit card required', '5 free analyses/month', 'Cancel anytime'].map(item => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-accent-500" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ATS Demo Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-20 max-w-3xl mx-auto"
          >
            <div className="glass-card p-6 shadow-glass">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm text-slate-400 font-medium">ATS Analysis Result</p>
                  <p className="text-lg font-bold text-white mt-0.5">Senior AI Engineer <span className="tag-green ml-2">Excellent Match</span></p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold gradient-text">89</p>
                  <p className="text-xs text-slate-500">ATS Score</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Embedding Score', val: 92 },
                  { label: 'Skill Match', val: 85 },
                  { label: 'Experience Score', val: 78 },
                ].map(item => (
                  <ProgressBar key={item.label} label={item.label} value={item.val} height="h-2" />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 flex-wrap">
                {['Python', 'LangChain', 'FastAPI', 'LLM', 'PyTorch'].map(skill => (
                  <span key={skill} className="tag-green text-xs">{skill}</span>
                ))}
                <span className="text-xs text-slate-500">+4 more matched</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="tag-blue mb-4 inline-flex">Platform Features</span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to <span className="gradient-text">land your dream job</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Our AI engine analyzes every dimension of your resume to give you the competitive edge.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-card p-6 hover:border-white/20 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-glow-sm group-hover:shadow-glow-md transition-all`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-brand-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/5 via-transparent to-accent-600/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Resumes Analyzed' },
              { value: '94%', label: 'Interview Rate Increase' },
              { value: '2.5x', label: 'Faster Job Search' },
              { value: '4.9/5', label: 'User Rating' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-4xl font-bold gradient-text mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="tag-green mb-4 inline-flex">Testimonials</span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by <span className="gradient-text">professionals worldwide</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-6 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-brand-600/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="tag-blue mb-4 inline-flex">Pricing</span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, <span className="gradient-text">transparent pricing</span>
            </h2>
            <p className="text-slate-400">Start free. Upgrade when you're ready.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-6 relative ${plan.highlight ? 'border-brand-500/50 shadow-glow-sm' : 'hover:border-white/20'} transition-all duration-300`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-glow-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-500">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`w-full justify-center ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-accent-600/10" />
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to land your <span className="gradient-text">dream job?</span>
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Join 50,000+ professionals who use ResumAI to optimize their resumes and get hired faster.
              </p>
              <Link to="/signup" className="btn-primary text-base px-10 py-3.5 shadow-glow-md">
                Start for Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
