import React, { createContext, useContext, useState } from 'react';
import type { ATSResponse } from '../services/api';

export interface ResumeAnalysis {
  id: string;
  timestamp: string;
  fileName?: string;
  resumeText: string;
  jobDescription?: string;
  category?: string;
  atsReport?: ATSResponse;
  similarityScore?: number;
}

interface ResumeContextType {
  analyses: ResumeAnalysis[];
  currentAnalysis: ResumeAnalysis | null;
  addAnalysis: (a: ResumeAnalysis) => void;
  setCurrentAnalysis: (a: ResumeAnalysis | null) => void;
  clearHistory: () => void;
}

const ResumeContext = createContext<ResumeContextType>({
  analyses: [],
  currentAnalysis: null,
  addAnalysis: () => {},
  setCurrentAnalysis: () => {},
  clearHistory: () => {},
});

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>(() => {
    try {
      const stored = localStorage.getItem('analyses');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);

  const addAnalysis = (a: ResumeAnalysis) => {
    const updated = [a, ...analyses].slice(0, 50);
    setAnalyses(updated);
    localStorage.setItem('analyses', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setAnalyses([]);
    localStorage.removeItem('analyses');
  };

  return (
    <ResumeContext.Provider value={{ analyses, currentAnalysis, addAnalysis, setCurrentAnalysis, clearHistory }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
