import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  FileText,
  TrendingUp,
  Brain,
  Search,
  Filter,
  Download,
} from "lucide-react";

const history = [
  {
    id: 1,
    role: "AI Engineer",
    score: 91,
    company: "OpenAI",
    date: "2 hours ago",
  },
  {
    id: 2,
    role: "Software Engineer",
    score: 84,
    company: "Google",
    date: "Yesterday",
  },
  {
    id: 3,
    role: "Data Scientist",
    score: 79,
    company: "Meta",
    date: "2 days ago",
  },
  {
    id: 4,
    role: "Backend Engineer",
    score: 88,
    company: "Amazon",
    date: "4 days ago",
  },
];

const HistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Resume History</h1>
          <p className="text-slate-400 mt-2">
            Track all your previous resume analyses
          </p>
        </div>

        <button className="btn-primary">
          <Download className="w-4 h-4" />
          Export History
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search analysis..."
            className="input-field pl-10"
          />
        </div>

        <button className="btn-secondary">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Total Analyses</p>
              <h2 className="text-3xl font-bold mt-2">48</h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center">
              <FileText className="w-7 h-7 text-brand-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Average ATS</p>
              <h2 className="text-3xl font-bold mt-2">86%</h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-green-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">AI Suggestions</p>
              <h2 className="text-3xl font-bold mt-2">126</h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <Brain className="w-7 h-7 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-5">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card p-6 hover:border-brand-500/40 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-5">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{item.role}</h2>

                  <span className="px-3 py-1 rounded-full text-xs bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    ATS {item.score}%
                  </span>
                </div>

                <p className="text-slate-400 mt-2">
                  Resume matched with{" "}
                  <span className="text-white">{item.company}</span>
                </p>

                <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  {item.date}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="btn-secondary">View Report</button>
                <button className="btn-primary">Analyze Again</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;