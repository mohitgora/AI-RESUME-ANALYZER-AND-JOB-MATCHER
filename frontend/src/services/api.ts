import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export interface PredictResponse {
  category: string;
}

export interface ATSResponse {
  role: string;
  final_score: number;
  embedding_score: number;
  skill_score: number;
  experience_score: number;
  role_boost: number;
  resume_skills: string[];
  jd_skills: string[];
  feedback: string;
  explanation: string;
}

export interface SemanticResponse {
  similarity_score: number;
}

export interface UploadResponse {
  category: string;
}

export const predictCategory = async (resume_text: string): Promise<PredictResponse> => {
  const { data } = await api.post('/api/predict', { resume_text });
  return data;
};

export const analyzeATS = async (resume_text: string, job_description: string): Promise<ATSResponse> => {
  const { data } = await api.post('/api/ats', { resume_text, job_description });
  return data;
};

export const semanticMatch = async (resume_text: string, job_description: string): Promise<SemanticResponse> => {
  const { data } = await api.post('/api/semantic', { resume_text, job_description });
  return data;
};

export const uploadResume = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export default api;
