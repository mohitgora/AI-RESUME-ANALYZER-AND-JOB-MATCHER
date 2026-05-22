import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import axios from "axios";
import {
  Brain,
  Target,
  Sparkles,
  Loader2,
} from "lucide-react";

const ATSReportPage = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<any>(null);

  const analyzeATS = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/ats",
        {
          resume_text: resumeText,
          job_description: jobDescription,
        }
      );

      setResult(response.data);

    } catch (error) {
      console.error(error);
      alert("ATS Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">
            ATS Resume Analyzer
          </h1>

          <p className="text-gray-400 mt-2">
            AI-powered ATS scoring system
          </p>
        </div>

        {/* INPUTS */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* RESUME */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">
              Resume Text
            </h2>

            <textarea
              rows={14}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 outline-none"
              placeholder="Paste your resume..."
            />
          </div>

          {/* JD */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">
              Job Description
            </h2>

            <textarea
              rows={14}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 outline-none"
              placeholder="Paste job description..."
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={analyzeATS}
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-semibold flex items-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles />
              Generate ATS Report
            </>
          )}
        </button>

        {/* RESULT */}
        {result && (
          <div className="space-y-6">

            {/* TOP CARDS */}
            <div className="grid md:grid-cols-3 gap-6">

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">
                      Final ATS Score
                    </p>

                    <h2 className="text-5xl font-bold mt-2">
                      {result.final_score}%
                    </h2>
                  </div>

                  <Target size={50} className="text-cyan-400" />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">
                      Resume Role
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                      {result.role}
                    </h2>
                  </div>

                  <Brain size={50} className="text-purple-400" />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div>
                  <p className="text-gray-400">
                    Semantic Match
                  </p>

                  <h2 className="text-5xl font-bold mt-2">
                    {result.embedding_score}%
                  </h2>
                </div>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">

              <h2 className="text-2xl font-bold">
                AI ATS Breakdown
              </h2>

              {[
                {
                  label: "Embedding Score",
                  value: result.embedding_score,
                  color: "bg-cyan-500",
                },
                {
                  label: "Skill Score",
                  value: result.skill_score,
                  color: "bg-green-500",
                },
                {
                  label: "Experience Score",
                  value: result.experience_score,
                  color: "bg-purple-500",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>

                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full`}
                      style={{
                        width: `${item.value}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* SKILLS */}
            <div className="grid lg:grid-cols-2 gap-6">

              {/* MATCHED */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h2 className="text-2xl font-bold mb-5">
                  Resume Skills
                </h2>

                <div className="flex flex-wrap gap-3">
                  {result.resume_skills?.map(
                    (skill: string) => (
                      <span
                        key={skill}
                        className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-xl"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* JD */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h2 className="text-2xl font-bold mb-5">
                  JD Skills
                </h2>

                <div className="flex flex-wrap gap-3">
                  {result.jd_skills?.map(
                    (skill: string) => (
                      <span
                        key={skill}
                        className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-xl"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* FEEDBACK */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                AI Feedback
              </h2>

              <p className="text-gray-300 leading-8">
                {result.feedback}
              </p>

              <div className="mt-5 p-5 rounded-2xl bg-black/20 border border-white/10">
                <p className="text-gray-300">
                  {result.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ATSReportPage;