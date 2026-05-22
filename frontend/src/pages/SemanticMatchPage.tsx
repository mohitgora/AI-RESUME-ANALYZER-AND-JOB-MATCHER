import React, { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import axios from "axios";

import {
  Sparkles,
  Loader2,
} from "lucide-react";

const SemanticMatchPage = () => {

  const [resumeText, setResumeText] =
    useState("");

  const [jobDescription, setJobDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [score, setScore] =
    useState<number | null>(null);

  const analyze = async () => {

    try {

      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/semantic",
        {
          resume_text: resumeText,
          job_description: jobDescription,
        }
      );

      setScore(
        Math.round(
          response.data.similarity_score * 100
        )
      );

    } catch (error) {

      console.error(error);

      alert("Semantic Match Failed");

    } finally {

      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold">
            Semantic AI Matching
          </h1>

          <p className="text-gray-400 mt-2">
            Embedding-based AI resume matching
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <textarea
            rows={14}
            value={resumeText}
            onChange={(e) =>
              setResumeText(e.target.value)
            }
            placeholder="Paste Resume..."
            className="bg-white/5 border border-white/10 rounded-3xl p-5 outline-none"
          />

          <textarea
            rows={14}
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            placeholder="Paste Job Description..."
            className="bg-white/5 border border-white/10 rounded-3xl p-5 outline-none"
          />
        </div>

        <button
          onClick={analyze}
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-4 rounded-2xl flex items-center gap-3 font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Matching...
            </>
          ) : (
            <>
              <Sparkles />
              Analyze Semantic Match
            </>
          )}
        </button>

        {score !== null && (

          <div className="bg-white/5 border border-white/10 rounded-3xl p-10">

            <div className="flex flex-col items-center">

              <div className="w-64 h-64 rounded-full border-[18px] border-cyan-500 flex items-center justify-center">

                <div className="text-center">

                  <h2 className="text-7xl font-bold">
                    {score}%
                  </h2>

                  <p className="text-gray-400 mt-3">
                    Semantic Match
                  </p>
                </div>
              </div>

              <p className="mt-8 text-xl text-gray-300 text-center max-w-2xl leading-8">
                Your resume has a strong semantic relationship
                with this job description based on embeddings
                and AI contextual understanding.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SemanticMatchPage;